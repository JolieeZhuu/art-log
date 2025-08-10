import React from "react"

import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "./site-header"

import type { Student } from "@/components/dnd/types"
import { STUDENTS, COLUMNS } from "@/components/dnd/data"
import { Column } from "@/components/dnd/column"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"

export function Students() {

    const [students, setStudents] = React.useState<Student[]>(STUDENTS)

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) return // If cursor not over something that is droppable, do nothing

        const studentId = active.id as string
        const newDay = over.id as Student["day"]

        setStudents(() => students.map(student => student.id === studentId ? {
            ...student,
            day: newDay
        } : student))
    }

    return (
        <Layout
            children={(
                <div className="w-[73rem] p-[2rem]">
                    <SiteHeader heading="Students"/>
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <div className="p-4">
                        <div className="flex gap-4">
                            <DndContext onDragEnd={handleDragEnd}>
                                {COLUMNS.map((column) => {
                                    return (
                                        <Column 
                                            key={column.id} 
                                            column={column} 
                                            students={students.filter(student => student.day === column.id)} 
                                        /> 
                                    ) /* change the filtering stuff because not best for performance */
                                })}
                            </DndContext>
                        </div>
                    </div>
                </div>
            )}
        />
    )
}