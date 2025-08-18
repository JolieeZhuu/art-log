import * as React from "react"

// Internal imports
import { columns, type Student } from "@/components/student-tables/student-columns"
import { DataTable } from "@/components/student-tables/student-data-table"
import { getByDayAndExpectedTime } from "@/restAPI/entities"
import { type Checkout } from "@/components/checkout-tables/checkout-columns"

export default function StudentTable({ dayOfWeek, setSelectedStudents, selectedStudents } : { dayOfWeek: string; setSelectedStudents: (selected: Checkout[]) => void; selectedStudents: Checkout[] }) {

    // variable initializations
    const studentUrl = "http://localhost:8080/student/"
    const [data, setData] = React.useState<Student[]>([]) // Used to handle async function with useEffect

    async function getData(): Promise<Student[]> {
        // Fetch data from API
        const studentList = await getByDayAndExpectedTime(studentUrl, dayOfWeek)

        // Store values to be used during editMode
        const studentValuesList: Student[] = studentList.map(({ student_id, first_name, last_name, payment_notes, notes, phone_number } : { student_id: number, first_name: string, last_name: string, payment_notes: string, notes: string, phone_number: string}) => {
            return {
                id: student_id,
                name: `${first_name} ${last_name}`,
                paymentNotes: payment_notes,
                notes: notes,
                phoneNumber: phone_number,
            }
        })
        console.log(studentValuesList)
        

        return studentValuesList
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