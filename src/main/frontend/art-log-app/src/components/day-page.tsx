import { useParams } from "react-router-dom"
import { useState } from "react"

import Layout from "@/components/layout"
import { ModeToggle } from "@/components/mode-toggle"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"


import { SiteHeader } from "@/components/site-header"
import StudentTable from "@/components/students/student-table-page"

export function DayPage() {
    const { day } = useParams<{ day?: string }>()
    if (!day) {
        return <div>Invalid day parameter.</div>
    }

    return (
        <Layout
            children={(
                <div>
                    <SiteHeader heading={day[0].toUpperCase() + day.substring(1)} />
                    <div className="flex flex-wrap gap-7 pt-4">
                        <div className="absolute top-4 right-4">
                            <ModeToggle/>
                        </div>
                        {/* display student list cards */}
                        <div className="w-full max-w-xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Morning</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <StudentTable dayOfWeek={day} substring="AM" />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full max-w-xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Afternoon</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <StudentTable dayOfWeek={day} substring="PM" />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full max-w-7xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>{day[0].toUpperCase() + day.substring(1)} Checkout List</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>hello</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <Toaster/>
                </div>
            )}
        />
    )
}