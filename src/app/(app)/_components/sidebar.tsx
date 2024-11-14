import { Icons } from "@/components/ui/icons";
import { siteUrls } from "@/config/urls";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserDropdown } from "@/app/(app)/_components/user-dropdown";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { SidebarNav } from "@/app/(app)/_components/sidebar-nav";
import { getUser } from "@/server/auth";
import {
    OrgSelectDropdown,
    type UserOrgs,
} from "@/app/(app)/_components/org-select-dropdown";
import { getOrganizations } from "@/server/actions/organization/queries";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

type SideNavProps = {
    sidebarNavIncludeIds?: string[];
    sidebarNavRemoveIds?: string[];
    showOrgSwitcher?: boolean;
    showLogo?: boolean;
};

/**
 * @purpose The sidebar component contains the sidebar navigation and the user dropdown.
 * to add a new navigation item, you can add a new object to the navigation array in the @see /src/config/dashboard.ts file
 * to customize the user dropdown, you can add a new object to the navigation array in the @see /src/config/user-dropdown.ts file
 *
 * fell free to customize the sidebar component as you like
 */

export async function AppSidebar({
    sidebarNavIncludeIds,
    sidebarNavRemoveIds,
    showOrgSwitcher = true,
    showLogo = true,
}: SideNavProps) {
    const user = await getUser();

    const { currentOrg, userOrgs } = await getOrganizations();

    const myOrgs = userOrgs.filter((org) => org.ownerId === user?.id);
    const sharedOrgs = userOrgs.filter((org) => org.ownerId !== user?.id);

    const urgOrgsData: UserOrgs[] = [
        {
            heading: "My Orgs",
            items: myOrgs,
        },
        {
            heading: "Shared Orgs",
            items: sharedOrgs,
        },
    ];

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="w-full">
                {showLogo && (
                    <div className="flex items-center ">
                        <Link
                            href={siteUrls.dashboard.home}
                            className="flex w-full items-center gap-1"
                        >
                            <Icons.logo className="h-10 w-16 fill-primary" />
                        </Link>
                    </div>
                )}
                {showOrgSwitcher && (
                    <div className="mt-4 py-2">
                        <OrgSelectDropdown
                            userOrgs={urgOrgsData}
                            currentOrg={currentOrg}
                        />
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <ScrollArea style={{ height: "calc(100vh - 10.5rem)" }}>
                    <SidebarNav
                        sidebarNavIncludeIds={sidebarNavIncludeIds}
                        sidebarNavRemoveIds={sidebarNavRemoveIds}
                    />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </SidebarContent>

            <SidebarFooter>
                {/* <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href={siteUrls.feedback}
                                    className={cn(
                                        "z-10 transition-transform hover:scale-90 flex gap-2",
                                    )}
                                >
                                    <HelpCircle className=" h-5 w-5 text-muted-foreground" />
                                    Send Feedback
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {"Provide Feedback"}
                            </TooltipContent>
                        </Tooltip> */}
                <UserDropdown user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

export function SidebarLoading({
    showOrgSwitcher = true,
}: {
    showOrgSwitcher?: boolean;
}) {
    return (
        <aside className={cn("h-full")}>
            <div className={cn(" flex h-16 items-center justify-between")}>
                <Link
                    href={siteUrls.home}
                    className={cn("z-10 transition-transform hover:scale-90")}
                >
                    <Icons.logo
                        className="text-xl"
                        iconProps={{ className: "w-6 h-6 fill-primary" }}
                    />
                </Link>
            </div>

            <div className="py-2">
                <Skeleton className="h-9 w-full rounded-md" />
            </div>

            {showOrgSwitcher && (
                <div className="py-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>
            )}

            <ScrollArea style={{ height: "calc(100vh - 10.5rem)" }}>
                <div className="h-full w-full space-y-2 py-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-8 rounded-md" />
                    ))}
                    <ScrollBar orientation="vertical" />
                </div>
            </ScrollArea>
        </aside>
    );
}
