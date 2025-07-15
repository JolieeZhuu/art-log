import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// sidebar trigger skipped due to an error

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div>
        <AppSidebar />
        <main>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}