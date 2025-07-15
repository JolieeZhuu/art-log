import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
        url: "#/monday",
        icon: Inbox,
    },
    {
        title: "Tuesday",
        url: "#/tuesday",
        icon: Inbox,
    },
    {
        title: "Wednesday",
        url: "#/wednesday",
        icon: Inbox,
    },
    {
        title: "Thursday",
        url: "#/thursday",
        icon: Inbox,
    },
    {
        title: "Friday",
        url: "#/friday",
        icon: Inbox,
    },
    {
        title: "Saturday",
        url: "#/saturday",
        icon: Inbox,
    },
    {
        title: "Sunday",
        url: "#/sunday",
        icon: Inbox,
    },
]

const system = [
    {
        title: "Settings",
        url: "#/settings",
        icon: Settings,
    },
    {
        title: "Dark Mode",
        url: "#/dark-mode",
        icon: Inbox,
    },
    {
        title: "Log Out",
        url: "#/log-out",
        icon: Inbox,
    },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboard.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
                      <item.icon />
                      <span>{item.title}</span>
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
                      <item.icon />
                      <span>{item.title}</span>
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