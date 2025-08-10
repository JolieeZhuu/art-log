import { useDraggable } from "@dnd-kit/core";
import type { Student } from "./types";

type StudentCardProps = {
    student: Student;
};

export function StudentCard({ student }: StudentCardProps) {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: student.id,
    })

    const style = transform ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
    } : undefined

    return (
        <div ref={setNodeRef}
            {...listeners}
            {...attributes} 
            className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
            style={style}
        >
            <p className="font-medium text-neutral-100">{student.name}</p>
        </div>
    );
}