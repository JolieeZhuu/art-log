import { CalendarDays, Home, LogOut, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

// sidebar items
const dashboard = [
    {
        title: "Summary",
        url: "#/summary",
        icon: Home,
    }
]

const files = [
    {
        title: "Monday",
        day: "monday",
        url: "#/day/monday",
        icon: CalendarDays,
    },
    {
        title: "Tuesday",
        day: "tuesday",
        url: "#/day/tuesday",
        icon: CalendarDays,
    },
    {
        title: "Wednesday",
        day: "wednesday",
        url: "#/day/wednesday",
        icon: CalendarDays,
    },
    {
        title: "Thursday",
        day: "thursday",
        url: "#/day/thursday",
        icon: CalendarDays,
    },
    {
        title: "Friday",
        day: "friday",
        url: "#/day/friday",
        icon: CalendarDays,
    },
    {
        title: "Saturday",
        day: "saturday",
        url: "#/day/saturday",
        icon: CalendarDays,
    },
    {
        title: "Sunday",
        day: "sunday",
        url: "#/day/sunday",
        icon: CalendarDays,
    },
]

const system = [
    {
        title: "Settings",
        url: "#/settings",
        icon: Settings,
    },
    {
        title: "Log Out",
        url: "#/log-out",
        icon: LogOut,
        toggle: "",
    },
]

export function AppSidebar() {
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboard.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon/>
                      <span className="dark:text-white text-black">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
                {files.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                            <a href={item.url}>
                                <item.icon/>
                                <span className="dark:text-white text-black">{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon/>
                      <span className="dark:text-white text-black">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}