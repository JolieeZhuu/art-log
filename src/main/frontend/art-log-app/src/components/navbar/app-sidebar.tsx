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

/*

const dashboard = [
    {
        title: "Summary",
        url: "#/summary",
        icon: Home,
    },
    {
        title: "Students",
        url: "#/students",
        icon: Table,
    },
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
        url: "#/login",
        icon: LogOut,
        toggle: "",
    },
]

export function AppSidebar() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token")
        console.log("logging out")
    }

    return (
        <Sidebar variant="floating">
            <SidebarContent>
                <SidebarGroup>
                    <div>
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
                    </div>
                    <div className="mt-4">
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
                    </div>
                    <div className="mt-4">
                        <SidebarGroupLabel>System</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {system.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {
                                        item.title === "Log Out" ? (
                                            <SidebarMenuButton asChild onClick={logout}>
                                                <a href={item.url}>
                                                    <item.icon/>
                                                    <span className="dark:text-white text-black">{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        ) : (
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <item.icon/>
                                                    <span className="dark:text-white text-black">{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        )
                                    }
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </div>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}*/