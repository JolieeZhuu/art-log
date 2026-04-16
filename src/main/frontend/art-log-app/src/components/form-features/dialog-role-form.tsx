import * as React from "react"

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { add } from "../../restAPI/entities"

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
import { Input } from "../../components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form"
import { toast } from "sonner"

// visit https://zod.dev/ for documentation
// Schema with expected input types and error messages if input is invalid
const roleSchema = z.object({
    roleName: z.string().min(1, {
        message: "Please enter a valid role name",
    }),
    roleDesc: z.string().min(10, {
        message: "Role description must be at least 10 characters long.",
    }),
})

export function DialogRoleForm() {

    // Variable initializations
    const [open, setOpen] = React.useState(false);
    const roleUrl = "http://localhost:8080/role/";
    
    // Define form and default values
    const form = useForm<z.infer<typeof roleSchema>>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            roleName: "",
            roleDesc: "",
        },
    });

    function resetForm() {
        form.reset();
    }

    // Define submit handler, parameter values are the form values
    async function onSubmit(values: z.infer<typeof roleSchema>) {
        const data = {
            role_name: values.roleName,
            role_desc: values.roleDesc
        }
        await add(roleUrl, data);
        console.log(data);
        setOpen(false);
        form.reset(); // Reset form fields after submission
        toast(`Role ${values.roleName} has been added.`);
    }

    return (
        <div className="flex">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={resetForm}>Create Role</Button>
                </DialogTrigger>
                <DialogContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                            <DialogHeader>
                                <DialogTitle>Create Role Form</DialogTitle>
                                <DialogDescription>This should only be done by the admins.</DialogDescription>
                            </DialogHeader>
                            <FormField
                                control={form.control}
                                name="roleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="Enter name of the role"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="roleDesc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role Description</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="Enter description of the role"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="coloured">Create Role</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>   
        </div>
    )
};
