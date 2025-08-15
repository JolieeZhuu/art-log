import React from "react"

// Internal imports
import { getByDay } from "@/restAPI/entities"
import { convertTo12Hour } from "../payment-tables/payment-funcs"

// UI Components
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const weekendTimes = [
"9:15-9:30", "9:30-9:45", "9:45-10:00", "10:00-10:15", "10:15-10:30",
"10:30-10:45", "10:45-11:00", "11:00-11:15", "11:15-11:30", "11:30-11:45",
"11:45-12:00", "12:00-12:15", "12:15-12:30", "12:30-12:45", "12:45-1:00",
"1:00-1:15", "1:15-1:30", "1:30-1:45", "1:45-2:00", "2:00-2:15", "2:15-2:30", 
"2:30-2:45", "2:45-3:00", "3:00-3:15", "3:15-3:30", "3:30-3:45", "3:45-4:00",
"4:00-4:15", "4:15-4:30", "4:30-4:45", "4:45-5:00", "5:00-5:15", "5:15-5:30",
"5:30-5:45", "5:45-6:00", "6:00-6:15", "6:15-6:30", "6:30-6:45"]

const weekdayTimes = [
    "3:30-3:45", "3:45-4:00", "4:00-4:15", "4:15-4:30", "4:30-4:45", "4:45-5:00", 
    "5:00-5:15", "5:15-5:30", "5:30-5:45", "5:45-6:00", "6:00-6:15", "6:15-6:30", 
    "6:30-6:45", "6:45-7:00", "7:00-7:15", "7:15-7:30"
]

