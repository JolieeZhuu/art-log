import Layout from "@/components/navbar/layout"
import { SiteHeader } from "@/components/site-header"
import { ModeToggle } from "@/components/dark-light-mode/mode-toggle"

export function Settings() {
    return (
        <Layout
            children={(
                <div className="w-[73rem] p-[2rem]">
                    <SiteHeader heading="Settings"/>

                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                </div>
            )}
        />
    )
}