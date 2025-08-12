import React from "react"
import dayjs from "dayjs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const exampleStudents = [
    {
        id: "1",
        name: "John Smith",
        classId: "INTE-1",
        startTime: "9:45",
        endTime: "11:00",
    },
    {
        id: "2",
        name: "Emma Stone",
        classId: "W",
        startTime: "10:00",
        endTime: "12:00",
    }
]

const morningTimes = timeSlots("9:15", "2:00")
const afternoonTimes = timeSlots("2:00", "6:45")

function timeSlots(startTime: string, endTime: string) {
    let timeHeadings = []
    let curr = startTime
    while (curr !== endTime) {
        const next = dayjs(`2025-01-01 ${curr}`).add(15, "minute").format("h:mm")
        timeHeadings.push(`${curr}-${next}`)
        curr = next
    }
    console.log(timeHeadings)
    return timeHeadings
}

export function GanttChart() {
    return (
        <div className="border w-full mt-10">
            <h2>Student Schedule</h2>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Morning (9:15 AM - 2:00 PM)</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div>Students</div>
                            </div>
                            <ScrollArea className="w-250">
                                <div className="flex gap-8 pr-4 pl-4">
                                    {
                                        morningTimes.map((slot, index) => (
                                            <div key={`${index}:${slot}`} className="whitespace-nowrap">
                                                {slot}
                                            </div>
                                        ))
                                    }
                                </div>
                                <ScrollBar orientation="horizontal"/>
                            </ScrollArea>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Afternoon (2:00 PM - 6:45 PM)</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-4">
                            <div className="flex-1">Students</div>
                            <ScrollArea className="w-250">
                                <div className="flex gap-8 pr-4 pl-4">
                                    {
                                        afternoonTimes.map((slot, index) => (
                                            <div key={`${index}:${slot}`} className="whitespace-nowrap">
                                                {slot}
                                            </div>
                                        ))
                                    }
                                </div>
                                <ScrollBar orientation="horizontal"/>
                            </ScrollArea>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}