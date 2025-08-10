// Defining the core and appearance of the table

import * as React from "react"
import { MoreHorizontal, ChevronDownIcon } from "lucide-react"

// External imports
import dayjs from 'dayjs'
import type { FieldPath } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { getTotalClasses, addClass } from '@/components/payment-tables/payment-funcs'
import { edit, getByPaymentNumberAndStudentIdAndClassNumber } from '@/restAPI/entities'

// UI components
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ComboboxOptions } from "@/components/combobox-options"
import { Input } from "@/components/ui/input"

// Define expected valid types for the form fields
// Also defines error messages if input is invalid
const editSchema = z.object({
    dateExpected: z.date({
        message: "Class date is required."
    }),
    attendanceCheck: z.string(),
    dateAttended: z.optional(z.date()),
    checkIn: z.optional(z.string()),
    makeupMins: z.optional(z.string()),
    checkOut: z.optional(z.string()),
    notes: z.optional(z.string()),
})

const formFieldOptions: {
    name: FieldPath<z.infer<typeof editSchema>>
    label: string
}[] = [
    {
        name: "checkIn",
        label: "Check In Time",
    },
    {
        name: "makeupMins",
        label: "Makeup Mins",
    },
    {
        name: "checkOut",
        label: "Check Out Time",
    },
    {
        name: "notes",
        label: "Notes",
    },
]

// Options for the attendance check combobox
const attendanceCheckOptions = [
    {
        value: "Yes",
        label: "Yes",
    },
    {
        value: "Absent",
        label: "Absent",
    },
    {
        value: "Holiday",
        label: "Holiday",
    },
]


export type Attendance = {
    id: number
    studentId: number
    classNumber: number
    paymentNumber: number
    classDate: string
    attendanceCheck: string
    attendedDate: string
    checkIn: string
    makeupMins: string
    checkOut: string
    notes: string
}

