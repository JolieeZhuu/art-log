// Defining the core and appearance of the table
import type { ColumnDef } from "@tanstack/react-table";

export type Checkout = {
    id: number
    name: string
    checkIn: string
    classId: string
    checkOut: string
    day: string
    crossedOut: boolean
}

export const columns: ColumnDef<Checkout>[] = [
    {
        accessorKey: "name",
        header: "Student Name",
        cell: ({ row }) => { 
            // Specifying formatting for the cell
            // Strikethrough if the student finishes class
            const student = row.original;
            return (
                <span className={student.crossedOut ? "line-through" : ""}>
                    {student.name}
                </span>
            );
        },
    },
    {
        accessorKey: "checkOut",
        header: "Check Out Time",
        cell: ({ row }) => {
            // Specifying formatting for the cell
            // Strikethrough if the student finishes class
            const student = row.original;
            return (
                <span className={student.crossedOut ? "line-through" : ""}>
                    {student.checkOut}
                </span>
            );
        },
    },
    {
        accessorKey: "classId",
        header: "Level",
        cell: ({ row }) => {
            // Specifying formatting for the cell
            // Strikethrough if the student finishes class
            const student = row.original;
            return (
                <span className={student.crossedOut ? "line-through" : ""}>
                    {student.classId}
                </span>
            );
        },
    },
    {
        accessorKey: "checkIn",
        header: "Check In Time",
        cell: ({ row }) => {
            // Specifying formatting for the cell
            // Strikethrough if the student finishes class
            const student = row.original;
            return (
                <span className={student.crossedOut ? "line-through" : ""}>
                    {student.checkIn}
                </span>
            );
        },
    },
    {
        accessorKey: "day",
        header: "Day",
        cell: ({ row }) => {
            // Specifying formatting for the cell
            // Strikethrough if the student finishes class
            const student = row.original;
            return (
                <span className={student.crossedOut ? "line-through" : ""}>
                    {student.day}
                </span>
            );
        },
    },
]