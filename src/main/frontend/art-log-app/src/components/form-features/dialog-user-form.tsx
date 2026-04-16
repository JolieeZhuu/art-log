import * as React from "react"

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { getAll } from "../../restAPI/entities"

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
import { ComboboxOptions } from "./combobox-options"
import { roles } from "./options"

// visit https://zod.dev/ for documentation
// Schema with expected input types and error messages if input is invalid
const userSchema = z.object({
    email: z.email({
        message: "Please enter a valid email address.",
    }),
    firstName: z.string().min(1, {
        message: "Please enter a valid first name.",
    }),
    lastName: z.string().min(1, {
        message: "Please enter a valid last name.",
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    role: z.string().min(1, {
        message: "Please enter a valid role.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export function DialogUserForm() {

    // Variable initializations
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [usernameValid, setUsernameValid] = useState(false);
    const [open, setOpen] = useState(false);
    const roleUrl = "http://localhost:8080/role/";
    const [roles, setRoles] = useState<{value: string, label: string}[]>([]);

    React.useEffect(() => {
        async function fetchRoles() {
            try {
                const data = await getAll(roleUrl); // array of role_name, role_desc
                const newData = data.map(({ role_name } : { role_name: string }) => ({
                    value: role_name,
                    label: role_name,
                }))
                setRoles(newData);
            } catch (error) {
                console.log(error);
            }
        }
        fetchRoles();
    }, []);

    // Define form and default values
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            role: "",
        },
    })

    // Watch username field for real-time validation
    const username = form.watch("username")

    React.useEffect(() => {

    }, [open])

    // Debounced username checking
    React.useEffect(() => {
        if (username && username.length >= 3) {
            const timeoutId = setTimeout(async () => {
                try {
                    const response = await fetch(`http://localhost:8080/auth/check-username?username=${username}`)
                    if (response.ok) {
                        setUsernameError("")
                        setUsernameValid(true)
                    } else {
                        const errorMsg = await response.text()
                        setUsernameError(errorMsg)
                        setUsernameValid(false)
                    }
                } catch (error) {
                    setUsernameError("Error checking username")
                    setUsernameValid(false)
                }
            }, 500) // 500ms delay after user stops typing

            return () => clearTimeout(timeoutId)
        } else {
            setUsernameError("")
            setUsernameValid(false)
        }
    }, [username])

    function resetForm() {
        form.reset();
    }

    // Define submit handler, parameter values are the form values
    async function onSubmit(values: z.infer<typeof userSchema>) {
        setSubmitError("") // Clear previous errors
        
        try {
            const { role, ...newValues } = values; // THIS IS SUCH A COOL WAY TO OMIT A KEY
            console.log(values.role);
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newValues)
            })
            
            if (response.ok) {
                // Success - redirect to verification page
                navigate('/verify',
                    {
                        state: {
                            email: values.email
                        }
                    }
                )
            } else {
                // Get error message from backend
                const errorMsg = await response.text()
                setSubmitError(errorMsg)
            }
        } catch (error: any) {
            setSubmitError('Failed to create account. Please try again.')
        }
    }

    return (
        <div className="flex">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" onClick={resetForm}>Create User</Button>
                </DialogTrigger>
                <DialogContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                            <DialogHeader>
                                <DialogTitle>Create User Form</DialogTitle>
                                <DialogDescription>This should only be done by the admins.</DialogDescription>
                            </DialogHeader>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="Enter email" type="email"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="Enter first name"/>
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
                                            <Input {...field} className="w-full" placeholder="Enter last name"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="Enter username"/>
                                        </FormControl>
                                        {/* Show real-time username validation */}
                                        {usernameError && (
                                            <FormMessage>{usernameError}</FormMessage>
                                        )}
                                        {usernameValid && username.length >= 3 && (
                                            <p className="text-sm text-green-600">✓ Username available</p>
                                        )}
                                        <FormMessage /> {/* Zod validation errors */}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <ComboboxOptions
                                                options={roles}
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="Enter password" type="password"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Show submit errors (like email already exists) */}
                            {submitError && (
                                <FormMessage>{submitError}</FormMessage>
                            )}
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="coloured">Create User</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>   
        </div>
    )
};
