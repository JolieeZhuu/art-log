// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation
import authService from "../../authService"

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
const loginSchema = z.object({
    email: z.email({
        message: "Email is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
})

export function LoginPage() {

    // Variable initializations
    const navigate = useNavigate()
    const [submitError, setSubmitError] = useState("")
    
    // Define form and default values
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Define submit handler, parameter values are the form values
    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setSubmitError("") // Reset error message

        const result = await authService.login({ 
            email: values.email, 
            password: values.password 
        });

        if (result.success) {
            navigate("/summary");
        } else {
            setSubmitError(result.message || "Login failed");
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to Art Log</CardTitle>
                    <CardDescription>Enter your email and password to access the application.</CardDescription>
                </CardHeader>
                <CardContent className="break-words">                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="ex: art@example.com" type="email"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field}) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="ex: log" type="password"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Show submit errors (like email already exists) */}
                            {submitError && (
                                <FormMessage>{submitError}</FormMessage>
                            )}
                            <Button className="w-full" type="submit" variant="outline">Login</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <div className="w-full flex justify-center">
                        <p className="text-sm">Don't have an account? <span/>
                            <a href="#/signup">
                                Signup
                            </a>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
