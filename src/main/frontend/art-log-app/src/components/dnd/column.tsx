import type { Column as ColumnType, Student } from "@/components/dnd/types";
import { StudentCard } from "./student-card";
import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
    column: ColumnType;
    students: Student[];
}

export function Column({ column, students }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id
    })

    return (
        <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
            <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
            <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
                {students.map(student => {
                    return (
                        <StudentCard 
                            key={student.id} 
                            student={student}
                        />
                    )
                })}
            </div>
        </div>
    );
}