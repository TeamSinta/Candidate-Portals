import {
    EyeIcon,
    MoreHorizontalIcon,
    FileIcon,
    BarChartIcon,
} from "lucide-react";

import { getPortalDetails } from "@/server/actions/portal/queries";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { calculateTotalAverageDuration, cn } from "@/lib/utils";
import ClientSheet from "../../_components/ClientSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LinksCard from "../../_components/all-links";
import { MarqueeCardVertical } from "../../_components/demo";
import { BarChartComponent } from "@/app/(app)/_components/bar-chart";
import { TopEngagingUsersChart } from "@/app/(app)/_components/side-bar-chart";
import { MergedEngagedData, MergedSectionData } from "@/types/portal";
import {
    averageDurationData,
    topEngagedData,
    averageCandidateDuration,
} from "@/server/tinybird/utils";
import {
    getAverageDuration,
    getTopEngaged,
} from "@/server/tinybird/pipes/pipes";
import ClientModal from "../../_components/success-modal";
import PreviewButton from "../../_components/preview-button";

import PortalOptions from "./_components/portal-options";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
interface Props {
    params: { id: string };
}

export default async function PortalView({ params }: Props) {
    try {
        // Fetch portal data
        const portalData = await getPortalDetails(params.id);

        const portalID = params.id;
        // Check if there are no links
        const hasLinks = portalData.links && portalData.links.length > 0;
        // Safeguard: Prevent Tinybird queries if portal data is invalid
        let tinybirdData = {};
        let engagedTinybirdData = {};

        if (hasLinks) {
            tinybirdData =
                (await getAverageDuration({ portal_id: portalID })) || {};
            engagedTinybirdData =
                (await getTopEngaged({ portal_id: portalID })) || {};
        }

        const AverageData: MergedSectionData[] = averageDurationData(
            portalData,
            tinybirdData,
        );
        const EngagedData: MergedEngagedData[] = topEngagedData(
            portalData,
            engagedTinybirdData,
        );
        const averageDurationText = calculateTotalAverageDuration(AverageData);
        const averageCandidateDurationText =
            averageCandidateDuration(EngagedData);
        // Check if there is chart data
        const hasChartData = AverageData.length > 0 || EngagedData.length > 0;

        return (
            <div className="mb-2 w-full">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/dashboard">
                                        Portals
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {portalData.portal.title}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2">
                        <PreviewButton portalData={portalData} />
                        <Separator orientation="vertical" className="h-6" />
                        <PortalOptions
                            portalId={params.id}
                            portalTitle={portalData.portal.title ?? ""}
                            redirect={true}
                        >
                            <MoreHorizontalIcon className="h-5 w-5 cursor-pointer rounded-full bg-gray-100 p-1 dark:bg-gray-700" />
                        </PortalOptions>
                        <ClientSheet portalData={portalData} />
                        <ClientModal portalData={portalData} />
                    </div>
                </div>

                {hasLinks ? (
                    <div className="flex flex-col  space-y-6 p-6">
                        <div className="flex gap-4">
                            {/* Left Bar Chart */}
                            <div className="h-full flex-1">
                                {hasChartData ? (
                                    <BarChartComponent data={AverageData} />
                                ) : (
                                    <Card className="mt-12 flex h-80 items-center justify-center rounded-sm p-8 shadow-none">
                                        <CardContent className="flex flex-col items-center justify-center space-y-2">
                                            <BarChartIcon className="h-10 w-10 text-muted-foreground" />
                                            <p className="text-lg font-medium">
                                                No bar chart data available
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Engagement metrics will be shown
                                                here when available.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Right Side - Top Engaging Users Chart */}
                            <div className="h-full flex-1">
                                {hasChartData ? (
                                    <TopEngagingUsersChart data={EngagedData} />
                                ) : (
                                    <Card className="mt-12 flex h-80 items-center justify-center rounded-sm p-8 shadow-none">
                                        <CardContent className="flex flex-col items-center justify-center space-y-2">
                                            <BarChartIcon className="h-10 w-10 text-muted-foreground" />
                                            <p className="text-lg font-medium">
                                                No engagement data available
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Engagement details will be
                                                displayed here when available.
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Statistics Section */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                            <Card className="rounded-sm shadow-none">
                                <CardHeader>
                                    <CardTitle>Total Portals Created</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-2xl">
                                        {portalData.candidates?.length || 0}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="rounded-sm shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        Average Time Spent per Page
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-2xl">
                                        {averageDurationText}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="rounded-sm shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        Average Time Spent per Portal
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-2xl">
                                        {averageCandidateDurationText}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Links Table */}
                        <LinksCard portalData={portalData} />
                    </div>
                ) : (
                    <Card className="m-24 flex flex-1 items-center justify-center  p-56">
                        <CardContent className="flex flex-col items-center justify-center gap-2">
                            <MarqueeCardVertical />
                            <p className="text-lg font-medium">
                                No links found
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Create and share personalized links to enhance
                                and track engagement.
                            </p>
                            <ClientSheet portalData={portalData} />
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    } catch (error) {
        console.error(error);
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
                <p className="flex flex-col items-center gap-2 text-center text-lg font-medium text-red-600">
                    <ExclamationTriangleIcon className="h-8 w-8" />
                    Invalid ID. Please check your URL.
                </p>
                <p className="text-sm text-muted-foreground">
                    Something went wrong while loading the portal. Please
                    contact support if the issue persists.
                </p>
            </div>
        );
    }
}
