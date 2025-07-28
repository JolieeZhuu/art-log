import Layout from "@/components/layout"
import { ModeToggle } from "@/components/mode-toggle"
import { SiteHeader } from "./site-header"

export function Summary() {
    return (
        <Layout
            children={(
                <div className="w-[73rem] p-[2rem]">
                    <SiteHeader heading="Summary"/>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                </div>
            )}
        />
    )
}