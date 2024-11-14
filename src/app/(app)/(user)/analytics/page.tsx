// pages/analytics.tsx

import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AnalyticsTable from "./_components/analytics-table";

export default function AnalyticsPage() {
    return (
        <AppPageShell
            title="Analytics"
            description="View and manage analytics for your content."
        >
            <div className="sticky top-0 z-50 bg-white  pb-0 dark:bg-gray-900 sm:mx-4 sm:pt-4">
                <section className="mb-4 flex items-center justify-between space-x-2 sm:space-x-0">
                    <div className="space-y-0 sm:space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            Viewer Analytics
                        </h2>
                        <p className="text-xs leading-4 text-muted-foreground sm:text-sm sm:leading-none">
                            Track viewer interactions with your content.
                        </p>
                    </div>
                </section>
                <Separator className="mt-16 bg-gray-200 dark:bg-gray-800" />
                <p className="my-6 font-semibold">Interactions</p>
                <AnalyticsTable />{" "}
                {/* Render the AnalyticsTable client component */}
            </div>
        </AppPageShell>
    );
}
