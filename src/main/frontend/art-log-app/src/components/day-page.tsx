import * as React from "react"

import { useParams } from "react-router-dom"

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

import axios from "axios"

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
    const [checkoutData, setCheckoutData] = React.useState<Checkout[]>(() => {
        const savedCheckoutData = localStorage.getItem("checkoutData")
        if (savedCheckoutData) {
            return JSON.parse(savedCheckoutData)
        }
        
        // If no saved data, create from selected students
        const allSelectedStudents = selectedMorningStudents.concat(selectedAfternoonStudents)
        const sortedStudents = allSelectedStudents.sort((a, b) => {
            function timeToMinutes(timeStr: string) {
                const [time, ampm] = timeStr.split(" ")
                let [hours, minutes] = time.split(":").map(Number)
                if (ampm === "AM" && hours === 12) {
                    hours = 0
                } else if (ampm === "PM" && hours !== 12) {
                    hours += 12
                }
                return hours * 60 + minutes
            }
            return timeToMinutes(a.checkOut) - timeToMinutes(b.checkOut)
        })
        return sortedStudents ? sortedStudents : []
    })

    // save to localStorage whenever selections change
    React.useEffect(() => {
        localStorage.setItem("selectedMorningStudents", JSON.stringify(selectedMorningStudents))
    }, [selectedMorningStudents])

    React.useEffect(() => {
        localStorage.setItem("selectedAfternoonStudents", JSON.stringify(selectedAfternoonStudents))
    }, [selectedAfternoonStudents])
    
    React.useEffect(() => {
        localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    }, [checkoutData])

    React.useEffect(() => {
        const allSelectedStudents = selectedMorningStudents.concat(selectedAfternoonStudents)
        const sortedStudents = allSelectedStudents.sort((a, b) => {
            function timeToMinutes(timeStr: string) {
                const [time, ampm] = timeStr.split(" ")
                let [hours, minutes] = time.split(":").map(Number)
                if (ampm === "AM" && hours === 12) {
                    hours = 0
                } else if (ampm === "PM" && hours !== 12) {
                    hours += 12
                }
                return hours * 60 + minutes
            }
            return timeToMinutes(a.checkOut) - timeToMinutes(b.checkOut)
        })
        
        // Preserve crossedOut status when updating
        const updatedStudents = sortedStudents.map(student => {
            const existingStudent = checkoutData.find(existing => existing.id === student.id)
            return existingStudent ? { ...student, crossedOut: existingStudent.crossedOut } : student
        })
        
        setCheckoutData(updatedStudents)
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
        async function checkTimeAndClear() {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()

            if (currentHour >= 8 && currentMinute >= 0) {
                const lastClearedDate = localStorage.getItem("lastCleared")
                const today = new Date().toDateString()

                if (lastClearedDate !== today) { // only clears once per day
                   clearSelection()
                   localStorage.setItem("lastCleared", today) // store to check when the next day comes
                }
                // clearSelection()
                // localStorage.setItem("lastCleared", today)
                // await playTTS("Checkmarks cleared at 7:00 PM")
            }
        }
        // check every minute
        const interval = setInterval(checkTimeAndClear, 60 * 1000) // since parameters are in milliseconds, check every minute

        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {

        async function callCheckouts() {
            const studentNames = checkTimeAndCross()
            console.log("studentNames", studentNames)
            if (studentNames !== "") {
                await playTTS(`${studentNames} can pack up now.`)
            }
            // Name1, Name2, Name3,...NameN can pack up now
        }

        function checkTimeAndCross() {
            console.log("checkoutdata", checkoutData)
            console.log(selectedMorningStudents, selectedAfternoonStudents)
            const filteredStudents = checkoutData.filter(student => !student.crossedOut);
            console.log("filteredStudents", filteredStudents)

            let studentNames = ""
            let hasUpdates = false
            
            // Create a new array with updated students
            const updatedCheckoutData = checkoutData.map(student => {
                if (student.crossedOut) return student // Already crossed out
                
                const now = new Date();
                const currentHour = now.getHours()
                const currentMinute = now.getMinutes()

                const [time, ampm] = student.checkOut.split(" ")
                let [hours, minutes] = time.split(":").map(Number)
                if (ampm === "AM" && hours === 12) {
                    hours = 0
                } else if (ampm === "PM" && hours !== 12) {
                    hours += 12
                }

                if (currentHour > hours || (currentHour === hours && currentMinute >= minutes)) {
                    studentNames += student.name + ", "
                    hasUpdates = true
                    return { ...student, crossedOut: true } // Return new object
                }
                
                return student // No change
            })

            // Only update state if there were changes
            if (hasUpdates) {
                setCheckoutData(updatedCheckoutData) // You need this state setter
            }

            return studentNames

        }
        // check every minute
        const interval = setInterval(callCheckouts, 60 * 1000) // since parameters are in milliseconds, check every minute

        return () => clearInterval(interval)
    }, [])

    async function playTTS(text: string, lang = 'en') {
        try {
            const response = await axios.get(
                `http://localhost:8080/speak?text=${encodeURIComponent(text)}&lang=${lang}`,
                { responseType: 'blob' } // This is crucial for binary data
            );
            
            const audioUrl = URL.createObjectURL(response.data);
            const audio = new Audio(audioUrl);
            await audio.play();
            
            audio.onended = () => URL.revokeObjectURL(audioUrl);
        } catch (error) {
            console.error('TTS Error:', error);
        } 
    }

    return (
        <Layout
            children={(
                <div className="p-[2rem]">
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
                                    <CardTitle>Checkout List</CardTitle>
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