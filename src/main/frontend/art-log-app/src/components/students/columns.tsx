// defining the core and appearance of the table

import type { ColumnDef } from "@tanstack/react-table";

import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Checkbox } from "@/components/ui/checkbox";

export type Student = {
    id: number
    name: string
    paymentNotes: string
    notes: string
}

export const columns: ColumnDef<Student>[] = [
    {
        id: "select",
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),

        enableSorting: false,
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

            // edit student handler
            function editStudent() {
                console.log("edit clicked")
                console.log(student)
            }

            function deleteStudent() {
                console.log("delete clicked")
            }
        
            return (
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
                        <DropdownMenuItem onClick={editStudent}>Edit Student</DropdownMenuItem>
                        <DropdownMenuItem onClick={deleteStudent}>Delete Student</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]