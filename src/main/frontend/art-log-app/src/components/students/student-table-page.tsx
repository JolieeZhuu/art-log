import * as React from "react"

import { columns, type Student } from "@/components/students/student-columns"
import { DataTable } from "@/components/students/student-data-table"

import { StudentController } from "@/restAPI/entities"

export default function StudentTable({ dayOfWeek, substring, setSelectedStudents } : { dayOfWeek: string; substring: string; setSelectedStudents: (selected: Student[]) => void }) {

    // variable initializations
    const requests = new StudentController()
    const studentUrl = "http://localhost:8080/student/"
    const [data, setData] = React.useState<Student[]>([]) // used to handle async function with useEffect

    async function getData(): Promise<Student[]> {
        // Fetch data from your API here.
        const studentList = await requests.getByDayAndExpectedTimeEnding(studentUrl, dayOfWeek, substring)

        // store values to be used during editMode
        const studentValuesList: Student[] = studentList.map(({ student_id, first_name, last_name, payment_notes, notes } : { student_id: number, first_name: string, last_name: string, payment_notes: string, notes: string}) => {
            return {
                id: student_id,
                name: `${first_name} ${last_name}`,
                paymentNotes: payment_notes,
                notes: notes,
            }
        })
        

        return studentValuesList
    }

    React.useEffect(() => {
        getData().then((data) => setData(data))
    }, [dayOfWeek, substring])

    function handleEditUpdates(updatedStudent: Student) {
        setData((prev) =>
            prev.map((student) =>
                student.id === updatedStudent.id ? updatedStudent : student
            )
        )
    }

    return (
        <DataTable columns={columns({ onUpdate: handleEditUpdates })} data={data} onSelectionChange={setSelectedStudents}/>
    )
}