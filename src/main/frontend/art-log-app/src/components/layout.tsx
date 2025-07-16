import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

// sidebar trigger skipped due to an error

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div>
        <AppSidebar/>
        <main className="pl-[9.5rem] min-h-screen w-full">
            {children}
        </main>
      </div>
    </SidebarProvider>
  )
}