// UI Components
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "../navbar/site-header"

import { AvailabilityChart, AvailabilitySlots } from "@/components/chart/availability-chart"

export function Summary() {
    
    return (
        <Layout
            children={(
                <div className="w-full p-[2rem]">
                    <SiteHeader heading="Summary"/>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <AvailabilityChart dayOfWeek="Monday"/>
                    <AvailabilityChart dayOfWeek="Tuesday"/>
                    <AvailabilityChart dayOfWeek="Wednesday"/>
                    <AvailabilityChart dayOfWeek="Thursday"/>
                    <AvailabilityChart dayOfWeek="Friday"/>
                    <AvailabilityChart dayOfWeek="Saturday"/>
                    <AvailabilityChart dayOfWeek="Sunday"/>
                </div>
            )}
        />
    )
}