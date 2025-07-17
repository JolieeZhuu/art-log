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

// edit student handler
function editStudent() {
    console.log("edit clicked")
}

function deleteStudent() {
    console.log("delete clicked")
}

export type Student = {
    id: number
    name: string
    paymentNotes: string
    notes: string
}

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "name",
        header: "Student Name",
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            const student = row.original
            return <a href="#/students">{name}</a>
        }
    },
    {
        accessorKey: "paymentNotes",
        header: "Payment Notes",
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original
        
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