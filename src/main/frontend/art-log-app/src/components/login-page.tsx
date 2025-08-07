// External imports
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // Used for input validation

// Internal imports
import { getAll, } from "@/restAPI/entities"
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
const adminSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
})

export function LoginPage() {

    // Variable initializations
    const adminUrl = "http://localhost:8080/admin/"
    const navigate = useNavigate()
    const [isMatching, setIsMatching] = useState(true);
    
    // Define form and default values
    const form = useForm<z.infer<typeof adminSchema>>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // Define submit handler, parameter values are the form values
    async function onSubmit(values: z.infer<typeof adminSchema>) {
        console.log(values)

        const admins = new Map()
        await getAll(adminUrl)
        .then(data => {
            data.forEach((admin: any) => {
                admins.set(admin.username, admin.password);
                console.log(admin.username)
            })
        })

        if (admins.get(values.username) === values.password) {
            setIsMatching(true);
            setTimeout(() => {
                navigate(`/summary`);
            }, 100);
        } else {
            setIsMatching(false);
            console.log("username or password is incorrect"); // DEBUG
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
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="w-full" placeholder="ex: art"/>
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
                            {
                                isMatching ? (
                                    <></>
                                ) : (
                                    <FormMessage>Username or password is incorrect.</FormMessage>
                                )
                            }
                            <Button type="submit" variant="outline">Submit</Button>
                        </form>
                    </Form>
                    
                </CardContent>
            </Card>
        </div>
    )
}
