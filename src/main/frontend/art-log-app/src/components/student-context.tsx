// StudentsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react"
import { getAll } from "@/restAPI/entities"
import type { Student } from "@/components/dnd/types"

type ContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  refresh: () => Promise<void>;
};

const StudentsContext = createContext<ContextType | null>(null);

export function StudentsProvider({ children }: { children: React.ReactNode }) {
    const [students, setStudents] = useState<Student[]>([]);
    const studentUrl = "http://localhost:8080/student/";

    async function refresh() {
        const data = await getAll(studentUrl);
        setStudents(data.map((s: any) => ({
        id: s.student_id.toString(),
        day: s.day.toUpperCase(),
        name: `${s.first_name} ${s.last_name}`,
        })));
    }

    useEffect(() => {
        refresh();
    }, []);

    return (
        <StudentsContext.Provider value={{ students, setStudents, refresh }}>
        {children}
        </StudentsContext.Provider>
    );
}

export function useStudents() {
    const ctx = useContext(StudentsContext);
    if (!ctx) throw new Error("useStudents must be used within StudentsProvider");
    return ctx;
}