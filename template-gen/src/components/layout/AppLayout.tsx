// Layout.tsx
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {/* SidebarProvider tự có flex + min-h-svh, không cần override */}
            <AppSidebar />
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden h-screen">
                <main className="flex-1 p-2">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}