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
import { AttendanceController } from "@/restAPI/entities"
import dayjs from "dayjs"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onSelectionChange: (selected: Checkout[]) => void
  selectedStudents: Checkout[]
  onStudentCreated: () => void
}

export function DataTable<TData extends Student, TValue>({
  columns,
  data,
  onSelectionChange,
  selectedStudents,
  onStudentCreated,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false)

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
            const checkoutResults = await Promise.all(selectedRowIndices.map(async (rowIndex) => {
                const requests = new AttendanceController()
                const studentUrl = "http://localhost:8080/student/"
                const attendanceUrl = "http://localhost:8080/attendance/"

                const student = data[rowIndex] as Student
                
                // Check if this student was already selected
                const existingCheckout = selectedStudents.find(c => c.id === student.id)
                const currentDate = dayjs().format('MMM D, YYYY')
                const currentDOW = dayjs().format("dddd")
                const checkInTime = dayjs().format('hh:mm A')
                const checkOutTime = dayjs(currentDate + " " + checkInTime).add(1, 'hours').format('hh:mm A') // assume 1 hour

                /* 
                to update student attendance check:
                check if the day of week even aligns
                    if they do align, then set the attendance of the date that matches to be "Yes" and connect to Google TTS API
                        if that attendance doesn't exist, create a popup message
                    else find the first "Absent" that occurred within the month
                        if found, replace that Absent with Makeup, and change date attended accordingly
                        else create a popup message
                */
                const tempStudent = await requests.getById(studentUrl, student.id)
                console.log(currentDOW === tempStudent.day && tempStudent.payment_number > 0)
                if (currentDOW === tempStudent.day && tempStudent.payment_number > 0) {
                    // find the date within the current payment table
                    const foundAttendance = await requests.getByDateExpectedAndStudentIdAndPaymentNumber(attendanceUrl, currentDate, student.id, tempStudent.payment_number)
                    console.log("foundattendance", foundAttendance)
                    if (foundAttendance === null) {
                        setAlertDialogOpen(true)
                        return null
                    } else {
                        const data = {
                            attendance_id: foundAttendance.attendance_id,
                            student_id: foundAttendance.student_id,
                            payment_number: foundAttendance.payment_number,
                            class_number: foundAttendance.class_number,
                            date_expected: foundAttendance.date_expected,
                            attendance_check: "Yes",
                            date_attended: currentDate,
                            check_in: checkInTime,
                            hours: 1, // fix
                            check_out: checkOutTime,
                            notes: foundAttendance.notes,
                        }

                        await requests.edit(attendanceUrl, data)
                    }
                } else {
                    const foundAbsent = await requests.getFirstAbsentWithinThirtyDays(attendanceUrl)
                    console.log("foundabsent", foundAbsent)
                    if (foundAbsent !== null) {
                        const data = {
                            attendance_id: foundAbsent.attendance_id,
                            student_id: foundAbsent.student_id,
                            payment_number: foundAbsent.payment_number,
                            class_number: foundAbsent.class_number,
                            date_expected: new Date(foundAbsent.date_expected),
                            attendance_check: "Makeup",
                            date_attended: new Date(currentDate),
                            check_in: checkInTime,
                            hours: 1, // fix
                            check_out: checkOutTime,
                            notes: foundAbsent.notes,
                        }
                        
                        await requests.edit(attendanceUrl, data)
                    } else {
                        setAlertDialogOpen(true)
                        console.log("they don't match lol")
                        console.log("payment table not created?")
                        return null
                    }
                }

                if (existingCheckout) {
                    // Keep existing checkout data
                    return existingCheckout
                } else {
                    // Create new checkout with current time
                    const studentDetails = await requests.getById(studentUrl, student.id)
                    return {
                        id: student.id,
                        name: student.name,
                        checkIn: checkInTime,
                        checkOut: checkOutTime,
                        classId: studentDetails.class_id,
                        day: studentDetails.day,
                    }
                }
            }))

            const newSelected: Checkout[] = checkoutResults.filter((checkout): checkout is Checkout => checkout !== null) // filters out null checkouts (so they aren't checked)
            onSelectionChange(newSelected)
        },
        state: {
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div className="mb-4">
            <div>
                <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Error!</AlertDialogTitle>
                        <AlertDialogDescription>
                            User mistmatch error!
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction>Ok</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex justify-between gap-4 py-4">
                <Input
                    placeholder="Search students..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DialogStudentForm onStudentCreated={onStudentCreated}/>
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