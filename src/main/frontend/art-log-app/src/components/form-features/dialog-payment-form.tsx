import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation
import dayjs from 'dayjs'

// Internal imports
import { addTableNum, addNewPaymentTable } from "../../components/payment-tables/payment-funcs"

// UI components
import { Button } from "../../components/ui/button"
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
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import { Input } from "../../components/ui/input"
import { toast } from "sonner"

// Schema with expected input types and error messages if input is invalid
const paymentSchema = z.object({
    dateExpected: z.date({
        message: "Expected date is required.",
    }),
    numOfClasses: z.number().min(1, {
        message: "The value must be a number greater or equal to 1.",
    })
})

export function DialogPaymentForm({ id, onPaymentAdded }: { id: number, onPaymentAdded?: () => void }) {

    // Variable initializations
    const [openPopover, setOpenPopover] = React.useState(false) // For the calendar popover

    const [open, setOpen] = React.useState(false) // for the dialog
    
    // Define form
    const form = useForm<z.infer<typeof paymentSchema>>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            dateExpected: undefined,
            numOfClasses: undefined,
        },
    })

    // Define submit handler
    async function onSubmit(values: z.infer<typeof paymentSchema>) {

        const date = values.dateExpected
        const formattedDate = dayjs(date).toDate() // Jan 1, 2025
        const classes = values.numOfClasses

        const currentPaymentNum = await addTableNum(id);
        await addNewPaymentTable(id, formattedDate, currentPaymentNum, classes);

        setOpen(false);
        form.reset()
        onPaymentAdded?.() // Trigger callback
        toast("New payment table was created.")
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
                                            <Input
                                                {...field}
                                                value={field.value?.toString() || ""}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    field.onChange(value === "" ? undefined : Number(value))
                                                }}
                                                className="w-full" 
                                                placeholder="ex: 10"
                                                type="number"
                                                min="1"
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