import * as React from "react"

import { columns, type Attendance } from "@/components/payments/payments-columns"
import { DataTable } from "@/components/payments/payments-data-table"

import { AttendanceController } from "@/restAPI/entities"

export default function PaymentTable({ studentId, paymentNumber }: { studentId: number, paymentNumber: number }) {

    // variable initializations
    const requests = new AttendanceController()
    const attendanceUrl = "http://localhost:8080/attendance/"
    const [data, setData] = React.useState<Attendance[]>([]) // used to handle async function with useEffect

    async function getData(): Promise<Attendance[]> {
        // Fetch data from your API here.
        const attendances = await requests.getByStudentIdAndPaymentNumber(attendanceUrl, studentId, paymentNumber);
        attendances.sort((a: any, b: any) => (a.class_number - b.class_number)); // a-b = lowest to highest, b-a = highest to lowest

        // variable to store JSX code
        const attendanceValuesList: Attendance[] = attendances.map(({ attendance_id, class_number, date_expected, date_attended, attendance_check, check_in, makeup_mins, check_out, notes } : { attendance_id: number, class_number: number, date_expected: string, date_attended: string, attendance_check: string, check_in: string, makeup_mins: string, check_out: string, notes: string }) => {
            return {
                id: attendance_id,
                classNumber: class_number,
                classDate: date_expected,
                attendanceCheck: attendance_check,
                attendedDate: date_attended,
                checkIn: check_in,
                makeupMins: makeup_mins,
                checkOut: check_out,
                notes: notes,
            }
        })
        return attendanceValuesList
    }

    React.useEffect(() => {
        getData().then((data) => setData(data))
    }, [studentId, paymentNumber])

    return (
        <DataTable columns={columns} data={data} />
    )
}