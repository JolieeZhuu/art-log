// UI Components
import { ModeToggle } from "../../components/dark-light-mode/mode-toggle"
import { AppSidebar } from "../../components/navbar/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "../../components/ui/sidebar"

// internal imports
import { DialogRoleForm } from "../form-features/dialog-role-form"
import { DialogUserForm } from "../form-features/dialog-user-form"

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
                    <div className="flex-y space-y-4">
                        <DialogRoleForm/>
                        <DialogUserForm/> 
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}