// UI Components
import { ModeToggle } from "../../components/dark-light-mode/mode-toggle"
import { AppSidebar } from "../../components/navbar/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "../../components/ui/sidebar"

export function Settings() {
    return (
         <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <p className="text-base font-medium">Settings</p>
                </header>
                <div className="p-4">
                    <div className="absolute top-4 right-4">
                        <ModeToggle/>
                    </div>
                    <div>
                        Nothing to see here!
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}