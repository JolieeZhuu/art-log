import * as React from "react"

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
import { type Student } from "@/components/students/student-columns"
import { type Checkout } from "@/components/checkout/checkout-columns"
import CheckoutTable from "@/components/checkout/checkout-table-page"

import { SiteHeader } from "@/components/site-header"
import StudentTable from "@/components/students/student-table-page"

export function DayPage() {
    const { day } = useParams<{ day?: string }>()
    if (!day) {
        return <div>Invalid day parameter.</div>
    }
    const [selectedMorningStudents, setSelectedMorningStudents] = React.useState<Student[]>([])
    const [selectedAfternoonStudents, setSelectedAfternoonStudents] = React.useState<Student[]>([])
    const [checkoutData, setCheckoutData] = React.useState<Checkout[]>([])

    React.useEffect(() => {
        const allSelectedStudents = selectedMorningStudents.concat(selectedAfternoonStudents)
        const formatAsCheckout: Checkout[] = allSelectedStudents.map(({ id, name }) => {
            return {
                id: id,
                name: name,
                checkIn: "",
                classId: "",
                checkOut: "",
                day: ""
            }
        })
        console.log("formatascheckout", formatAsCheckout) // debug
        setCheckoutData(formatAsCheckout)
    }, [selectedMorningStudents, selectedAfternoonStudents])

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
                                    <StudentTable dayOfWeek={day} substring="AM" setSelectedStudents={setSelectedMorningStudents}/>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full max-w-xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Afternoon</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <StudentTable dayOfWeek={day} substring="PM" setSelectedStudents={setSelectedAfternoonStudents} />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full max-w-7xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>{day[0].toUpperCase() + day.substring(1)} Checkout List</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CheckoutTable checkoutData={checkoutData}/>
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