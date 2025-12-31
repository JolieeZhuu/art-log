// UI Components
import { ModeToggle } from "../../components/dark-light-mode/mode-toggle"
import { AvailabilityChart } from "../../components/chart/availability-chart"
import { Card } from "../../components/ui/card"
import { AppSidebar } from "../../components/navbar/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "../../components/ui/sidebar"

export function Summary() {
    
    return (
         <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <p className="text-base font-medium">Summary</p>
                </header>
                <div className="p-4">
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <div className="max-w-3xl">
                        <Card>
                            <div className="space-y-5 pl-5 pr-5">
                                <AvailabilityChart type="Weekday"/>
                                <AvailabilityChart type="Weekend"/>
                            </div>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}