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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ComboboxOptions } from "@/components/combobox-options"

// external imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // zod is used for input validation

import { addPaymentNum, addNewPaymentTable } from "@/components/payments/payment-funcs"
import dayjs from 'dayjs'

const numOfClassOptions = [
    {
        value: "10 classes",
        label: "10 classes",
    },
    {
        value: "20 classes",
        label: "20 classes",
    },
]

const paymentSchema = z.object({
    dateExpected: z.date({
        message: "Expected date is required.",
    }),
    numOfClasses: z.string({
        message: "Number of classes is required.",
    }),
})


export function DialogPaymentForm({ id, onPaymentAdded }: { id: number, onPaymentAdded?: () => void }) {

    // variable initializations
    const [openPopover, setOpenPopover] = React.useState(false) // for the calendar popover

    const [open, setOpen] = React.useState(false) // for the dialog
    //const [submitted, setSubmitted] = React.useState(false)
    
    // define form
    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            dateExpected: undefined,
            numOfClasses: undefined,
        },
    })

    // define submit handler
    async function onSubmit(values: z.infer<typeof paymentSchema>) {
        //const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

        const date = values.dateExpected
        const formattedDate = dayjs(date).format('MMM D, YYYY'); // Jan 1, 2025
        const classes = Number(values.numOfClasses.split(" ")[0])

        const currentPaymentNum = await addPaymentNum(id);
        await addNewPaymentTable(id, formattedDate, currentPaymentNum, classes);

        setOpen(false);
        onPaymentAdded?.() // trigger callback
        //const formattedDate = monthNames[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear()
        //console.log(typeof formattedDate)
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Add Payment Table</Button>
                </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <DialogHeader>
                                <DialogTitle>Add Payment Table Form</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <FormField
                                control={form.control}
                                name="dateExpected"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expected Date</FormLabel>
                                        <FormControl>
                                            <Popover open={openPopover} onOpenChange={setOpenPopover} {...field}>
                                                <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    id="date"
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {field.value ? field.value.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        captionLayout="dropdown"
                                                        onSelect={(selectedDate) => {
                                                            field.onChange(selectedDate)
                                                            setOpenPopover(false)
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="numOfClasses"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Classes</FormLabel>
                                        <FormControl>
                                            <ComboboxOptions
                                                options={numOfClassOptions}
                                                value={field.value} 
                                                onChange={field.onChange} 
                                                selectPhrase="Select..."
                                                commandEmpty="Selection not found."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Add Payment</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}