import React from "react";

// External imports
import { useDraggable } from "@dnd-kit/core"
import { useNavigate } from "react-router-dom";

// Internal imports
import type { Student } from "./types"
import { getById } from "@/restAPI/entities";
import { convertTo12Hour } from "../payment-tables/payment-funcs";

// UI Components
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";

type StudentCardProps = {
    student: Student;
}

// Simple drag handle icon component (you can replace with any icon library)
function DragHandleIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            style={{
                fill: 'currentColor',
                flexShrink: 0,
            }}
        >
            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"></path>
        </svg>
    )
}

export function StudentCard({ student }: StudentCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: student.id,
    })

    const style = transform ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
    } : undefined

    const navigate = useNavigate()
    const studentUrl = "http://localhost:8080/student/"
    const [thisStudent, setThisStudent] = React.useState<Student | null>(null)

    React.useEffect(() => {
        async function getStudent() {
            const tempStudent = await getById(studentUrl, parseInt(student.id))
            setThisStudent(tempStudent)
        }
        getStudent()
    }, [])

    return (
        <div 
            ref={setNodeRef}
            className={`
                rounded-lg border shadow-sm hover:shadow-md
                flex items-center
                ${isDragging ? 'opacity-50' : 'opacity-100'}
            `}
            style={style}
        >
            {/* Student content - not draggable, can contain interactive elements */}
            <div className="flex-1 text-sm">
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button className="m-0" variant="link" onClick={() => navigate(`/students/${student.id}`)}>{student.name}</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-50">
                        <div className="flex justify-between gap-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{student.name}</h4>
                                <p className="text-sm">
                                    {thisStudent?.phone_number ? `(${thisStudent.phone_number.slice(0, 3)})-${thisStudent.phone_number.slice(3, 6)}-${thisStudent.phone_number.slice(6)}` : ""}
                                </p>
                                <div className="text-muted-foreground text-xs">
                                    {thisStudent?.class_id}, {convertTo12Hour(thisStudent?.time_expected)}
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* Drag Handle - only this part is draggable */}
            <button
                className={`
                    touch-none select-none 
                    text-neutral-400 hover:text-neutral-200 
                    cursor-grab active:cursor-grabbing
                    rounded transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                `}
                {...listeners}
                {...attributes}
                aria-label={`Drag ${student.name}`}
            >
                <DragHandleIcon />
            </button>
        </div>
    )
}