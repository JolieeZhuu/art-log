import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DialogStudentForm } from "@/components/dialog-student-form"
import { type Checkout } from "@/components/checkout/checkout-columns"
import { type  Student } from "./student-columns"
import { Controller } from "@/restAPI/entities"
import dayjs from "dayjs"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onSelectionChange: (selected: Checkout[]) => void
  selectedStudents: Checkout[]
}

export function DataTable<TData extends Student, TValue>({
  columns,
  data,
  onSelectionChange,
  selectedStudents,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    
    // convert selectedIds array to the format TanStack Table expects
    // so rather than passing an array of numbers, it passes a map like {"0": true, "1": true}
    const rowSelection = React.useMemo(() => {
        const selection: Record<string, boolean> = {} // format of TanStack Table
        selectedStudents.forEach(student => {
            const rowIndex = data.findIndex(item => item.id === student.id)
            if (rowIndex !== -1) {
                selection[rowIndex.toString()] = true
            }
        })
        return selection
    }, [selectedStudents, data]) // only when selectedIds or data changes

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: async (updater) => {
            // handle the row selection change (used instead of a useEffect function)
            const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
            
            // Get currently selected row indices
            const selectedRowIndices = Object.keys(newSelection)
                .filter(key => newSelection[key])
                .map(key => parseInt(key))
            
            // Create new Checkout array
            const newSelected: Checkout[] = await Promise.all(selectedRowIndices.map(async (rowIndex) => {
                const requests = new Controller()
                const studentUrl = "http://localhost:8080/student/"

                const student = data[rowIndex] as Student
                
                // Check if this student was already selected
                const existingCheckout = selectedStudents.find(c => c.id === student.id)
                const currentDate = dayjs().format('MMM D, YYYY')
                const checkInTime = dayjs().format('hh:mm A')
                const checkOutTime = dayjs(currentDate + " " + checkInTime).add(1, 'hours').format('hh:mm A') // assume 1 hour
                
                if (existingCheckout) {
                    // Keep existing checkout data
                    return existingCheckout
                } else {
                    // Create new checkout with current time
                    const studentDetails = await requests.getById(studentUrl, student.id)
                    return {
                        id: student.id,
                        name: student.name,
                        checkIn: checkInTime, // Current time
                        checkOut: checkOutTime,
                        classId: studentDetails.class_id, // You'll need to get this from your student data
                        day: studentDetails.day, // You'll need to get this from your student data
                    }
                }
            }))
            
            onSelectionChange(newSelected)
        },
        state: {
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div className="mb-4">
            <div className="flex justify-between gap-4 py-4">
                <Input
                    placeholder="Search students..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DialogStudentForm/>
            </div>
            
            <ScrollArea className="h-[300px] rounded-md border">
                <Table>
                    <TableHeader className="sticky top-0 bg-secondary z-20">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}  className="text-left">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}