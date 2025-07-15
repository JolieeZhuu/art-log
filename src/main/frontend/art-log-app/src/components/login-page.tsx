import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod" // zod is used for input validation

import { Controller } from "@/restAPI/entities"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


// visit https://zod.dev/ for documentation
const adminSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
})

export function LoginPage() {

    // variable initializations
    const requests = new Controller()
    const adminUrl = "http://localhost:8080/admin/"
    const navigate = useNavigate()
    const [isMatching, setIsMatching] = useState(true);
    
    // define form
    const form = useForm<z.infer<typeof adminSchema>>({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    // define submit handler
    async function onSubmit(values: z.infer<typeof adminSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        const admins = new Map()
        await requests.getAll(adminUrl)
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
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Login to ART.LOG</CardTitle>
                    <CardDescription>Enter your username and password to access our student database.</CardDescription>
                </CardHeader>
                <CardContent>                    
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="ex: art"/>
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
                                            <Input {...field} placeholder="ex: log"/>
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
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                    
                </CardContent>
            </Card>
        </>
    )
}
