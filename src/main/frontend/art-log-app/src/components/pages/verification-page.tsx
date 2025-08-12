// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

// UI Components
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const verificationSchema = z.object({
    pin: z.string().length(6, {
        message: "PIN must contain only 6 digits.",
    }),
})

export function VerificationPage() {

    // Variable initializations
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ""
    const [submitError, setSubmitError] = useState("")

    // Define form and default values
    const form = useForm<z.infer<typeof verificationSchema>>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            pin: undefined,
        },
    })

    // Define submit handler, parameter values are the form values
    async function onSubmit(values: z.infer<typeof verificationSchema>) {        
        try {
            const data = {
                email: email,
                verification_code: values.pin,
            }

            const response = await fetch('http://localhost:8080/auth/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            
            if (response.ok) {
                // Success - redirect to login page
                navigate('/login')
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
                    <CardTitle>Verify Your Account</CardTitle>
                    <CardDescription>
                        Please enter the code sent to your email.
                    </CardDescription>
                </CardHeader>
                <CardContent className="break-words">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                                <FormField
                                control={form.control}
                                name="pin"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <div className="flex justify-center">
                                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                {/* Show submit errors (like email already exists) */}
                                {submitError && (
                                    <FormMessage>{submitError}</FormMessage>
                                )}
                                <Button type="submit">Submit</Button>
                            </form>
                        </Form>                    
                </CardContent>
            </Card>
        </div>
    )
};
