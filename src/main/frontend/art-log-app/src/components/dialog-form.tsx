import * as React from "react"

// component ui imports
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
import type { FieldPath } from "react-hook-form"
import { ComboboxOptions } from "@/components/combobox-options"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// external imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // zod is used for input validation

import { Controller } from "@/restAPI/entities"
import { Terminal } from "lucide-react"

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
    phoneNumber: z.string().min(1, {
        message: "Phone number is required.",
    }),
    timeExpected: z.string().min(1, {
        message: "Time expected is required."
    }),
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
  {
    value: "9 AM",
    label: "9 AM",
  },
  {
    value: "10 AM",
    label: "10 AM",
  },
  {
    value: "11 AM",
    label: "11 AM",
  },
  {
    value: "12 AM",
    label: "12 AM",
  },
  {
    value: "1 PM",
    label: "1 PM",
  },
  {
    value: "2 PM",
    label: "2 PM",
  },
  {
    value: "3 PM",
    label: "3 PM",
  },
  {
    value: "4 PM",
    label: "4 PM",
  },
  {
    value: "5 PM",
    label: "5 PM",
  },
  {
    value: "6 PM",
    label: "6 PM",
  },
]


// shortcut to defining an array of maps in TS
const formFieldOptions: {
    name: FieldPath<z.infer<typeof studentSchema>>
    label: string
    placeholder: string
    input: any
}[] = [
    {
        name: "firstName",
        label: "First Name",
        placeholder: "ex: Emma",
        input: "input",
    },
    {
        name: "lastName",
        label: "Last Name",
        placeholder: "ex: Stone",
        input: "input",
    },
    {
        name: "day",
        label: "Day",
        placeholder: "ex: Monday",
        input: dayOptions,
    },
    {
        name: "classId",
        label: "Class ID",
        placeholder: "ex: LVL1",
        input: classIdOptions,
    },
    {
        name: "phoneNumber",
        label: "Phone Number",
        placeholder: "ex: 6471234567",
        input: "input",
    },
    {
        name: "timeExpected",
        label: "Time Expected",
        placeholder: "ex: 4 PM",
        input: timeExpectedOptions,
    },
]

export function DialogForm() {

    // variable initializations
    const requests = new Controller()
    const studentUrl = "http://localhost:8080/student/"

    const [open, setOpen] = React.useState(false)
    //const [submitted, setSubmitted] = React.useState(false)
    
    // define form
    const form = useForm<z.infer<typeof studentSchema>>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            day:"",
            classId: "",
            phoneNumber: "",
            timeExpected: "",
        },
    })

    // define submit handler
    async function onSubmit(values: z.infer<typeof studentSchema>) {
        console.log("hello")
        console.log("Submitted values:", values)

        const data = {
            first_name: values.firstName,
            last_name: values.lastName,
            class_id: values.classId,
            day: values.day,
            phone_number: values.phoneNumber,
            payment_number: 0,
            class_number: 0,
            notes: 'Notes for ' + values.firstName,
            payment_notes: 'Payment notes for ' + values.firstName,
            time_expected: values.timeExpected
        }

        await requests.add(studentUrl, data)
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Open Form</Button>
                </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <DialogHeader>
                                <DialogTitle>Create Student Form</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            {formFieldOptions.map((item) => (
                                <FormField
                                    key={item.label}
                                    control={form.control}
                                    name={item.name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{item.label}</FormLabel>
                                            <FormControl>
                                                {item.input === "input" ? (
                                                     <Input {...field} className="w-full" placeholder={item.placeholder}/>
                                                ) : (
                                                    <ComboboxOptions
                                                        options={item.input}
                                                        value={field.value} 
                                                        onChange={field.onChange} 
                                                        selectPhrase="Select..."
                                                        commandEmpty="Selection not found."
                                                    />
                                                )}
                                               
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="outline">Create Student</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}