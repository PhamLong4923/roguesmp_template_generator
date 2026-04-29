import { NavLink, useNavigate } from "react-router-dom";
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
    SidebarMenuItem, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {useAuth} from "@/store/AuthContext";

const NAV_SECTIONS = [
    {
        label: "EDITORS",
        items: [
            { label: "Dashboard",     to: "/" },
            { label: "Item",          to: "/item" },
            { label: "Entity",        to: "/entity" },
            { label: "Dungeon",       to: "/dungeon" },
            { label: "Room",          to: "/room" },
            { label: "Spawner",       to: "/spawner" },
            { label: "Loot Table",    to: "/loottable" },
        ],
    },
];

function getInitials(email = "") {
    return email
        .split("@")[0]
        .split(/[._-]/)
        .slice(0, 2)
        .map((p: string) => p[0]?.toUpperCase() ?? "")
        .join("");
}

export function AppSidebar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Sidebar
            collapsible="icon"
            className="border-r bg-sidebar"
        >
            {/* Header */}
            <SidebarHeader className="px-3 py-4 flex items-center justify-between">
                <span className="text-sm font-semibold">MCD</span>
                <SidebarTrigger />
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                {NAV_SECTIONS.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>
                            {section.label}
                        </SidebarGroupLabel>

                        <SidebarMenu>
                            {section.items.map((item) => (
                                <SidebarMenuItem key={item.to}>
                                    <SidebarMenuButton asChild>
                                        <NavLink to={item.to}>
                                            {item.label}
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={async () => {
                        await signOut(auth);
                        navigate("/login");
                    }}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}