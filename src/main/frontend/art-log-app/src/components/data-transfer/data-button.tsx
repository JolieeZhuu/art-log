// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// UI imports
import { Button } from "../ui/button"
import { Textarea } from "@/components/ui/textarea"
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

// Schema with expected input types and error messages if input is invalid
const dataSchema = z.object({
    data: z.string({
        message: "Data is required.",
    }),
})

// consider when empty (just don't update anything)

export default function DataButton() {

    // Define form
    const form = useForm<z.infer<typeof dataSchema>>({
        resolver: zodResolver(dataSchema),
        defaultValues: {
            data: "",
        },
    })

    async function onSubmit(values: z.infer<typeof dataSchema>) {
        console.log(values);
    }

    return (
        <>
            <Dialog>
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
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <FormField
                                control={form.control}
                                name="data"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel />
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Place your JSON data here"
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

/*
#STUDENT
{
"first_name": "Jolie",
"last_name": "Zhu",
"class_id": "INTE-1",
"day": "Monday",
"phone_number": "1234567890",
"time_expected": "12:00:00",
"general_notes": "",
"payment_number": 0,
"class_number": 0,
"total_classes": 0,
"class_hours": 2,
}
*/