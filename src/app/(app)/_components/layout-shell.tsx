import { AppHeader } from "@/app/(app)/_components/app-header";
import { AppSidebar, SidebarLoading } from "@/app/(app)/_components/sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { Suspense } from "react";
import SlidingSidebar, { SlidingSidebarProvider } from "../(user)/editor/[portalId]/_components/sliding-sidebar";

type AppLayoutProps = {
    children: React.ReactNode;
    sideNavRemoveIds?: string[];
    sideNavIncludedIds?: string[];
    showOrgSwitcher?: boolean;
};

export function AppLayoutShell({
    children,
    sideNavIncludedIds,
    sideNavRemoveIds,
    showOrgSwitcher,
}: AppLayoutProps) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "14rem",
                } as React.CSSProperties
            }
        >
                     <SlidingSidebarProvider>

            <div className=" flex items-start w-full ">
                <Suspense fallback={<SidebarLoading />}>
                    <AppSidebar
                        sidebarNavIncludeIds={sideNavIncludedIds}
                        sidebarNavRemoveIds={sideNavRemoveIds}
                        showOrgSwitcher={showOrgSwitcher}
                        showLogo={true}
                    />
                </Suspense>


                <SidebarInset className="w-full border p-6 dark:bg-gray-900">
                <ScrollArea style={{ height: "calc(100vh - 4.5rem)", overflow:"scroll" }}>

                  {children}
                    </ScrollArea>
                </SidebarInset>


            </div>


            <SlidingSidebar/>
            </SlidingSidebarProvider>
        </SidebarProvider>
    );
}
