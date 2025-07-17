import { useParams } from "react-router-dom"

import Layout from "@/components/layout"
import { ModeToggle } from "@/components/mode-toggle"
import { SiteHeader } from "./site-header"

export function PaymentsPage() {
    const { id } = useParams()

    return (
        <Layout
            children={(
                <div className="max-w-screen">
                    <SiteHeader heading={`Payments for Student ${id}`}/>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                </div>
            )}
        />
    )
}