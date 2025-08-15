import * as React from "react"

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { add } from "@/restAPI/entities"
import { convertTo24Hour } from "../payment-tables/payment-funcs"

// UI components
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ComboboxOptions } from "@/components/form-features/combobox-options"
import { toast } from "sonner"

// Schema with expected input types and error messages if input is invalid
const studentSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name is required.",
    }),
    lastName: z.string().min(1, {
        message: "Last name is required.",
    }),
    day: z.string().min(1, {
        message: "Day is required.",
    }),
    classId: z.string().min(1, {
        message: "Class ID is required.",
    }),
    phoneNumber: z.string().length(10, {
        message: "Proper phone number is required.",
    }),
    timeExpected: z.string().min(1, {
        message: "Time expected is required."
    }),
    hoursOfClass: z.number({
        message: "Hours of class is required."
    })
})

const dayOptions = [
  {
    value: "Monday",
    label: "Monday",
  },
  {
    value: "Tuesday",
    label: "Tuesday",
  },
  {
    value: "Wednesday",
    label: "Wednesday",
  },
  {
    value: "Thursday",
    label: "Thursday",
  },
  {
    value: "Friday",
    label: "Friday",
  },
  {
    value: "Saturday",
    label: "Saturday",
  },
  {
    value: "Sunday",
    label: "Sunday",
  },
]

// LATER FEATURES: HAVE A FUNCTION THAT LETS USER ADD THEIR OWN OPTIONS
// also fix scrollable area?
const classIdOptions = [
  {
    value: "LV1",
    label: "LV1",
  },
  {
    value: "LV2",
    label: "LV2",
  },
  {
    value: "LV3",
    label: "LV3",
  },
  {
    value: "LV4",
    label: "LV4",
  },
  {
    value: "INTE1",
    label: "INTE1",
  },
  {
    value: "INTE2",
    label: "INTE2",
  },
  {
    value: "WT",
    label: "WT",
  },
  {
    value: "P",
    label: "P",
  },
  {
    value: "PRE-U",
    label: "PRE-U",
  },
  {
    value: "U",
    label: "U",
  },
]

const timeExpectedOptions = [
  { value: "9:15 AM", label: "9:15 AM", },
  { value: "9:30 AM", label: "9:30 AM", },
  { value: "9:45 AM", label: "9:45 AM", },
  { value: "10:00 AM", label: "10:00 AM", },
  { value: "10:15 AM", label: "10:15 AM", },
  { value: "10:30 AM", label: "10:30 AM", },
  { value: "10:45 AM", label: "10:45 AM", },
  { value: "11:00 AM", label: "11:00 AM", },
  { value: "11:15 AM", label: "11:15 AM", },
  { value: "11:30 AM", label: "11:30 AM", },
  { value: "11:45 AM", label: "11:45 AM", },
  { value: "12:00 PM", label: "12:00 PM", },
  { value: "12:15 PM", label: "12:15 PM", },
  { value: "12:30 PM", label: "12:30 PM", },
  { value: "12:45 PM", label: "12:45 PM", },
  { value: "1:00 PM", label: "1:00 PM", },
  { value: "1:15 PM", label: "1:15 PM", },
  { value: "1:30 PM", label: "1:30 PM", },
  { value: "1:45 PM", label: "1:45 PM", },
  { value: "2:00 PM", label: "2:00 PM", },
  { value: "2:15 PM", label: "2:15 PM", },
  { value: "2:30 PM", label: "2:30 PM", },
  { value: "2:45 PM", label: "2:45 PM", },
  { value: "3:00 PM", label: "3:00 PM", },
  { value: "3:15 PM", label: "3:15 PM", },
  { value: "3:30 PM", label: "3:30 PM", },
  { value: "3:45 PM", label: "3:45 PM", },
  { value: "4:00 PM", label: "4:00 PM", },
  { value: "4:15 PM", label: "4:15 PM", },
  { value: "4:30 PM", label: "4:30 PM", },
  { value: "4:45 PM", label: "4:45 PM", },
  { value: "5:00 PM", label: "5:00 PM", },
  { value: "5:15 PM", label: "5:15 PM", },
  { value: "5:30 PM", label: "5:30 PM", },
  { value: "5:45 PM", label: "5:45 PM", },
  { value: "6:00 PM", label: "6:00 PM", },
  { value: "6:15 PM", label: "6:15 PM", },
  { value: "6:30 PM", label: "6:30 PM", },
  { value: "6:45 PM", label: "6:45 PM", },
  { value: "7:00 PM", label: "7:00 PM", },
  { value: "7:15 PM", label: "7:15 PM", },
  { value: "7:30 PM", label: "7:30 PM", },
]

// Defining the type and expected props passed
interface DialogStudentFormProps {
    onStudentCreated: () => void
    dayOfWeek: string
}

// Receives props matching DialogStudentFormProps interface
export function DialogStudentForm({ onStudentCreated, dayOfWeek }: DialogStudentFormProps) {

    // Variable initializations
    const studentUrl = "http://localhost:8080/student/"

    const [open, setOpen] = React.useState(false)
    
    // Define form
    const form = useForm<z.infer<typeof studentSchema>>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            day: "",
            classId: "",
            phoneNumber: "",
            timeExpected: "",
            hoursOfClass: 1,
        },
    })

    // Define submit handler
    async function onSubmit(values: z.infer<typeof studentSchema>) {
        console.log("hello")
        console.log("Submitted values:", values)

        const data = {
            first_name: values.firstName,
            last_name: values.lastName,
            class_id: values.classId,
            day: values.day,
            phone_number: values.phoneNumber,
            time_expected: convertTo24Hour(values.timeExpected),
            notes: "",
            payment_notes: "",
            payment_number: 0,
            class_number: 0,
            total_classes: 0,
            class_hours: values.hoursOfClass,
        }

        await add(studentUrl, data)
        onStudentCreated() // Trigger callback to refresh data
        setOpen(false)
        form.reset() // Reset form fields after submission
        toast(`${values.firstName} ${values.lastName} has been added.`)
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Student</Button>
                </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                            <DialogHeader>
                                <DialogTitle>Create Student Form</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="ex: Emma"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="ex: Stone"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="day"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Day</FormLabel>
                                        <FormControl>
                                            <ComboboxOptions
                                                options={dayOptions}
                                                value={String(field.value)} 
                                                onChange={field.onChange} 
                                                selectPhrase="Select..."
                                                commandEmpty="Selection not found."
                                            />
                                        </FormControl>
                                            <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-5">
                                <FormField
                                    control={form.control}
                                    name="timeExpected"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Expected Time</FormLabel>
                                            <FormControl>
                                                <ComboboxOptions
                                                    options={timeExpectedOptions}
                                                    value={String(field.value)} 
                                                    onChange={field.onChange} 
                                                    selectPhrase="Select..."
                                                    commandEmpty="Selection not found."
                                                />
                                            </FormControl>
                                            <div className="h-3">
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField 
                                    control={form.control}
                                    name="hoursOfClass"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Hours of Class</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    value={field.value?.toString() || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        field.onChange(value === "" ? "" : Number(value))
                                                    }}
                                                    type="number" 
                                                    step="any" 
                                                    min="1" 
                                                    placeholder="ex: 1.5"
                                                />
                                            </FormControl>
                                            <div className="h-3">
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="classId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class ID</FormLabel>
                                        <FormControl>
                                            <ComboboxOptions
                                                options={classIdOptions}
                                                value={String(field.value)} 
                                                onChange={field.onChange} 
                                                selectPhrase="Select..."
                                                commandEmpty="Selection not found."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="ex: 1234567890"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Create Student</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}