// External imports
import { useDroppable } from "@dnd-kit/core";

// Internal imports
import type { Column as ColumnType, Student } from "@/components/dnd/types";
import { StudentCard } from "./student-card";

type ColumnProps = {
    column: ColumnType;
    students: Student[];
}

export function Column({ column, students }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id
    })

    return (
        <div className="flex w-39 flex-col rounded-lg p-4 border">
            <h2 className="mb-4 font-semibold">{column.title} ({students.length})</h2>
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