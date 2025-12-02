// UI Components
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "../navbar/site-header"
import { AvailabilityChart } from "@/components/chart/availability-chart"
import { Card } from "@/components/ui/card"

export function Summary() {
    
    return (
        <Layout
            children={(
                <div className="w-full p-[2rem]">
                    <SiteHeader heading="Summary"/>

                    <div>
                        <Card>
                            
                        </Card>
                    </div>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <div className="w-full max-w-3xl mt-4">
                        <Card>
                            <div className="space-y-5 pl-5 pr-5">
                                {
                                    /*
                                    <AvailabilityChart type="Weekday"/>
                                    <AvailabilityChart type="Weekend"/>*/
                                }
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        />
    )
}