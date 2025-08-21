import React from "react"

// External imports
import { DndContext, type DragEndEvent } from "@dnd-kit/core"

// Internal imports
import { getById, edit, getAll } from "@/restAPI/entities"
import type { Student } from "@/components/dnd/types"
import { COLUMNS } from "@/components/dnd/data"
import { Column } from "@/components/dnd/column"

// UI Components
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "../navbar/site-header"
import { useStudents } from "../student-context"

export function Students() {


    const { students, setStudents, refresh } = useStudents();
    const studentUrl = "http://localhost:8080/student/"


    React.useEffect(() => {
        async function getStudents() {
            const studentsData = await getAll(studentUrl)
            const formattedStudents: Student[] = studentsData.map((student: any) => ({
                id: student.student_id.toString(),
                day: student.day.toUpperCase(),
                name: `${student.first_name} ${student.last_name}`,
            }))
            setStudents(formattedStudents)
        }

        getStudents()
    }, []) // Runs only once when the component mounts

    // Memoize the grouped students by day to avoid recalculating on every render
    const studentsByDay = React.useMemo(() => {
        const grouped: Record<string, Student[]> = {}
        
        // Initialize empty arrays for each day
        COLUMNS.forEach(column => {
            grouped[column.id] = []
        })
        
        // Group students by their day
        students.forEach(student => {
            if (grouped[student.day]) {
                grouped[student.day].push(student)
            }
        })
        
        return grouped
    }, [students]) // Only recalculate when students array changes

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) return // If cursor not over something that is droppable, do nothing

        const studentId = active.id as string
        const newDay = over.id as Student["day"]

        setStudents(() => students.map(student => student.id === studentId ? {
            ...student,
            day: newDay
        } : student))

        editStudentWithDay(studentId, newDay).then(refresh);
    }

    async function editStudentWithDay(studentId: string, newDay: Student["day"]) {
        const student = await getById(studentUrl, parseInt(studentId))

        const data = {
            student_id: parseInt(studentId),
            first_name: student.first_name,
            last_name: student.last_name,
            class_id: student.class_id,
            day: newDay[0] + newDay.slice(1).toLowerCase(), // Convert to lowercase except for first letter
            phone_number: student.phone_number,
            time_expected: student.time_expected,
            notes: student.notes,
            payment_notes: student.payment_notes,
            payment_number: student.payment_number,
            class_number: student.class_number,
            total_classes: student.total_classes,
            class_hours: student.class_hours,
        }

        await edit(studentUrl, data)
    }

    return (
        <Layout
            children={(
                <div className="w-full p-[2rem]">
                    <SiteHeader heading="Students"/>
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <div className="pt-4">
                        <div className="flex gap-4">
                            <DndContext onDragEnd={handleDragEnd}>
                                {COLUMNS.map((column) => {
                                    return (
                                        <Column 
                                            key={column.id} 
                                            column={column} 
                                            students={studentsByDay[column.id]} // Use pre-calculated groups 
                                        /> 
                                    )
                                })}
                            </DndContext>
                        </div>
                    </div>
                </div>
            )}
        />
    )
}