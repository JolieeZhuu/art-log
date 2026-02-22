import React from "react"

// Internal imports
import { getByDay } from "../../restAPI/entities"
import { convertTo12Hour } from "../payment-tables/payment-funcs"

// UI Components
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area"
import { Card } from "../../components/ui/card"

const weekendTimes = [
    "9:15 AM-9:30 AM", "9:30 AM-9:45 AM", "9:45 AM-10:00 AM", "10:00 AM-10:15 AM", "10:15 AM-10:30 AM",
    "10:30 AM-10:45 AM", "10:45 AM-11:00 AM", "11:00 AM-11:15 AM", "11:15 AM-11:30 AM", "11:30 AM-11:45 AM",
    "11:45 AM-12:00 PM", "12:00 PM-12:15 PM", "12:15 PM-12:30 PM", "12:30 PM-12:45 PM", "12:45 PM-1:00 PM",
    "1:00 PM-1:15 PM", "1:15 PM-1:30 PM", "1:30 PM-1:45 PM", "1:45 PM-2:00 PM", "2:00 PM-2:15 PM", "2:15 PM-2:30 PM", 
    "2:30 PM-2:45 PM", "2:45 PM-3:00 PM", "3:00 PM-3:15 PM", "3:15 PM-3:30 PM", "3:30 PM-3:45 PM", "3:45 PM-4:00 PM", 
    "4:00 PM-4:15 PM", "4:15 PM-4:30 PM", "4:30 PM-4:45 PM", "4:45 PM-5:00 PM", 
    "5:00 PM-5:15 PM", "5:15 PM-5:30 PM", "5:30 PM-5:45 PM", "5:45 PM-6:00 PM", 
    "6:00 PM-6:15 PM", "6:15 PM-6:30 PM", "6:30 PM-6:45 PM"]

const weekdayTimes = [
    "3:30 PM-3:45 PM", "3:45 PM-4:00 PM", "4:00 PM-4:15 PM", "4:15 PM-4:30 PM", "4:30 PM-4:45 PM", "4:45 PM-5:00 PM", 
    "5:00 PM-5:15 PM", "5:15 PM-5:30 PM", "5:30 PM-5:45 PM", "5:45 PM-6:00 PM", "6:00 PM-6:15 PM", "6:15 PM-6:30 PM", 
    "6:30 PM-6:45 PM", "6:45 PM-7:00 PM", "7:00 PM-7:15 PM", "7:15 PM-7:30 PM"
]

