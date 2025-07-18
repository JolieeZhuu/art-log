import * as React from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { columns, type Student } from "@/components/students/columns"
import { DataTable } from "@/components/students/data-table"

import { StudentController } from "@/restAPI/entities"

export default function StudentTable({ dayOfWeek, substring} : { dayOfWeek: string; substring: string}) {

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
    })

    return (
        <ScrollArea className=" h-[300px] w-full container mx-auto">
            <DataTable columns={columns} data={data} />
        </ScrollArea>
    )
}