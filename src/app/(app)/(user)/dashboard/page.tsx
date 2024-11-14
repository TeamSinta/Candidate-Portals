import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardPageConfig } from "@/app/(app)/(user)/dashboard/_constants/page-config";
import { SproutIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon, FolderPlusIcon } from "lucide-react";
import { getPortalListData } from "@/server/actions/portal/queries";
import PortalCard from "./_components/portal-card";
import CreatePortalButton from "./_components/create-portal-button";
import { getUniqueViews } from "@/server/tinybird/pipes/pipes";

type Section = {
    title: string | null;
    content: unknown;
    contentType: "yoopta" | "url" | "doc" | "notion" | "pdf";
};

export default async function DashboardPage() {
    const portals = await getPortalListData();

    // Handle the case where portals might be null
    if (!portals || portals.length === 0) {
        return (
            <AppPageShell
                title={dashboardPageConfig.title}
                description={dashboardPageConfig.description}
            >
                <div className="sticky bg-white p-4 pb-0 dark:bg-gray-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="space-y-0 sm:space-y-1">
                            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                                All Portals
                            </h2>
                            <p className="text-xs leading-4 text-muted-foreground sm:text-sm sm:leading-none">
                                Manage all your Portals in one place.
                            </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <CreatePortalButton />

                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded border-gray-500 bg-gray-50 hover:bg-gray-200 dark:bg-black hover:dark:bg-muted"
                            >
                                <FolderPlusIcon
                                    className="h-5 w-5 shrink-0"
                                    aria-hidden="true"
                                />
                            </Button>
                        </div>
                    </div>

                    <Separator className="mb-5 bg-gray-200 dark:bg-gray-800" />

                    <div className="flex min-h-44 w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border p-4">
                        <SproutIcon size={64} color="grey" />
                        <div className="flex w-full flex-col items-center">
                            <p>No portals yet.</p>
                            <p className="text-sm text-muted-foreground">
                                Get started by uploading a new portal.
                            </p>
                        </div>
                    </div>
                </div>
            </AppPageShell>
        );
    }

    // Fetch unique views for each portal
    const portalsWithViews = await Promise.all(
      portals.map(async (portal) => {
          // Fetch unique views data for the current portal
          const response = await getUniqueViews({ portal_id: portal.portalId });

          // Find the matching data for the current portal
          const viewData = response.data.find(
              (item) => item.portal_id === portal.portalId
          );

          return {
              ...portal,
              views: viewData ? viewData.unique_views : 0, // Use unique views or default to 0 if not found
          };
      })
  );


    return (
        <AppPageShell
            title={dashboardPageConfig.title}
            description={dashboardPageConfig.description}
        >
            <div  className=" mx-32 sticky bg-white p-4 pb-0 dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                    <div className="space-y-0 sm:space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            All Portals
                        </h2>
                        <p className="text-xs leading-4 text-muted-foreground sm:text-sm sm:leading-none">
                            Manage all your Portals in one place.
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <CreatePortalButton />

                        <Button
                            size="icon"
                            variant="outline"
                            className="rounded border-gray-500 bg-gray-50 hover:bg-gray-200 dark:bg-black hover:dark:bg-muted"
                        >
                            <FolderPlusIcon
                                className="h-5 w-5 shrink-0"
                                aria-hidden="true"
                            />
                        </Button>
                    </div>
                </div>

                <div className="mb-2 flex justify-end gap-x-2">
                    <div className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="h-10 w-full rounded border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <Button variant="outline" className="rounded-sm text-sm">
                        Sort
                    </Button>
                </div>

                <Separator className="mb-5 bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-4">
                    {portalsWithViews.map((portal) => (
                        <PortalCard
                            key={portal.portalId}
                            title={portal.title}
                            sections={portal.sections}
                            url={portal.portalId}
                            date="Nov 1" // Replace with actual date if available
                            linkCount={portal.sections.length} // Number of links
                            views={portal.views} // Use the unique views count
                        />
                    ))}
                </div>
            </div>
        </AppPageShell>
    );
}
