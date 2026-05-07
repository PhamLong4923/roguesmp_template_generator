import {useLocation, useNavigate} from "react-router-dom";
import {signOut} from "firebase/auth";
// @ts-ignore
import {auth} from "@/firebase/config";
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import {
    Castle,
    ChevronRight,
    Crosshair,
    DoorOpen,
    FilePen,
    FilePlus,
    LayoutDashboard,
    List,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen,
    ScrollText,
    Sword,
    Users,
} from "lucide-react";
import {useAuth} from "@/store/AuthContext";

const LOOT_TABLE_SUB_ITEMS = [
    {label: "Create", to: "/loottable/create", icon: FilePlus},
    {label: "Update", to: "/loottable/update", icon: FilePen},
    {label: "List", to: "/loottable", icon: List},
];

const NAV_SECTIONS = [
    {
        label: "EDITORS",
        items: [
            {label: "Dashboard", to: "/", icon: LayoutDashboard, sub: null},
            {label: "Item", to: "/item", icon: Sword, sub: null},
            {label: "Entity", to: "/entity", icon: Users, sub: null},
            {label: "Dungeon", to: "/dungeon", icon: Castle, sub: null},
            {label: "Room", to: "/room", icon: DoorOpen, sub: null},
            {label: "Spawner", to: "/spawner", icon: Crosshair, sub: null},
            {label: "Loot Table", to: "/loottable", icon: ScrollText, sub: LOOT_TABLE_SUB_ITEMS},
        ],
    },
];

function ToggleButton() {
    const {toggleSidebar, open} = useSidebar();
    return (
        <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
            {open
                ? <PanelLeftClose className="h-4 w-4"/>
                : <PanelLeftOpen className="h-4 w-4"/>
            }
        </button>
    );
}

export function AppSidebar() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Sidebar collapsible="icon" className="border-r bg-sidebar">
            <SidebarHeader className="flex flex-row items-center justify-between px-3 py-3">
                <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
                    MCD
                </span>
                <ToggleButton/>
            </SidebarHeader>

            <SidebarContent>
                {NAV_SECTIONS.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {section.items.map((item) =>
                                item.sub ? (
                                    // ── Collapsible item (Loot Table) ──────────────────
                                    <Collapsible
                                        key={item.to}
                                        asChild
                                        defaultOpen={location.pathname.startsWith(item.to)}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            {/* Trigger row */}
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={location.pathname.startsWith(item.to)}
                                                    tooltip={item.label}
                                                >
                                                    <item.icon/>
                                                    <span>{item.label}</span>
                                                    <ChevronRight
                                                        className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            {/* Sub-items */}
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.sub.map((sub) => (
                                                        <SidebarMenuSubItem key={sub.to}>
                                                            <SidebarMenuSubButton
                                                                isActive={location.pathname === sub.to}
                                                                onClick={() => navigate(sub.to)}
                                                            >
                                                                <sub.icon className="h-4 w-4"/>
                                                                <span>{sub.label}</span>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    // ── Regular item ───────────────────────────────────
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
                                            <item.icon/>
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            )}
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
                            <LogOut/>
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}