import * as React from "react"

// External imports
import { useParams } from "react-router-dom"
import axios from "axios"

// Internal imports
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { type Checkout } from "@/components/checkout-tables/checkout-columns"
import CheckoutTable from "@/components/checkout-tables/checkout-table-page"
import StudentTable from "@/components/student-tables/student-table-page"

// UI components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { SiteHeader } from "@/components/site-header"

export function DayPage() {

    const { day } = useParams<{ day?: string }>()
    // Validate the day parameter
    if (!day) {
        return <div>Invalid day parameter.</div>
    }

    // Whenever page refreshes, fetch:
    const [selectedMorningStudents, setSelectedMorningStudents] = React.useState<Checkout[]>(() => {
        // Initial render loads from localStorage (so when passes through props, it doesn't have to call localStorage again)
        const saved = localStorage.getItem("selectedMorningStudents")
        return saved ? JSON.parse(saved) : [] // Handles if array is null, but returns an array otherwise (localStorage only accepts parsed strings)
    })

    const [selectedAfternoonStudents, setSelectedAfternoonStudents] = React.useState<Checkout[]>(() => {
        const saved = localStorage.getItem("selectedAfternoonStudents")
        return saved ? JSON.parse(saved) : []
    })

    const [checkoutData, setCheckoutData] = React.useState<Checkout[]>(() => {
        const savedCheckoutData = localStorage.getItem("checkoutData") // Fetch from localStorage if it exists
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
            return timeToMinutes(a.checkOut) - timeToMinutes(b.checkOut) // Sort by checkOut time (by converting the time to minutes)
        })
        return sortedStudents ? sortedStudents : [] // Return an empty array if no students are selected
    })

    // Whenever the selected students change, update/save to localStorage
    React.useEffect(() => {
        localStorage.setItem("selectedMorningStudents", JSON.stringify(selectedMorningStudents))
    }, [selectedMorningStudents])

    React.useEffect(() => {
        localStorage.setItem("selectedAfternoonStudents", JSON.stringify(selectedAfternoonStudents))
    }, [selectedAfternoonStudents])
    
    React.useEffect(() => {
        localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    }, [checkoutData])

    React.useEffect(() => { // Update checkoutData whenever selectedMorningStudents or selectedAfternoonStudents change
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
        function clearSelection() { // Called when the time of day arrives
            // Page will update accordingly since there are useEffect functions for each student list
            setSelectedMorningStudents([])
            setSelectedAfternoonStudents([])
            localStorage.removeItem("selectedMorningStudents")
            localStorage.removeItem("selectedAfternoonStudents")
            console.log("checkmarks cleared at 7:00 PM") // Debug
        }
        async function checkTimeAndClear() {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()

            if (currentHour >= 8 && currentMinute >= 0) {
                const lastClearedDate = localStorage.getItem("lastCleared")
                const today = new Date().toDateString()

                if (lastClearedDate !== today) { // Only clears once per day
                   clearSelection()
                   localStorage.setItem("lastCleared", today) // Store to check when the next day comes
                }

                // below code for testing purposes; must remove above if statement to work
                // clearSelection()
                // localStorage.setItem("lastCleared", today)
                // await playTTS("Checkmarks cleared at 7:00 PM")
            }
        }
        const interval = setInterval(checkTimeAndClear, 60 * 1000) // since parameters are in milliseconds, check every minute

        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {

        async function callCheckouts() {
            const studentNames = checkTimeAndCross()
            console.log("studentNames", studentNames) // debug
            if (studentNames !== "") {
                await playTTS(`${studentNames} can pack up now.`)
            }
            // Name1, Name2, Name3,...NameN can pack up now
        }

        function checkTimeAndCross() {
            console.log("checkoutdata", checkoutData) // debug
            console.log(selectedMorningStudents, selectedAfternoonStudents) // debug
            const filteredStudents = checkoutData.filter(student => !student.crossedOut) // Filter out students that are already crossed out
            console.log("filteredStudents", filteredStudents) // debug

            let studentNames = "" // concatenates names of students who can pack up
            let hasUpdates = false // Manage updates instead of page reload
            
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
                setCheckoutData(updatedCheckoutData) // State setter
            }

            return studentNames

        }
        const interval = setInterval(callCheckouts, 60 * 1000) // Since parameters are in milliseconds, check every minute

        return () => clearInterval(interval)
    }, [])

    async function playTTS(text: string, lang = 'en') {
        try {
            // HTTP GET request to the TTS API
            // Ensure the text is URL-encoded to handle special characters
            const response = await axios.get(
                `http://localhost:8080/speak?text=${encodeURIComponent(text)}&lang=${lang}`,
                { responseType: 'blob' } // Tells axios to expect a binary data response
                // Binary Large Object = blob
            )
            
            const audioUrl = URL.createObjectURL(response.data) // Creates a temporary URL that points to the binary data
            const audio = new Audio(audioUrl) // URLs can be played directly in audio elements
            await audio.play()
            
            audio.onended = () => URL.revokeObjectURL(audioUrl) // Event handler that releases the blob URL from memory after playback ends
        } catch (error) {
            console.error('TTS Error:', error)
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
                        {/* Display student list cards */}
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