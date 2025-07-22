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
import { type Checkout } from "@/components/checkout/checkout-columns"
import CheckoutTable from "@/components/checkout/checkout-table-page"

import { SiteHeader } from "@/components/site-header"
import StudentTable from "@/components/students/student-table-page"

export function DayPage() {
    const { day } = useParams<{ day?: string }>()
    if (!day) {
        return <div>Invalid day parameter.</div>
    }
    const [selectedMorningStudents, setSelectedMorningStudents] = React.useState<Checkout[]>(() => {
        // initial render loads from localStorage (so when passes through props, it doesn't have to call localStorage again)
        const saved = localStorage.getItem("selectedMorningStudents")
        return saved ? JSON.parse(saved) : [] // handles if array is null, but returns an array otherwise (localStorage only accepts parsed strings)
    })
    const [selectedAfternoonStudents, setSelectedAfternoonStudents] = React.useState<Checkout[]>(() => {
        const saved = localStorage.getItem("selectedAfternoonStudents")
        return saved ? JSON.parse(saved) : []
    })
    const [checkoutData, setCheckoutData] = React.useState<Checkout[]>([])

    // save to localStorage whenever selections change
    React.useEffect(() => {
        localStorage.setItem("selectedMorningStudents", JSON.stringify(selectedMorningStudents))
    }, [selectedMorningStudents])

    React.useEffect(() => {
        localStorage.setItem("selectedAfternoonStudents", JSON.stringify(selectedAfternoonStudents))
    }, [selectedAfternoonStudents])

    React.useEffect(() => {
        const allSelectedStudents = selectedMorningStudents.concat(selectedAfternoonStudents)
        setCheckoutData(allSelectedStudents)
    }, [selectedMorningStudents, selectedAfternoonStudents])

    React.useEffect(() => {
        function clearSelection() { // called when the time of day arrives
            // page will update accordingly since there are useEffect functions for each student list
            setSelectedMorningStudents([])
            setSelectedAfternoonStudents([])
            localStorage.removeItem("selectedMorningStudents")
            localStorage.removeItem("selectedAfternoonStudents")
            console.log("checkmarks cleared at 7:00 PM") // debug
        }
        function checkTimeAndClear() {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()

            if (currentHour >= 8 && currentMinute >= 0) {
                const lastClearedDate = localStorage.getItem("lastCleared")
                const today = new Date().toDateString()

                //if (lastClearedDate !== today) {
                //    clearSelection()
                //    localStorage.setItem("lastCleared", today) // store to check when the next day comes
                //}
                clearSelection()
                localStorage.setItem("lastCleared", today)
            }
        }
        // check every minute
        const interval = setInterval(checkTimeAndClear, 60 * 1000) // since parameters are in milliseconds, check every minute
        console.log("hello")

        return () => clearInterval(interval)
    }, [])

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
                                    <StudentTable dayOfWeek={day} substring="AM" setSelectedStudents={setSelectedMorningStudents} selectedStudents={selectedMorningStudents}/>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="w-full max-w-xl">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Afternoon</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <StudentTable dayOfWeek={day} substring="PM" setSelectedStudents={setSelectedAfternoonStudents} selectedStudents={selectedAfternoonStudents}/>
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