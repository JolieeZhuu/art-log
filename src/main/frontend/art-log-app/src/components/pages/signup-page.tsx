import * as React from "react"

// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// UI components
import { Button } from "../../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form"

// visit https://zod.dev/ for documentation
// Schema with expected input types and error messages if input is invalid
const signupSchema = z.object({
    email: z.email({
        message: "Please enter a valid email address.",
    }),
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

export function SignupPage() {

    // Variable initializations
    const navigate = useNavigate()
    const [submitError, setSubmitError] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [usernameValid, setUsernameValid] = useState(false)
    
    // Define form and default values
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    // Watch username field for real-time validation
    const username = form.watch("username")

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

    // Define submit handler, parameter values are the form values
    async function onSubmit(values: z.infer<typeof signupSchema>) {
        setSubmitError("") // Clear previous errors
        
        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
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
        <div className="flex justify-center items-center min-h-screen">

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Signup to Art Log</CardTitle>
                    <CardDescription>Enter your email, username, and password to create an account.</CardDescription>
                </CardHeader>
                <CardContent className="break-words">                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
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
                            <Button className="w-full" type="submit" variant="outline">Sign Up</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="w-full flex justify-center">
                        <p className="text-sm">Already have an account? <span/>
                            <a href="#/login">
                                Login
                            </a>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
};
