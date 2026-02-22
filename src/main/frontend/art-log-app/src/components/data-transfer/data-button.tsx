// External imports
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { add } from "../../restAPI/entities"

// UI imports
import { Button } from "../ui/button"
import { Textarea } from "../../components/ui/textarea"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form"
import { toast } from "sonner"

// Schema with expected input types and error messages if input is invalid
const dataSchema = z.object({
    student_data: z.string({
        message: "Data is required.",
    }),
    attendance_data: z.string({
        message: "Data is required."
    })
})

// consider when empty (just don't update anything)

export default function DataButton() {

    // variable initializations
    const studentUrl = "http://localhost:8080/student/";
    const attendanceUrl = "http://localhost:8080/attendance/";
    const [open, setOpen] = React.useState(false);

    // Define form
    const form = useForm<z.infer<typeof dataSchema>>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            student_data: "",
            attendance_data: "",
        },
    })

    async function onSubmit(values: z.infer<typeof dataSchema>) {
        const studentData = values.student_data;
        const attendanceData = values.attendance_data;
        const jsonStudentList = studentData.split("\n");
        const jsonAttendaceList = attendanceData.split("\n");

        let currMessage = `All data was added.`;

        jsonStudentList.forEach(async (jsonString: string) => {
            try {
                // for student data
                if (jsonString.trim() != "") {
                    const jsonBody = JSON.parse(jsonString);
                    await add(studentUrl, jsonBody);
                }
            } catch (Error) {
                currMessage = `Student data is either not in correct form, or is empty.`;
            }
        })

        jsonAttendaceList.forEach(async (jsonString: string) => {
            try {
                // for attendance data
                if (jsonString.trim() != "") {
                    const jsonBody = JSON.parse(jsonString);
                    await add(attendanceUrl, jsonBody);
                }
            } catch (Error) {
                currMessage = `Attendance data is either not in correct form, or is empty.`;
            }
        })
        toast(currMessage);
        setOpen(false);
        form.reset();
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>Add Data</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle>JSON Data Transfer</DialogTitle>
                    <DialogDescription>
                        Please ensure that the data you paste is in JSON form!
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="student_data"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Data</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Place your JSON student data here."
                                                value={String(field.value)} 
                                                onChange={field.onChange} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="attendance_data"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Attendance Data</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Place your JSON attendance data here."
                                                value={String(field.value)} 
                                                onChange={field.onChange} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="mt-5">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Add Data</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
};