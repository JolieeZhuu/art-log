import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// sidebar trigger skipped due to an error

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar/>
        <main className="w-full">
            {children}
        </main>
    </SidebarProvider>
  )
}