// defining the core and appearance of the table
import * as React from "react"

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

// external imports
import type { FieldPath } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // zod is used for input validation

export type Attendance = {
    id: number
    classNumber: number
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
        header: "Class No.",
    },
    {
        accessorKey: "classDate",
        header: "Class Date",
    },
    {
        accessorKey: "attendanceCheck",
        header: "Attd. Check",
    },
    {
        accessorKey: "attendedDate",
        header: "Attd. Date",
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
            const student = row.original
            
            const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

            // edit student handler
            function editClass() {
                console.log("edit clicked")
                console.log(student)
            }

            function deleteClass() {
                console.log("delete clicked")
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
                            <DropdownMenuItem onClick={editClass}>Edit Class</DropdownMenuItem>
                            <DropdownMenuItem onClick={deleteClass}>Delete Class</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    { /* render display for editDialog */}

                    { /* render display for deleteDialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={isDeleteDialogOpen ? setIsDeleteDialogOpen : setIsEditDialogOpen}>
                        <DialogContent>hello deleteDialog</DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]