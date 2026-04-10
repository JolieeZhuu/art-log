import * as React from "react"

// External imports
import { useParams } from "react-router-dom"
import axios from "axios"

// Internal imports
import { ModeToggle } from "../../components/dark-light-mode/mode-toggle"
import { type Checkout } from "../../components/checkout-tables/checkout-columns"
import CheckoutTable from "../../components/checkout-tables/checkout-table-page"
import StudentTable from "../../components/student-tables/student-table-page"

// UI components
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Toaster } from "../../components/ui/sonner"
import { AvailabilitySlots } from "../chart/availability-chart"

import { AppSidebar } from "../../components/navbar/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "../../components/ui/sidebar"

export function DayPage() {

    const { day } = useParams<{ day?: string }>();

    // validate the day parameter
    if (!day)
        return <div>Invalid day parameter.</div>

    // LOCAL STORAGE -----------------------------------------------------------------------------------------------
    // students who have been checkmarked (unchecked gets removed from this list)
    const [selectedStudents, setSelectedStudents] = React.useState<Checkout[]>(() => {
        // localStorage.removeItem("selectedStudents"); // debug
        const saved = localStorage.getItem("selectedStudents");
        return saved ? JSON.parse(saved) : [];
    });

    // the data to be displayed in checkout table, initialized/updated by selectedStudents
    const [checkoutData, setCheckoutData] = React.useState<Checkout[]>(() => {
        const savedCheckoutData = localStorage.getItem("checkoutData") // fetch from localStorage
        if (savedCheckoutData) {
            return JSON.parse(savedCheckoutData);
        }
        if (!selectedStudents || selectedStudents.length === 0) return [];
        // if no saved data exists, create from selected students
        const sortedStudents = selectedStudents.sort((a, b) => {
            function timeToMinutes(timeStr: string) {
                let [hours, minutes] = timeStr.split(":").map(Number);
                return hours * 60 + minutes;
                
                /*
                // I think this was morning/afternoon logic
                const [time, ampm] = timeStr.split(" ");
                let [hours, minutes] = time.split(":").map(Number);
                if (ampm === "AM" && hours === 12) {
                    hours = 0;
                } else if (ampm === "PM" && hours !== 12) {
                    hours += 12;
                }
                return hours * 60 + minutes;
                */
            }
            return timeToMinutes(a.checkOut) - timeToMinutes(b.checkOut); // sort by checkOut time (by converting the time to minutes)
        })
        return sortedStudents ? sortedStudents : [];
    });

    // whenever the selected students change, update/save to localStorage
    React.useEffect(() => {
        localStorage.setItem("selectedStudents", JSON.stringify(selectedStudents));
    }, [selectedStudents]);
    
    React.useEffect(() => {
        localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
    }, [checkoutData]);

    React.useEffect(() => { // update checkoutData whenever selectedStudents change
        if (!selectedStudents || selectedStudents.length === 0) return; // in case selectedStudents is empty

        // I don't think I need this
        // const deselectedStudents = checkoutData.filter(
        //     existing => !selectedStudents.find(s => s.id === existing.id) // find students in checkouData that are no longer selected
        // );

        // if (deselectedStudents.length > 0) {
        //     setCheckoutData(prev => prev.map(student =>
        //         deselectedStudents.find(s => s.id === student.id)
        //             ? { ...student, crossedOut: true}
        //             : student
        //     ));
        //     return;
        // } // set all unchecked to be crossed out

        const sortedStudents = selectedStudents.sort((a, b) => {
            function timeToMinutes(timeStr: string) {
                if (!timeStr) return 0; // in case timeStr is empty
                let [hours, minutes] = timeStr.split(":").map(Number);
                return hours * 60 + minutes;
                /*
                // I think this was morning/afternoon logic
                const [time, ampm] = timeStr.split(" ")
                let [hours, minutes] = time.split(":").map(Number)
                if (ampm === "AM" && hours === 12) {
                    hours = 0
                } else if (ampm === "PM" && hours !== 12) {
                    hours += 12
                }
                return hours * 60 + minutes*/
            }
            return timeToMinutes(a.checkOut) - timeToMinutes(b.checkOut);
        });
        
        // Preserve crossedOut status when updating
        const updatedStudents = sortedStudents.map(student => {
            const existingStudent = checkoutData.find(existing => existing.id === student.id);
            return existingStudent ? { ...student, crossedOut: existingStudent.crossedOut } : student;
        });
        
        setCheckoutData(updatedStudents);
    }, [selectedStudents]);

    React.useEffect(() => {
        function clearSelection() { // Called when the time of day arrives
            // Page will update accordingly since there are useEffect functions for each student list
            setSelectedStudents([]);
            localStorage.removeItem("selectedStudents");
            console.log("checkmarks cleared at 7:00 PM"); // Debug
        }
        async function checkTimeAndClear() {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            if (currentHour >= 8 && currentMinute >= 0) {
                const lastClearedDate = localStorage.getItem("lastCleared");
                const today = new Date().toDateString();

                if (lastClearedDate !== today) { // Only clears once per day
                    clearSelection();
                    localStorage.removeItem("checkoutData"); // not sure if this should be debug or not
                    setCheckoutData([]);
                    localStorage.setItem("lastCleared", today); // Store to check when the next day comes
                }

                // below code for testing purposes; must remove above if statement to work
                localStorage.setItem("lastCleared", today);
                // await playTTS("Checkmarks cleared at 7:00 PM"); // seems to always be running
            }
        }
        // clearSelection();
        // localStorage.removeItem("checkoutData");
        // setCheckoutData([]);
        const interval = setInterval(checkTimeAndClear, 60 * 1000); // since parameters are in milliseconds, check every minute

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {

        async function callCheckouts() {
            const studentNames = checkTimeAndCross();
            if (studentNames !== "") {
                // await playTTS(`${studentNames} can pack up now.`); // seems to always be running
            }
            // Name1, Name2, Name3,...NameN can pack up now
        }

        function checkTimeAndCross() {
            const filteredStudents = checkoutData.filter(student => !student.crossedOut); // filter out students that are already crossed out

            let studentNames = ""; // concatenates names of students who can pack up
            let hasUpdates = false; // manage updates instead of page reload
            
            // create a new array with updated students
            const updatedCheckoutData = checkoutData.map(student => {
                if (student.crossedOut) return student; // already crossed out

                console.log(student); // debug
                
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                let [hours, minutes] = student.checkOut.split(" ")[0].split(":").map(Number); // another issue here
                console.log(currentHour, currentMinute);
                console.log(student.checkOut);
                console.log(hours, minutes);

                /*
                // I think this was morning/afternoon logic
                const [time, ampm] = student.checkOut.split(" ")
                let [hours, minutes] = time.split(":").map(Number)
                if (ampm === "AM" && hours === 12) {
                    hours = 0
                } else if (ampm === "PM" && hours !== 12) {
                    hours += 12
                }*/
                console.log(currentHour > hours || (currentHour === hours && currentMinute >= minutes));
                if (currentHour > hours || (currentHour === hours && currentMinute >= minutes)) {
                    studentNames += student.name + ", ";
                    hasUpdates = true;
                    return { ...student, crossedOut: true };
                }
                
                return student // no change
            })
            console.log(updatedCheckoutData);

            // only update state if there were changes
            if (hasUpdates) {
                setCheckoutData(updatedCheckoutData); // state setter
            }
            return studentNames;

        }
        const interval = setInterval(callCheckouts, 60 * 1000); // since parameters are in milliseconds, check every minute

        return () => clearInterval(interval);
    }, []);

    async function playTTS(text: string, lang = 'en') {
        try {
            // HTTP GET request to the TTS API
            // ensure the text is URL-encoded to handle special characters
            const response = await axios.get(
                `http://localhost:8080/speak?text=${encodeURIComponent(text)}&lang=${lang}`,
                { responseType: 'blob' } // tells axios to expect a binary data response
                // Binary Large Object = blob
            );
            
            const audioUrl = URL.createObjectURL(response.data); // creates a temporary URL that points to the binary data
            const audio = new Audio(audioUrl); // URLs can be played directly in audio elements
            await audio.play();
            
            audio.onended = () => URL.revokeObjectURL(audioUrl); // event handler that releases the blob URL from memory after playback ends
        } catch (error) {
            console.error('TTS Error:', error);
        } 
    }

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <p className="text-base font-medium">{day[0].toUpperCase() + day.substring(1)}</p>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {/* Display student list cards */}
                    <div className="flex flex-col gap-y-5">
                        <div className="flex gap-5">
                            <div className="shrink md:shrink-0 min-w-0">
                                <AvailabilitySlots dayOfWeek={day[0].toUpperCase() + day.substring(1)} header=""/>
                            </div>

                            <div className="flex-1 shrink md:shrink-0 min-w-0">
                                <Card>
                                    <CardHeader className="justify-items-start">
                                        <CardTitle>Student List</CardTitle>
                                    </CardHeader>
                                    <CardContent className="overflow-x-auto">
                                        <StudentTable dayOfWeek={day} setSelectedStudents={setSelectedStudents} selectedStudents={selectedStudents}/>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Display checkout list */}
                        <div className="shrink md:shrink-0 min-w-0">
                            <Card>
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Checkout List</CardTitle>
                                </CardHeader>
                                <CardContent className="overflow-x-auto">
                                    <CheckoutTable checkoutData={checkoutData}/>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="">
                        <div className="absolute top-4 right-4">
                            <ModeToggle/>
                        </div>
                    </div>
                    <Toaster/>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}