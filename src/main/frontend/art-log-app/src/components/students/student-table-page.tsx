import * as React from "react"

import { columns, type Student } from "@/components/students/student-columns"
import { DataTable } from "@/components/students/student-data-table"

import { getByDayAndExpectedTimeEnding } from "@/restAPI/entities"
import { type Checkout } from "@/components/checkout/checkout-columns"

export default function StudentTable({ dayOfWeek, substring, setSelectedStudents, selectedStudents } : { dayOfWeek: string; substring: string; setSelectedStudents: (selected: Checkout[]) => void; selectedStudents: Checkout[] }) {

    // variable initializations
    const studentUrl = "http://localhost:8080/student/"
    const [data, setData] = React.useState<Student[]>([]) // used to handle async function with useEffect

    async function getData(): Promise<Student[]> {
        // Fetch data from your API here.
        const studentList = await getByDayAndExpectedTimeEnding(studentUrl, dayOfWeek, substring)

        // store values to be used during editMode
        const studentValuesList: Student[] = studentList.map(({ student_id, first_name, last_name, payment_notes, notes } : { student_id: number, first_name: string, last_name: string, payment_notes: string, notes: string}) => {
            return {
                id: student_id,
                name: `${first_name} ${last_name}`,
                paymentNotes: payment_notes,
                notes: notes,
            }
        })
        console.log(studentValuesList)
        

        return studentValuesList
    }

    React.useEffect(() => {
        getData().then((data) => setData(data))
    }, [dayOfWeek, substring])

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
        // pass the current state value "prev" and update with new array of all students that are not deleted
        setData((prev) => 
            prev.filter((student) => student.id !== deletedStudentId) // filters OUT the "deleted" student
        )
    }

    return (
        <DataTable 
            columns={columns({ 
                onUpdate: handleEditUpdates,
                onDelete: handleDeleteStudent,
            })} 
            data={data} 
            onSelectionChange={setSelectedStudents} 
            selectedStudents={selectedStudents} 
            onStudentCreated={handleNewData}
        />
    )
}