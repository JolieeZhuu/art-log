// Defining the core and appearance of the table

import * as React from "react"
import { MoreHorizontal } from "lucide-react"

// External imports
import type { FieldPath } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { getById, edit, deleteById, deleteByStudentId, getByPaymentNumberAndStudentIdAndClassNumber } from "@/restAPI/entities";

// UI components
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner"
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
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";

// Define expected valid types for the form fields
// Also defines error messages if input is invalid
const editSchema = z.object({
    firstName: z.string().min(1, {
        error: "First name field cannot be empty.",
    }),
    lastName: z.string().min(1, {
        error: "Last name field cannot be empty.",
    }),
    paymentNotes: z.string(),
    notes: z.string(),
    phoneNumber: z.string().length(10)
})

// Define expected valid types for the form fields
// Also defines error messages if input is invalid
const deleteSchema = z.object({
    confirmation: z.string()
        .refine(val => val === "delete student", {
            message: "Student could not be deleted because input was not correct."
        })
})

const formFieldEditOptions: {
    name: FieldPath<z.infer<typeof editSchema>>
    label: string
}[] = [
    {
        name: "firstName",
        label: "First Name",
    },
    {
        name: "lastName",
        label: "Last Name",
    },
    {
        name: "paymentNotes",
        label: "Payment Notes",
    },
    {
        name: "notes",
        label: "Notes",
    },
    {
        name: "phoneNumber",
        label: "Phone Number",
    },
]

export type Student = {
    id: number
    name: string
    paymentNotes: string
    notes: string
    phoneNumber: string
    checkIn: string
}

export const columns = ({ 
    onUpdate,
    onDelete,
}: { 
    onUpdate: (updated: Student) => void;
    onDelete: (deletedStudentId: number) => void;
}): ColumnDef<Student>[] => [
    {
        id: "action",
        cell: ({ row }) => (
            
            <Checkbox
                checked={row.getIsSelected()}
                disabled={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Student attended class"
            />
        ),

        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: "Student Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            const student = row.original
            return <a href={`#/students/${student.id}`}>{name}</a>
        }
    },
    {
        accessorKey: "paymentNotes",
        header: "Payment Notes",
        cell: ({ row }) => {
            const phrase = row.getValue("paymentNotes") as string
            console.log("phrase", phrase)
            if (phrase !== undefined && phrase !== null) {
                if (phrase.substring(0, 2) === "np") {
                    return <div>{phrase}</div>
                } return
            } return
        }
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const phrase = row.getValue("notes") as string
            if (phrase !== undefined && phrase !== null) {
                if (phrase.length > 15) {
                    const formatted = phrase.substring(0, 12) + "..."
                    return <div>{formatted}</div>
                } return <div>{phrase}</div>
            } return
        }
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => {
            const unformatted = row.getValue("phoneNumber") as string
            const formatted = `(${unformatted.slice(0, 3)})-${unformatted.slice(3, 6)}-${unformatted.slice(6)}`
            return <div>{formatted}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original
            const studentUrl = "http://localhost:8080/student/"
            const attendanceUrl = "http://localhost:8080/attendance/"

            const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

            // Define form and default values
            const editForm = useForm<z.infer<typeof editSchema>>({
                resolver: zodResolver(editSchema),
                defaultValues: {
                    firstName: student.name.split(" ")[0],
                    lastName: student.name.split(" ")[1],
                    paymentNotes: student.paymentNotes,
                    notes: student.notes,
                    phoneNumber: student.phoneNumber,
                },
            })
            
            // Define form and default values
            const deleteForm = useForm<z.infer<typeof deleteSchema>>({
                resolver: zodResolver(deleteSchema),
                defaultValues: {
                    confirmation: "",
                },
            })

            React.useEffect(() => {
                if (isDeleteDialogOpen) {
                    deleteForm.reset({ confirmation: "" });
                }
            }, [isDeleteDialogOpen, deleteForm]); // Reset form when user opens dialog again

            // Edit student handler
            async function editStudent(values: z.infer<typeof editSchema>) {

                const storeStudent = await getById(studentUrl, student.id)
                const storeClass = await getByPaymentNumberAndStudentIdAndClassNumber(attendanceUrl, storeStudent.payment_number, student.id, storeStudent.class_number)

                console.log("edit clicked")
                console.log(values)
                const data1 = {
                    student_id: student.id,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    class_id: storeStudent.class_id,
                    day: storeStudent.day,
                    phone_number: values.phoneNumber,
                    general_notes: values.notes,
                    payment_number: storeStudent.payment_number,
                    class_number: storeStudent.class_number,
                    time_expected: storeStudent.time_expected
                }

                const data2 = {
                    attendance_id: storeClass.attendance_id,
                    student_id: storeClass.student_id,
                    payment_number: storeClass.payment_number,
                    class_number: storeClass.class_number,
                    date_expected: storeClass.date_expected,
                    attendance_check: storeClass.attendance_check,
                    date_attended: storeClass.date_attended,
                    check_in: storeClass.check_in,
                    hours: storeClass.hours,
                    check_out: storeClass.check_out,
                    payment_notes: values.paymentNotes,
                    term_notes: storeClass.term_notes,
                    notes: storeClass.notes
                }

                const updatedStudent = {
                    id: student.id,
                    name: values.firstName + " " + values.lastName,
                    paymentNotes: values.paymentNotes,
                    notes: values.notes,
                    phoneNumber: values.phoneNumber,
                    checkIn: "",
                }

                onUpdate(updatedStudent) // Update the student in the parent component so no need to refresh the page

                await edit(studentUrl, data1)
                await edit(attendanceUrl, data2)
                setIsEditDialogOpen(false)
                toast(`${values.firstName} ${values.lastName} has been edited.`)
            }

            // Delete student handler
            async function deleteStudent() {
                const storeStudent = await getById(studentUrl, student.id)

                await deleteByStudentId(attendanceUrl, student.id)

                await deleteById(studentUrl, student.id)

                onDelete(student.id) // Update the student in the parent component so no need to refresh the page

                setIsDeleteDialogOpen(false)
                deleteForm.reset() // Reset form values after it closes
                toast(`${storeStudent.first_name} ${storeStudent.last_name} has been deleted.`)
            }
        
            return (
                <>
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
                            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit Student</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>Delete Student</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Render display for editDialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={isEditDialogOpen ? setIsEditDialogOpen : setIsDeleteDialogOpen}>
                        <DialogContent>
                            <Form {...editForm}>
                                <form onSubmit={editForm.handleSubmit(editStudent)} className="space-y-8 w-full">
                                    <DialogHeader>
                                        <DialogTitle>Edit Student: {student.name}</DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>
                                    {formFieldEditOptions.map((item) => (
                                        <FormField
                                            key={item.label}
                                            control={editForm.control}
                                            name={item.name}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{item.label}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="w-full"/>
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
                        <DialogContent>
                            <Form {...deleteForm}>
                                <form onSubmit={deleteForm.handleSubmit(deleteStudent)} className="space-y-8 w-full">
                                    <DialogHeader>
                                        <DialogTitle>Delete Student: {student.name}</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete the student, {student.name}? You can't undo this action.
                                        </DialogDescription>
                                        <DialogDescription>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FormField
                                        control={deleteForm.control}
                                        name="confirmation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Type "delete student" to confirm.
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="w-full"/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button type="submit">Delete Student</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                
                </>
            )
        },
    },
]