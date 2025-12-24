import * as React from "react"

// Internal imports
import { columns, type Attendance } from "@/components/payment-tables/payments-columns"
import { DataTable } from "@/components/payment-tables/payments-data-table"
import { getByStudentIdAndTermId, getTermTableByStudentIdAndTableNum } from "@/restAPI/entities"
import { convertTo12Hour } from "./payment-funcs"

// Define the props for the PaymentTable component
interface PaymentTableProps {
    studentId: number;
    tableNum: number;
    onClassAdded?: (refreshFn: () => void) => void;
}

export default function PaymentTable({ studentId, tableNum, onClassAdded }: PaymentTableProps) {

    // Variable initializations
    const attendanceUrl = "http://localhost:8080/attendance/"
    const termUrl = "http://localhost:8080/term/"
    const [data, setData] = React.useState<Attendance[]>([]) // Used to handle async function with useEffect

    const getData = React.useCallback(async (): Promise<void> => { // Changed return type to void
        // Fetch data from API here.
        const termTable = await getTermTableByStudentIdAndTableNum(termUrl, studentId, tableNum)
        console.log("termid:", termTable)
        const attendances = await getByStudentIdAndTermId(attendanceUrl, studentId, termTable.term_id)
        attendances.sort((a: any, b: any) => (a.class_number - b.class_number)) // a-b = lowest to highest, b-a = highest to lowest

        // Variable to store JSX code
        // Deconstruct attendance object and specify which properties to use
        const attendanceValuesList: Attendance[] = attendances.map((
            { attendance_id, student_id, term_id, class_number, payment_number, date_expected, date_attended, attendance_check, check_in, makeup_mins, check_out, notes } : 
            { attendance_id: number, student_id: number, term_id: number, class_number: number, payment_number: number, date_expected: Date, date_attended: Date, attendance_check: string, check_in: string, makeup_mins: string, check_out: string, notes: string }) => {
            return {
                id: attendance_id,
                studentId: student_id,
                termId: term_id,
                classNumber: class_number,
                paymentNumber: payment_number,
                classDate: date_expected,
                attendanceCheck: attendance_check,
                attendedDate: date_attended,
                checkIn: check_in === null ? "" : convertTo12Hour(check_in),
                makeupMins: makeup_mins,
                checkOut: check_out === null ? "" : convertTo12Hour(check_out),
                notes: notes,
            }
        })

        console.log(attendanceValuesList)
        
        setData(attendanceValuesList) // Update state directly
    }, [studentId, tableNum])

    function onClassEdited(updatedClass: Attendance) {
        setData((prev) =>
            prev.map((attendance) =>
                attendance.id === updatedClass.id ? updatedClass : attendance
            )
        )
    }

    function onHoliday(addedClass: Attendance) {
        setData([...data, addedClass])
    }

    React.useEffect(() => {
        getData() // Call the function that updates state
    }, [getData])

    React.useEffect(() => {
        if (onClassAdded) {
            onClassAdded(getData) // Now getData updates the state when called
        }
    }, [onClassAdded, getData]) // Add getData as dependency

    return (
        <DataTable 
            columns={columns({ 
                onUpdate: onClassEdited,
                onAdded: onHoliday,
                tableNum: tableNum
            })} 
            data={data}
        />
    )
}