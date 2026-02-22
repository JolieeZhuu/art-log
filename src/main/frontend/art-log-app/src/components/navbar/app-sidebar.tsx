// UI components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../../components/ui/sidebar"
import DataButton from "../data-transfer/data-button"

// Sidebar items
const data = [
    {
        title: "Dashboard",
        url: "#",
        items: [
            {
                title: "Summary",
                url: "#/summary",
            },
            {
                title: "Students",
                url: "#/students",
            },
        ],
    },
    {
        title: "Files",
        url: "#",
        items: [
            {
                title: "Monday",
                url: "#/day/monday",
            },
            {
                title: "Tuesday",
                url: "#/day/tuesday",
            },
            {
                title: "Wednesday",
                url: "#/day/wednesday",
            },
            {
                title: "Thursday",
                url: "#/day/thursday",
            },
            {
                title: "Friday",
                url: "#/day/friday",
            },
            {
                title: "Saturday",
                url: "#/day/saturday",
            },
            {
                title: "Sunday",
                url: "#/day/sunday",
            },
        ],
    }, 
    {
        title: "System",
        url: "#",
        items: [
            {
                title: "Settings",
                url: "#/settings"
            },
            {
                title: "Log Out",
                url: "#/login"
            }
        ]
    }
]

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
            <SidebarHeader className="pl-4 pt-4">
                <p>Art Log</p>
            </SidebarHeader>
            <SidebarContent>
                {
                    data.map((item) => (
                        <SidebarGroup key={item.title}>
                            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {
                                        item.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton asChild>
                                                    <a href={item.url}>{item.title}</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))
                                    }
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                }
                <SidebarGroup>
                    <SidebarGroupLabel>Data</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <DataButton/>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}