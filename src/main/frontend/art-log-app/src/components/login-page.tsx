// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { useNavigate } from "react-router-dom"
import { useState } from "react"

// UI components
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"


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
        console.log(values)

        setSubmitError("") // Reset error message

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            })
            
            if (response.ok) {
                // Success - redirect to summary page
                navigate('/summary')
            } else {
                // Get error message from backend
                const errorMsg = await response.text()
                setSubmitError(errorMsg)
            }
        } catch (error: any) {
            setSubmitError('Failed to login. Please try again.')
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen">

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to ART.LOG</CardTitle>
                    <CardDescription>Enter your username and password to access our student database.</CardDescription>
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
                            <Button type="submit" variant="outline">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
