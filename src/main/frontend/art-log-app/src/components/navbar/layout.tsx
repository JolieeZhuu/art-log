import { SidebarProvider } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/navbar/app-sidebar"

// Sidebar trigger skipped due to an error

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