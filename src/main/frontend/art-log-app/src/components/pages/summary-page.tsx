// UI Components
import Layout from "@/components/navbar/layout"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"
import { SiteHeader } from "../navbar/site-header"

import { ExampleChart } from "@/components/chart/example-chart"
import { GanttChart } from "@/components/chart/gantt-chart"

export function Summary() {
    return (
        <Layout
            children={(
                <div className="w-full p-[2rem]">
                    <SiteHeader heading="Summary"/>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <ExampleChart/>
                    <GanttChart/>
                </div>
            )}
        />
    )
}