export const columns: ColumnDef<Attendance>[] = [
    {
        accessorKey: "classNumber",
        header: "Class",
    },
    {
        accessorKey: "classDate",
        header: "Class Date",
        cell: ({ row }) => {
            // Format the class date to a more readable format
            const classDate: string = row.getValue("classDate")
            const formatted = dayjs(classDate).format("MMM DD, YYYY")

            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: "attendanceCheck",
        header: "Attd. Check",
    },
    {
        accessorKey: "attendedDate",
        header: "Attd. Date",
        cell: ({ row }) => {
            // Format the class date to a more readable format
            const attendedDate: string = row.getValue("attendedDate")
            const formatted = attendedDate ? dayjs(attendedDate).format("MMM DD, YYYY") : ""

            return <div>{formatted}</div>
        },
    },
    {
        accessorKey: "checkIn",
        header: "Check In",
    },
    {
        accessorKey: "makeupMins",
        header: "Makeup Mins",
    },
    {
        accessorKey: "checkOut",
        header: "Check Out",
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const attendance = row.original
            
            const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
            
            const [openPopover1, setOpenPopover1] = React.useState(false) // For the calendar popover 1
            const [openPopover2, setOpenPopover2] = React.useState(false) // For the calendar popover 2

            // Setting default values for the form
            const form = useForm<z.infer<typeof editSchema>>({
                resolver: zodResolver(editSchema),
                defaultValues: {
                    dateExpected: new Date(attendance.classDate),
                    attendanceCheck: attendance.attendanceCheck ? attendance.attendanceCheck : "", 
                    dateAttended: undefined,
                    checkIn: attendance.checkIn ? attendance.checkIn : "",
                    makeupMins: attendance.makeupMins ? attendance.makeupMins : "",
                    checkOut: attendance.checkOut ? attendance.checkOut : "",
                    notes: attendance.notes ? attendance.notes : "",
                },
            })

            // Edit student handler
            async function editClass(values: z.infer<typeof editSchema>) {
                // initializations
                const attendanceUrl = "http://localhost:8080/attendance/"

                const formattedDateExpected = dayjs(values.dateExpected.toString()).format("MMM D, YYYY")
                console.log("edit clicked")
                console.log("values", values)
                console.log("attendance", attendance)

                // Case 1: if they change class date, every class # from that point and onwards must be changed as well
                if (formattedDateExpected !== attendance.classDate) {

                    const currClassNumber = attendance.classNumber
                    const lastClassNumber: number = await getTotalClasses(attendance.studentId)
                    for (let i = 0; i <= lastClassNumber - currClassNumber; i++) {
                        const currClass = await getByPaymentNumberAndStudentIdAndClassNumber(attendanceUrl, attendance.paymentNumber, attendance.studentId, currClassNumber + i)

                        // First class is the one being edited, so there may be new values
                        if (i === 0) {            
                            const data = {
                                attendance_id: currClass.attendance_id,
                                student_id: attendance.studentId,
                                class_number: currClassNumber + i,
                                payment_number: attendance.paymentNumber,
                                date_expected: dayjs(formattedDateExpected).add(7*i, "days").toDate(),
                                attendance_check: values.attendanceCheck,
                                date_attended: values.dateAttended !== undefined ? dayjs(values.dateAttended?.toString()).toDate() : "",
                                check_in: values.checkIn,
                                hours: 1, // fix makeup minds and hours confusion
                                check_out: values.checkOut,
                                notes: values.notes,
                            }
                            await edit(attendanceUrl, data)
                        } else {
                            // The following classes will only have expected date changed
                            // Other values will remain the same (or set to default?)
                            const data = {
                                attendance_id: currClass.attendance_id,
                                student_id: attendance.studentId,
                                class_number: currClassNumber + i,
                                payment_number: attendance.paymentNumber,
                                date_expected: dayjs(formattedDateExpected).add(7*i, "days").toDate(),
                                attendance_check: "",
                                date_attended: "",
                                check_in: "",
                                hours: 1, // fix makeup mins and hours confusion
                                check_out: "",
                                notes: "",
                            }
                            await edit(attendanceUrl, data)
                        }
                    }

                    // Check if holiday (will need to add a new class to the end of the list)
                    if (values.attendanceCheck === "Holiday" && values.attendanceCheck !== attendance.attendanceCheck) {
                        await addClass(attendance.paymentNumber, attendance.studentId)
                    }
                } else {
                    // Case 2: if they do not change class date, then only the values of the class being edited will be changed
                    const data = {
                        attendance_id: attendance.id,
                        student_id: attendance.studentId,
                        class_number: attendance.classNumber,
                        payment_number: attendance.paymentNumber,
                        date_expected: dayjs(values.dateExpected.toString()).toDate(),
                        attendance_check: values.attendanceCheck,
                        date_attended: values.dateAttended?.toString() !== undefined ? dayjs(values.dateAttended?.toString()).toDate() : "",
                        check_in: values.checkIn,
                        hours: 1, // fix makeup minds and hours confusion
                        check_out: values.checkOut,
                        notes: values.notes,
                    }

                    await edit(attendanceUrl, data)

                    /* !!!!!!
                    for holiday attendance check, holidays should be a customized list from the user, 
                    and then the program will automatically identify when the holiday occurs
                    !!!!!!!!!
                    */

                    // Check if holiday (will need to add a new class to the end of the list)
                    console.log("checking holiday", values.attendanceCheck === "Holiday") // DEBUG
                    if (values.attendanceCheck === "Holiday" && values.attendanceCheck !== attendance.attendanceCheck) {
                        await addClass(attendance.paymentNumber, attendance.studentId)
                    }
                }
                setIsEditDialogOpen(false)
                console.log("edited")
            }
        
            return (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit Class</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Render display for editDialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={isEditDialogOpen ? setIsEditDialogOpen : setIsDeleteDialogOpen}>
                        <DialogContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(editClass)} className="space-y-8 w-full">
                                    <DialogHeader>
                                        <DialogTitle>Edit Class: #{attendance.classNumber}</DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>
                                    {/* Display date picker for class date */}
                                    <FormField
                                        control={form.control}
                                        name="dateExpected"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Class Date</FormLabel>
                                                <FormControl>
                                                    <Popover open={openPopover1} onOpenChange={setOpenPopover1} {...field}>
                                                        <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                            <ChevronDownIcon />
                                                        </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                captionLayout="dropdown"
                                                                onSelect={(selectedDate) => {
                                                                    field.onChange(selectedDate)
                                                                    setOpenPopover1(false)
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {/* Display combo box for attendance check */}
                                    <FormField
                                        control={form.control}
                                        name="attendanceCheck"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Attendance Check</FormLabel>
                                                <FormControl>
                                                    <ComboboxOptions
                                                        options={attendanceCheckOptions}
                                                        value={field.value} 
                                                        onChange={field.onChange} 
                                                        selectPhrase="Select..."
                                                        commandEmpty="Selection not found."
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {/* Display date picker for attended date */}
                                    <FormField
                                        control={form.control}
                                        name="dateAttended"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Attended Date</FormLabel>
                                                <FormControl>
                                                    
                                                    <Popover open={openPopover2} onOpenChange={setOpenPopover2} {...field}>
                                                        <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            id="date"
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                            <ChevronDownIcon />
                                                        </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                captionLayout="dropdown"
                                                                onSelect={(selectedDate) => {
                                                                    field.onChange(selectedDate)
                                                                    setOpenPopover2(false)
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    {formFieldOptions.map((item) => (
                                        <FormField
                                            key={item.label}
                                            control={form.control}
                                            name={item.name}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{item.label}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : field.value} className="w-full"/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Edit Student</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>

                    {/* Render display for deleteDialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={isDeleteDialogOpen ? setIsDeleteDialogOpen : setIsEditDialogOpen}>
                        <DialogContent>hello deleteDialog</DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]