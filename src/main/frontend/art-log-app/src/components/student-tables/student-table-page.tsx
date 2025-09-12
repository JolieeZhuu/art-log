import * as React from "react"

// Internal imports
import { columns, type Student } from "@/components/student-tables/student-columns"
import { DataTable } from "@/components/student-tables/student-data-table"
import { getByDayAndExpectedTime, getByPaymentNumberAndStudentIdAndClassNumber } from "@/restAPI/entities"
import { type Checkout } from "@/components/checkout-tables/checkout-columns"

export default function StudentTable({ dayOfWeek, setSelectedStudents, selectedStudents } : { dayOfWeek: string; setSelectedStudents: (selected: Checkout[]) => void; selectedStudents: Checkout[] }) {

    // variable initializations
    const studentUrl = "http://localhost:8080/student/"
    const attendanceUrl = "http://localhost:8080/attendance/"
    const [data, setData] = React.useState<Student[]>([]) // Used to handle async function with useEffect

    async function getData(): Promise<Student[]> {
        try {
            // Fetch data from API
            const studentList = await getByDayAndExpectedTime(studentUrl, dayOfWeek)
            console.log("studentList:", studentList)

            if (!Array.isArray(studentList)) {
                console.error("Data fetched is not an array:", studentList)
                return []
            }
            // Store values to be used during editMode
            const studentValuesList: Student[] = await Promise.all(studentList.map(async ({ student_id, first_name, last_name, general_notes, phone_number, payment_number, class_number } : { student_id: number, first_name: string, last_name: string, general_notes: string, phone_number: string, payment_number: number, class_number: number }) => {
                const attendanceClass = await getByPaymentNumberAndStudentIdAndClassNumber(attendanceUrl, payment_number, student_id, class_number) // could be null
                return {
                    id: student_id,
                    name: `${first_name} ${last_name}`,
                    paymentNotes: attendanceClass !== null ? attendanceClass.payment_notes : "",
                    notes: general_notes,
                    phoneNumber: phone_number,
                    checkIn: "",
                }
            }))
            console.log(studentValuesList)
            

            return studentValuesList

        } catch (error) {
            console.error("Error fetching student data:", error)
            return []
        }
    }

    React.useEffect(() => {
        getData().then((data) => setData(data))
    }, [dayOfWeek])

    async function handleNewData() {
        const newData = await getData()
        setData(newData)
    }

    function handleEditUpdates(updatedStudent: Student) {
        setData((prev) =>
            prev.map((student) =>
                student.id === updatedStudent.id ? updatedStudent : student
            )
        )
    }

    function handleDeleteStudent(deletedStudentId: number) {
        // Pass the current state value "prev" and update with new array of all students that are not deleted
        setData((prev) => 
            prev.filter((student) => student.id !== deletedStudentId) // Filters OUT the "deleted" student
        )
    }

    return (
        <DataTable 
            columns={columns({ 
                onUpdate: handleEditUpdates,
                onDelete: handleDeleteStudent,
            })} 
            data={data} 
            dayOfWeek={dayOfWeek}
            onSelectionChange={setSelectedStudents} 
            selectedStudents={selectedStudents} 
            onStudentCreated={handleNewData}
        />
    )
}