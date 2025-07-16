import Layout from "@/components/layout"
import { SiteHeader } from "@/components/site-header"
import { ModeToggle } from "@/components/mode-toggle"

export function Settings() {
    return (
        <Layout
            children={(
                <div className="w-[73rem]">
                    <SiteHeader heading="Settings"/>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                </div>
            )}
        />
    )
}