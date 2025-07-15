import { useParams } from "react-router-dom"

import Layout from "@/components/layout"

export function DayPage() {
    const { day } = useParams()
    return (
        <Layout
            children={(
                <div className="flex">
                    <p>{day}</p>
                </div>
            )}
        />
    )
}