export function AvailabilityChart({ type }: { type: string }) {

    // Initializations
    const [chartData, setChartData] = React.useState<any[][]>([])
    const [availability, setAvailability] = React.useState<{ slot: string; numOfStudents: number }[][]>([])

    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const weekends = ["Saturday", "Sunday"]

    React.useEffect(() => {
        createScheduleData()
    }, [type])

    React.useEffect(() => {
        const newAvailability = calculateStudentsPerSlot()
        setAvailability(newAvailability)
    }, [type, chartData])

    async function createScheduleData() {
        // initializations
        const studentUrl = "http://localhost:8080/student/"
        let myArr = []
        if (type.toLowerCase() === "weekday")
            myArr = weekdays
        else
            myArr = weekends

        const storeResults = await Promise.all(
            myArr.map(async (dayOfWeek) => {
                const studentsByDay = await getByDay(studentUrl, dayOfWeek)

                if (studentsByDay.length !== 0) {
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
                            if (startIndex !== -1) {
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
                            }
                        } else {
                            const startIndex = weekdayTimes.findIndex((slot: string) => slot.startsWith(formattedTime)) // what if it returns -1?
                            if (startIndex !== -1) {
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
                        }

                        return tempMap
                    })
                    return formattedData   
                } return []
            })
        )
        setChartData(storeResults)
    }

    // Calculate availability per time slot
    function calculateStudentsPerSlot() {
        if (type.toLowerCase() === "weekend") {
            return chartData.map((dayOfWeek: any) => {
                return weekendTimes.map((slot: string) => {
                    const numOfStudents = dayOfWeek.filter((row: any) => row.get(slot)).length
                    return { slot, numOfStudents }
                })
            })
            
        } else {
            return chartData.map((dayOfWeek: any) => {
                return weekdayTimes.map((slot: string) => {
                    const numOfStudents = dayOfWeek.filter((row: any) => row.get(slot)).length
                    return { slot, numOfStudents }
                })
            })
        }
    }

    return (
        <div>
            <h2 className="font-semibold mb-2">{type}</h2>
            <Card className="py-4 pl-6 pr-6">
                <div className="flex">
                    <div className="w-30 shrink-0">
                        <div className="pt-4 space-y-6 font-medium">
                            <h2>Time slots</h2>
                            {
                                type.toLowerCase() === "weekend" ? (
                                    <>
                                        {
                                            weekends.map((dayOfWeek, index) => (
                                                <h2 key={index} className="mb-3">{dayOfWeek}</h2>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            weekdays.map((dayOfWeek, index) => (
                                                <h2 key={index} className="mb-3">{dayOfWeek}</h2>
                                            ))
                                        }
                                    </>
                                )
                            }
                        </div>
                    </div>

                    { /* Second column for time slots and boxes */}
                    <div className="flex-1 min-w-0">
                        <div className="flex">
                            <ScrollArea className="w-1 flex-1">
                                { /* Time slots */}
                                <div className="flex pt-1 mb-2">
                                    {
                                        type.toLowerCase() === "weekend" ? (
                                            <>
                                                {
                                                    weekendTimes.map((slot: string, index: number) => (
                                                        <div key={index} className="w-16 font-medium text-center font-medium text-sm text-gray-600 py-3 border-t border-b flex-shrink-0 bg-secondary">
                                                            <div>
                                                                {slot.split('-')[0].split(' ')[0]}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                            ) : (
                                            <>
                                                {
                                                    weekdayTimes.map((slot: string, index: number) => (
                                                        <div key={index} className="w-16 font-medium text-center text-sm text-gray-600 py-3 border-t border-b flex-shrink-0 bg-secondary">
                                                            <div>
                                                                {slot.split('-')[0].split(' ')[0]}
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                            
                                        )
                                        
                                    }
                                </div>
                                { /* Availability counter */}
                                <div>
                                    {
                                        availability.map((row, index) => (
                                            <div key={index} className="flex min-w-0">
                                                {
                                                    row.map(({ slot, numOfStudents }: { slot: string, numOfStudents: number}) => (
                                                        <div key={slot} className="w-16 text-center text-sm font-medium text-gray-600 py-2 flex-shrink-0">
                                                            {numOfStudents}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                                
                                <ScrollBar orientation="horizontal" className="w-full"/>
                            </ScrollArea>

                        </div>
                    </div>
                </div>

            </Card>
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

        if (studentsByDay.length !== 0) {
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
                    if (startIndex !== -1) {
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
                    }
                } else {
                    const startIndex = weekdayTimes.findIndex((slot: string) => slot.startsWith(formattedTime)) // what if it returns -1?
                    if (startIndex !== -1) {
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
                }

                return tempMap
            })
            setChartData(formattedData)
        }        
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
            <Card className="py-4 pl-6 pr-3">
                <div className="flex">

                    <div>
                        <ScrollArea className="h-[414px]">
                            <div className="flex gap-2 -mr-5">
                                {
                                    dayOfWeek.toLowerCase() === "sunday" || dayOfWeek.toLowerCase() === "saturday" ? (
                                        <div className="flex flex-col gap-3">
                                            {
                                                weekendTimes.map((slot: string) => (
                                                    <div key={slot} className="w-16 font-medium text-sm">
                                                        {slot.split('-')[0]}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {
                                                weekdayTimes.map((slot: string) => (
                                                    <div key={slot} className="w-16 font-medium text-sm">
                                                        {slot.split('-')[0]}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                                <div className="flex flex-col gap-3">
                                    {
                                        availability.map(({ slot, numOfStudents }: { slot: string, numOfStudents: number}) => (
                                            <div key={slot} className="w-16 text-sm text-gray-600">
                                                {numOfStudents}
                                            </div>
                                        ))
                                    }
                                
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </Card>
        </div>
    )
}