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
        <SidebarProvider>
            <div className=" flex items-start w-[100%] ">

                    <Suspense fallback={<SidebarLoading />}>
                        <AppSidebar
                            sidebarNavIncludeIds={sideNavIncludedIds}
                            sidebarNavRemoveIds={sideNavRemoveIds}
                            showOrgSwitcher={showOrgSwitcher}
                            showLogo={true}
                        />
                    </Suspense>

                    <SidebarInset className="p-6 border dark:bg-gray-900">
                    {children}
                     </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
