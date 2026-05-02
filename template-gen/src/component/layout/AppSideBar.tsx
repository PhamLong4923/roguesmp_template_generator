import {NavLink, useLocation, useNavigate} from "react-router-dom";
import { signOut } from "firebase/auth";
// @ts-ignore
import { auth } from "@/firebase/config";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    LogOut, LayoutDashboard, Sword, Users, Castle,
    DoorOpen, Crosshair, ScrollText, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { useAuth } from "@/store/AuthContext";

const NAV_SECTIONS = [
    {
        label: "EDITORS",
        items: [
            { label: "Dashboard",  to: "/",          icon: LayoutDashboard },
            { label: "Item",       to: "/item",       icon: Sword },
            { label: "Entity",     to: "/entity",     icon: Users },
            { label: "Dungeon",    to: "/dungeon",    icon: Castle },
            { label: "Room",       to: "/room",       icon: DoorOpen },
            { label: "Spawner",    to: "/spawner",    icon: Crosshair },
            { label: "Loot Table", to: "/loottable",  icon: ScrollText },
        ],
    },
];

function ToggleButton() {
    const { toggleSidebar, open } = useSidebar();
    return (
        <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
            {open
                ? <PanelLeftClose className="h-4 w-4" />
                : <PanelLeftOpen  className="h-4 w-4" />
            }
        </button>
    );
}

export function AppSidebar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar collapsible="icon" className="border-r bg-sidebar">
            <SidebarHeader className="flex flex-row items-center justify-between px-3 py-3">
                <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
                    MCD
                </span>
                <ToggleButton />
            </SidebarHeader>

            <SidebarContent>
                {NAV_SECTIONS.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {section.items.map((item) => (
                                <SidebarMenuItem key={item.to}>
                                    <SidebarMenuButton
                                        isActive={
                                            item.to === "/"
                                                ? location.pathname === "/"
                                                : location.pathname.startsWith(item.to)
                                        }
                                        tooltip={item.label}
                                        onClick={() => navigate(item.to)}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Logout"
                            onClick={async () => {
                                await signOut(auth);
                                navigate("/login");
                            }}
                        >
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}