export function AvailabilityChart({ dayOfWeek }: { dayOfWeek: string }) {

    // Initializations
    const [chartData, setChartData] = React.useState([])
    const [availability, setAvailability] = React.useState<{ slot: string; numOfStudents: number }[]>([])

    React.useEffect(() => {
        createScheduleData()
    }, [dayOfWeek])

    React.useEffect(() => {
        const newAvailability = calculateStudentsPerSlot()
        setAvailability(newAvailability)
    }, [dayOfWeek, chartData])

    async function createScheduleData() {
        // initializations
        const studentUrl = "http://localhost:8080/student/"

        const studentsByDay = await getByDay(studentUrl, dayOfWeek)

        const formattedData: [] = studentsByDay.map(({ student_id, first_name, last_name, time_expected, class_hours }: { student_id: number, first_name: string, last_name: string, time_expected: string, class_hours: number }) => {
            const [formattedTime] = convertTo12Hour(time_expected).split(" ")
            
            const tempMap = new Map()
            tempMap.set("student_id", student_id)
            tempMap.set("student", first_name + " " + last_name)
            let mins = 0
            if (class_hours % 1 == 0) {
                mins = Math.floor(class_hours) * 60 // convert to minutes
            } else {
                mins = Math.floor(class_hours) * 60 + 30 // convert to minutes, assuming 30 minutes for decimals
            }

            if (dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday") {
                const startIndex = weekendTimes.findIndex((slot: string) => slot.startsWith(formattedTime))
                const endIndex = startIndex + Math.ceil(mins / 15)

                // Fill slots before class
                for (let i = 0; i < startIndex; i++) {
                    tempMap.set(weekendTimes[i], false)
                }

                // Fill slots during class
                for (let i = startIndex; i < endIndex; i++) {
                    tempMap.set(weekendTimes[i], true)
                }

                // Fill slots after class
                for (let i = endIndex; i < weekendTimes.length; i++) {
                    tempMap.set(weekendTimes[i], false)
                }
            } else {
                const startIndex = weekdayTimes.findIndex((slot: string) => slot.startsWith(formattedTime))
                const endIndex = startIndex + Math.ceil(mins / 15)

                // Fill slots before class
                for (let i = 0; i < startIndex; i++) {
                    tempMap.set(weekdayTimes[i], false)
                }

                // Fill slots during class
                for (let i = startIndex; i < endIndex; i++) {
                    tempMap.set(weekdayTimes[i], true)
                }

                // Fill slots after class
                for (let i = endIndex; i < weekdayTimes.length; i++) {
                    tempMap.set(weekdayTimes[i], false)
                }
            }

            return tempMap
        })
        setChartData(formattedData)
    }

    // Calculate availability per time slot
    function calculateStudentsPerSlot() {
        if (dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday") {
            return weekendTimes.map((slot: string) => {
                // count the number of students who have the slot set as true
                const numOfStudents = chartData.filter((row: any) => row.get(slot)).length
                return { slot, numOfStudents }
            })
        } else {
            return weekdayTimes.map((slot: string) => {
                // count the number of students who have the slot set as true
                const numOfStudents = chartData.filter((row: any) => row.get(slot)).length
                return { slot, numOfStudents }
            })
        }
    }

    return (
        <div>
            <h2>{dayOfWeek}</h2>
            <div className="flex border pt-2 pb-2 pl-2 pr-2">
                <div className="w-36 shrink-0">
                    <div className="border-b mb-2">
                        <h2 className="mt-4 mb-5">Time slots</h2>
                        <h2 className="mb-4">No. of Students</h2>
                    </div>
                    {
                        chartData.map((row: any, index) => (
                            <div key={index} className="py-2">
                                {row.get("student")}
                            </div>
                        ))
                    }
                </div>

                { /* Second column for time slots and boxes */}
                <div className="flex-1">
                    <ScrollArea className="w-250 ml-6">
                        { /* Time slots */}
                        <div className="flex mb-2 min-w-max border-b">
                            {
                                dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday" ? (
                                    <>
                                        {
                                            weekendTimes.map((slot: string, index: number) => (
                                                <div key={index} className="w-16 text-center font-medium text-gray-600 py-2 flex-shrink-0">
                                                    <div>
                                                        {slot.split('-')[0]}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                    ) : (
                                    <>
                                        {
                                            weekdayTimes.map((slot: string, index: number) => (
                                                <div key={index} className="w-16 text-center font-medium text-gray-600 py-2 flex-shrink-0">
                                                    <div>
                                                        {slot.split('-')[0]}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                    
                                )
                                
                            }
                        </div>
                        { /* Availability counter */}
                        <div className="flex pb-2 mb-2 min-w-max border-b">
                            {
                                availability.map(({ slot, numOfStudents }: { slot: string, numOfStudents: number}) => (
                                    <div key={slot} className="w-16 text-center font-medium text-gray-600 py-2 flex-shrink-0">
                                        {numOfStudents}
                                    </div>
                                ))
                            }
                        </div>
                        { /* Boxes colour coded for availability */ }
                        <div>
                            {
                                chartData.map((row: any, index) => (
                                    <div key={index} className="flex py-2">
                                        {
                                            dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday" ? (
                                                <>
                                                    {
                                                        weekendTimes.map((slot) => {
                                                            const isThere = row.get(slot)
                                                            
                                                            return (
                                                                <div
                                                                    key={slot}
                                                                    className={`w-16 h-6 border flex-shrink-0 ${
                                                                        isThere ? 'bg-purple-300' : 'bg-white'
                                                                    }`}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        weekdayTimes.map((slot) => {
                                                            const isThere = row.get(slot)
                                                            
                                                            return (
                                                                <div
                                                                    key={slot}
                                                                    className={`w-16 h-6 border flex-shrink-0 ${
                                                                        isThere ? 'bg-purple-300' : 'bg-white'
                                                                    }`}
                                                                />
                                                            )
                                                        })                                                    
                                                    }
                                                </>
                                            )
                                            
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </div>
            </div>

        </div>
    )
};

export function AvailabilitySlots({ dayOfWeek, header }: { dayOfWeek: string, header: string }) {

    // Initializations
    const [chartData, setChartData] = React.useState([])
    const [availability, setAvailability] = React.useState<{ slot: string; numOfStudents: number }[]>([])

    React.useEffect(() => {
        createScheduleData()
    }, [dayOfWeek])

    React.useEffect(() => {
        const newAvailability = calculateStudentsPerSlot()
        setAvailability(newAvailability)
    }, [dayOfWeek, chartData])

    async function createScheduleData() {
        // initializations
        const studentUrl = "http://localhost:8080/student/"

        const studentsByDay = await getByDay(studentUrl, dayOfWeek)

        const formattedData: [] = studentsByDay.map(({ student_id, first_name, last_name, time_expected, class_hours }: { student_id: number, first_name: string, last_name: string, time_expected: string, class_hours: number }) => {
            const [formattedTime] = convertTo12Hour(time_expected).split(" ")
            
            const tempMap = new Map()
            tempMap.set("student_id", student_id)
            tempMap.set("student", first_name + " " + last_name)
            let mins = 0
            if (class_hours % 1 == 0) {
                mins = Math.floor(class_hours) * 60 // convert to minutes
            } else {
                mins = Math.floor(class_hours) * 60 + 30 // convert to minutes, assuming 30 minutes for decimals
            }

            if (dayOfWeek === "Sunday" || dayOfWeek === "Saturday") {
                const startIndex = weekendTimes.findIndex((slot: string) => slot.startsWith(formattedTime))
                const endIndex = startIndex + Math.ceil(mins / 15)

                // Fill slots before class
                for (let i = 0; i < startIndex; i++) {
                    tempMap.set(weekendTimes[i], false)
                }

                // Fill slots during class
                for (let i = startIndex; i < endIndex; i++) {
                    tempMap.set(weekendTimes[i], true)
                }

                // Fill slots after class
                for (let i = endIndex; i < weekendTimes.length; i++) {
                    tempMap.set(weekendTimes[i], false)
                }
            } else {
                const startIndex = weekdayTimes.findIndex((slot: string) => slot.startsWith(formattedTime))
                const endIndex = startIndex + Math.ceil(mins / 15)

                // Fill slots before class
                for (let i = 0; i < startIndex; i++) {
                    tempMap.set(weekdayTimes[i], false)
                }

                // Fill slots during class
                for (let i = startIndex; i < endIndex; i++) {
                    tempMap.set(weekdayTimes[i], true)
                }

                // Fill slots after class
                for (let i = endIndex; i < weekdayTimes.length; i++) {
                    tempMap.set(weekdayTimes[i], false)
                }
            }

            return tempMap
        })
        setChartData(formattedData)
    }

    // Calculate availability per time slot
    function calculateStudentsPerSlot() {
        if (dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday") {
            return weekendTimes.map((slot: string) => {
                // count the number of students who have the slot set as true
                const numOfStudents = chartData.filter((row: any) => row.get(slot)).length
                return { slot, numOfStudents }
            })
        } else {
            return weekdayTimes.map((slot: string) => {
                // count the number of students who have the slot set as true
                const numOfStudents = chartData.filter((row: any) => row.get(slot)).length
                return { slot, numOfStudents }
            })
        }
    }

    return (
        <div>
            <h2>{header}</h2>
            <div className="flex border pl-2 pr-2">
                { /* Second column for time slots and boxes */}
                <div className="flex-1">
                    <ScrollArea className="w-290">
                        { /* Time slots */}
                        <div className="flex mb-2 min-w-max border-b justify-center">
                            {
                                dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday" ? (
                                    <>
                                        {
                                            weekendTimes.map((slot: string, index: number) => (
                                                <div key={index} className="w-16 text-center font-medium text-gray-600 py-2 flex-shrink-0">
                                                    <div>
                                                        {slot.split('-')[0]}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                    ) : (
                                    <>
                                        {
                                            weekdayTimes.map((slot: string, index: number) => (
                                                <div key={index} className="w-16 text-center font-medium text-gray-600 py-2 flex-shrink-0">
                                                    <div>
                                                        {slot.split('-')[0]}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                    
                                )
                                
                            }
                        </div>
                        { /* Availability counter */}
                        <div className="flex pb-2 mb-2 min-w-max justify-center">
                            {
                                availability.map(({ slot, numOfStudents }: { slot: string, numOfStudents: number}) => (
                                    <div key={slot} className="w-16 text-center font-medium text-gray-600 py-2 flex-shrink-0">
                                        {numOfStudents}
                                    </div>
                                ))
                            }
                        </div>
                        <ScrollBar orientation="horizontal"/>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )

}