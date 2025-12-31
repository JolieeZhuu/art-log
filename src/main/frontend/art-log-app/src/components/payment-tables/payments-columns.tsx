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
import { getTotalClasses, addClass, convertTo24Hour } from '../../components/payment-tables/payment-funcs'
import { edit, getByTermIdAndStudentIdAndClassNumber, getTermTableByStudentIdAndTableNum } from '../../restAPI/entities'

// UI components
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { ComboboxOptions } from "../../components/form-features/combobox-options"
import { Input } from "../../components/ui/input"

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
    paymentNotes: z.optional(z.string()),
    termNotes: z.optional(z.string()),
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
    {
        value: "Pushback",
        label: "Pushback",
    },
    {
        value: "Used",
        label: "Used",
    },
    {
        value: "Expired",
        label: "Expired",
    },
]


export type Attendance = {
    id: number
    studentId: number
    termId: number
    classNumber: number
    classDate: string
    attendanceCheck: string
    attendedDate: string
    checkIn: string
    makeupMins: string
    checkOut: string
    notes: string
}

export const columns = ({
    onUpdate,
    onAdded,
    tableNum
}: {
    onUpdate: (updated: Attendance) => void,
    onAdded: (newClass: Attendance) => void
    tableNum: number
}): ColumnDef<Attendance>[] => [
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
                    dateExpected: dayjs(attendance.classDate).toDate(),
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
                const termUrl = "http://localhost:8080/term/"

                const formattedDateExpected = dayjs(values.dateExpected.toString()).format("YYYY-MM-DD")
                console.log("formatted date", formattedDateExpected)
                console.log("edit clicked")
                console.log("values", values)
                console.log("attendance", attendance)

                // Case 1: if they change class date, every class # from that point and onwards must be changed as well
                if (formattedDateExpected !== attendance.classDate) {
                    console.log("case 1") // debug
                    const currClassNumber = attendance.classNumber
                    const lastClassNumber: number = await getTotalClasses(attendance.studentId)
                    const termTable = await getTermTableByStudentIdAndTableNum(termUrl, attendance.studentId, tableNum)
                    for (let i = 0; i <= lastClassNumber - currClassNumber; i++) {
                        const currClass = await getByTermIdAndStudentIdAndClassNumber(attendanceUrl, termTable.term_id, attendance.studentId, currClassNumber + i)

                        // First class is the one being edited, so there may be new values
                        if (i === 0) {            
                            const data = {
                                attendance_id: currClass.attendance_id,
                                student_id: attendance.studentId,
                                term_id: attendance.termId,
                                class_number: currClassNumber + i,
                                date_expected: dayjs(formattedDateExpected).add(7*i, "days").toDate(),
                                attendance_check: values.attendanceCheck,
                                date_attended: values.dateAttended !== undefined ? dayjs(values.dateAttended?.toString()).toDate() : "",
                                check_in: values.checkIn == "" ? null : convertTo24Hour(values.checkIn),
                                hours: 0, // fix makeup minds and hours confusion
                                check_out: values.checkOut == "" ? null : convertTo24Hour(values.checkOut),
                                notes: values.notes,
                            }
                            await edit(attendanceUrl, data)

                            const dataToUpdate: Attendance = {
                                id: currClass.attendance_id,
                                studentId: attendance.studentId,
                                termId: attendance.termId,
                                classNumber: currClassNumber + i,
                                classDate: dayjs(formattedDateExpected).add(7*i, "days").format("MMMM D, YYYY"),
                                attendanceCheck: values.attendanceCheck,
                                attendedDate: values.dateAttended !== undefined ? dayjs(values.dateAttended?.toString()).format("MMMM D, YYYY") : "",
                                checkIn: values.checkIn == undefined ? "" : values.checkIn,
                                makeupMins: "", // fix makeup minds and hours confusion
                                checkOut: values.checkOut == undefined ? "" : values.checkOut,
                                notes: values.notes == undefined ? "" : values.notes,
                            }
                            onUpdate(dataToUpdate)
                        } else {
                            // The following classes will only have expected date changed
                            // Other values will remain the same (or set to default?)
                            const data = {
                                attendance_id: currClass.attendance_id,
                                student_id: attendance.studentId,
                                term_id: attendance.termId,
                                class_number: currClassNumber + i,
                                date_expected: dayjs(formattedDateExpected).add(7*i, "days").toDate(),
                                attendance_check: "",
                                date_attended: "",
                                check_in: null,
                                hours: 0, // fix makeup mins and hours confusion
                                check_out: null,
                                notes: "",
                            }
                            await edit(attendanceUrl, data)

                            const dataToUpdate: Attendance = {
                                id: currClass.attendance_id,
                                studentId: attendance.studentId,
                                termId: attendance.termId,
                                classNumber: currClassNumber + i,
                                classDate: dayjs(formattedDateExpected).add(7*i, "days").format("MMMM D, YYYY"),
                                attendanceCheck: "",
                                attendedDate: "",
                                checkIn: "",
                                makeupMins: "", // fix makeup minds and hours confusion
                                checkOut: "",
                                notes: "",
                            }
                            onUpdate(dataToUpdate)
                        }
                    }

                    // Check if holiday (will need to add a new class to the end of the list)
                    if ((values.attendanceCheck === "Holiday" || values.attendanceCheck === "Pushback") && values.attendanceCheck !== attendance.attendanceCheck) {
                        const response = await addClass(tableNum, attendance.studentId)
                        const dataToUpdate: Attendance = {
                            id: response.attendance_id,
                            studentId: response.student_id,
                            termId: response.termId,
                            classNumber: response.class_number,
                            classDate: dayjs(response.date_expected).format("MMMM D, YYYY"),
                            attendanceCheck: "",
                            attendedDate: "",
                            checkIn: "",
                            makeupMins: "", // fix makeup minds and hours confusion
                            checkOut: "",
                            notes: "",
                        }
                        onAdded(dataToUpdate)
                    }
                } else {
                    // Case 2: if they do not change class date, then only the values of the class being edited will be changed
                    console.log("case 2") // debug
                    
                    const data = {
                        attendance_id: attendance.id,
                        student_id: attendance.studentId,
                        term_id: attendance.termId,
                        class_number: attendance.classNumber,
                        date_expected: dayjs(values.dateExpected.toString()).toDate(),
                        attendance_check: values.attendanceCheck,
                        date_attended: values.dateAttended?.toString() !== undefined ? dayjs(values.dateAttended?.toString()).toDate() : "",
                        check_in: values.checkIn == "" ? null : convertTo24Hour(values.checkIn),
                        hours: 0, // fix makeup minds and hours confusion
                        check_out: values.checkOut == "" ? null : convertTo24Hour(values.checkOut),
                        notes: values.notes,
                    }
                    await edit(attendanceUrl, data)

                    /* !!!!!!
                    for holiday attendance check, holidays should be a customized list from the user, 
                    and then the program will automatically identify when the holiday occurs
                    !!!!!!!!!
                    */

                    // Check if holiday (will need to add a new class to the end of the list)
                    console.log("checking holiday", (values.attendanceCheck === "Holiday" || values.attendanceCheck === "Pushback")) // DEBUG
                    if ((values.attendanceCheck === "Holiday" || values.attendanceCheck === "Pushback") && values.attendanceCheck !== attendance.attendanceCheck) {
                        const response = await addClass(tableNum, attendance.studentId)
                        const dataToUpdate: Attendance = {
                            id: response.attendance_id,
                            studentId: response.student_id,
                            termId: response.term_id,
                            classNumber: response.class_number,
                            classDate: dayjs(response.date_expected).format("MMMM D, YYYY"),
                            attendanceCheck: "",
                            attendedDate: "",
                            checkIn: "",
                            makeupMins: "", // fix makeup minds and hours confusion
                            checkOut: "",
                            notes: "",
                        }
                        onAdded(dataToUpdate)
                    }

                    const dataToUpdate: Attendance = {
                        id: attendance.id,
                        studentId: attendance.studentId,
                        termId: attendance.termId,
                        classNumber: attendance.classNumber,
                        classDate: dayjs(values.dateExpected.toString()).format("MMMM D, YYYY"),
                        attendanceCheck: values.attendanceCheck,
                        attendedDate: values.dateAttended !== undefined ? dayjs(values.dateAttended?.toString()).format("MMMM D, YYYY") : "",
                        checkIn: values.checkIn == undefined ? "" : values.checkIn,
                        makeupMins: "", // fix makeup minds and hours confusion
                        checkOut: values.checkOut == undefined ? "" : values.checkOut,
                        notes: values.notes == undefined ? "" : values.notes,
                    }
                    onUpdate(dataToUpdate)
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