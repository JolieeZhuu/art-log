// defining the core and appearance of the table
import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react"
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

// external imports
import type { FieldPath } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // zod is used for input validation

import { Checkbox } from "@/components/ui/checkbox";

import { Controller } from "@/restAPI/entities";

const editSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name field cannot be empty.",
    }),
    lastName: z.string().min(1, {
        message: "Last name field cannot be empty.",
    }),
    paymentNotes: z.string(),
    notes: z.string(),
})

const formFieldOptions: {
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
]

export type Student = {
    id: number
    name: string
    paymentNotes: string
    notes: string
    checkIn: string
}

export const columns = ({ onUpdate }: { onUpdate: (updated: Student) => void }): ColumnDef<Student>[] => [
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
            if (phrase.length > 20) {
                const formatted = phrase.substring(0, 17) + "..."
                return <div>{formatted}</div>
            } return <div>{phrase}</div>
        }
    },
    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const phrase = row.getValue("notes") as string
            if (phrase.length > 15) {
                const formatted = phrase.substring(0, 12) + "..."
                return <div>{formatted}</div>
            } return <div>{phrase}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original
            const requests = new Controller()
            const studentUrl = "http://localhost:8080/student/"

            const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

            // define form
            const form = useForm<z.infer<typeof editSchema>>({
                resolver: zodResolver(editSchema),
                defaultValues: {
                    firstName: student.name.split(" ")[0],
                    lastName: student.name.split(" ")[1],
                    paymentNotes: student.paymentNotes,
                    notes: student.notes
                },
            })

            // edit student handler
            async function editStudent(values: z.infer<typeof editSchema>) {

                const storeStudent = await requests.getById(studentUrl, student.id)

                console.log("edit clicked")
                console.log(values)
                const data = {
                    student_id: student.id,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    class_id: storeStudent.class_id,
                    day: storeStudent.day,
                    phone_number: storeStudent.phone_number,
                    payment_notes: values.paymentNotes,
                    notes: values.notes,
                    payment_number: storeStudent.payment_number,
                    class_number: storeStudent.class_number,
                    time_expected: storeStudent.time_expected
                }

                const updatedStudent = {
                    id: student.id,
                    name: values.firstName + " " + values.lastName,
                    paymentNotes: values.paymentNotes,
                    notes: values.notes,
                    checkIn: "",
                }

                onUpdate(updatedStudent)

                await requests.edit(studentUrl, data)
                setIsEditDialogOpen(false)
                console.log("save clicked");
                toast(`${values.firstName} ${values.lastName} has been edited.`)
            }

            function deleteStudent() {
                console.log("delete clicked")
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

                    { /* render display for editDialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={isEditDialogOpen ? setIsEditDialogOpen : setIsDeleteDialogOpen}>
                        <DialogContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(editStudent)} className="space-y-8 w-full">
                                    <DialogHeader>
                                        <DialogTitle>Edit Student: {student.name}</DialogTitle>
                                        <DialogDescription></DialogDescription>
                                    </DialogHeader>
                                    {formFieldOptions.map((item) => (
                                        <FormField
                                            key={item.label}
                                            control={form.control}
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

                    { /* render display for deleteDialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={isDeleteDialogOpen ? setIsDeleteDialogOpen : setIsEditDialogOpen}>
                        <DialogContent>hello deleteDialog</DialogContent>
                    </Dialog>
                
                </>
            )
        },
    },
]