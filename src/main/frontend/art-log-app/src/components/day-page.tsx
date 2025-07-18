import { useParams } from "react-router-dom"

import Layout from "@/components/layout"
import { ModeToggle } from "@/components/mode-toggle"
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"


import { SiteHeader } from "@/components/site-header"
import { DialogStudentForm } from "@/components/dialog-student-form"
import StudentTable from "@/components/students/page"

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
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="w-full max-w-xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Morning</CardTitle>
                                    <CardAction>
                                        <DialogStudentForm/>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <StudentTable dayOfWeek={day} substring="AM"/>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full max-w-xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Afternoon</CardTitle>
                                    <CardAction>
                                        <DialogStudentForm/>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <StudentTable dayOfWeek={day} substring="PM"/>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="absolute top-4 right-4">
                            <ModeToggle/>
                        </div>
                    </div>
                    <Toaster/>
                </div>
            )}
        />
    )
}