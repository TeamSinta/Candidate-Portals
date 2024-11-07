import { AppHeader } from "@/app/(app)/_components/app-header";
import { AppSidebar, SidebarLoading } from "@/app/(app)/_components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

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
            <div className=" flex w-[100%] items-start ">
                <Suspense fallback={<SidebarLoading />}>
                    <AppSidebar
                        sidebarNavIncludeIds={sideNavIncludedIds}
                        sidebarNavRemoveIds={sideNavRemoveIds}
                        showOrgSwitcher={showOrgSwitcher}
                        showLogo={true}
                    />
                </Suspense>

                <SidebarInset className="border p-6 dark:bg-gray-900">
                    {children}
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
