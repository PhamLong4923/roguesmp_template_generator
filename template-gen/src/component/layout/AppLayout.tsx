import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/component/layout/AppSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-background text-foreground">
                <AppSidebar />

                <div className="flex flex-1 flex-col">


                    <main className="flex-1 overflow-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}