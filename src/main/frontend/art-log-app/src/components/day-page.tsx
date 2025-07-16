import { useParams } from "react-router-dom"

import Layout from "@/components/layout"
import { ModeToggle } from "@/components/mode-toggle"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { DialogForm } from "@/components/dialog-form"

export function DayPage() {
    const { day } = useParams<{ day?: string }>()
    if (!day) {
        return <div>Invalid day parameter.</div>
    }
    return (
        <Layout
            children={(
                <div>
                    <SiteHeader heading={day[0].toUpperCase() + day.substring(1)} />
                    <div className="w-[73rem]">
                        <div className="flex flex-wrap gap-4 max-w-screen pt-4">
                            <Card className="w-full max-w-xl">
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Morning</CardTitle>
                                    <CardAction>
                                        <DialogForm/>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                            <Card className="w-full max-w-xl">
                                <CardHeader className="justify-items-start">
                                    <CardTitle>Afternoon</CardTitle>
                                    <CardAction>
                                        <DialogForm/>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <p>Card Content</p>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="absolute top-4 right-4">
                            <ModeToggle/>
                        </div>
                    </div>
                </div>
                
            )}
        />
    )
}