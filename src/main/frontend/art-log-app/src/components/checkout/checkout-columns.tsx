// defining the core and appearance of the table
import type { ColumnDef } from "@tanstack/react-table";

export type Checkout = {
    id: number
    name: string
    checkIn: string
    classId: string
    checkOut: string
    day: string
}

export const columns: ColumnDef<Checkout>[] = [
    {
        accessorKey: "name",
        header: "Student Name",
    },
    {
        accessorKey: "checkOut",
        header: "Check Out Time",
    },
    {
        accessorKey: "classId",
        header: "Level",
    },
    {
        accessorKey: "checkIn",
        header: "Check In Time",
    },
    {
        accessorKey: "day",
        header: "Day",
    },
]