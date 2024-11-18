import {
    EyeIcon,
    MoreHorizontalIcon,
    FileIcon,
    BarChartIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { calculateTotalAverageDuration, cn } from "@/lib/utils";
import ClientSheet from "../../_components/ClientSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LinksCard from "../../_components/all-links";
import { MarqueeCardVertical } from "../../_components/demo";
import { BarChartComponent } from "@/app/(app)/_components/bar-chart";
import { TopEngagingUsersChart } from "@/app/(app)/_components/side-bar-chart";
import { MergedEngagedData, MergedSectionData } from "@/types/portal";
import { averageDurationData, topEngagedData } from "@/server/tinybird/utils";
import {
    getAverageDuration,
    getTopEngaged,
} from "@/server/tinybird/pipes/pipes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deletePortal } from "@/server/actions/portal/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PortalOptionsDropdown from "./_components/portal-options-dropdown";
interface Props {
    params: { id: string };
}

export default async function PortalView({ params }: Props) {
    const portalData = await getPortalDetails(params.id);
    const portalID = params.id;
    if (!portalData) return notFound();

    // Check if there are no links
    const hasLinks = portalData.links && portalData.links.length > 0;

    // Fetch Tinybird data and merge with portal sections

    const tinybirdData =
        (await getAverageDuration({ portal_id: portalID })) || {};
    console.log(tinybirdData, "testing");
    const engagedTinybirdData =
        (await getTopEngaged({ portal_id: portalID })) || {};

    const AverageData: MergedSectionData[] = averageDurationData(
        portalData,
        tinybirdData,
    );
    const EngagedData: MergedEngagedData[] = topEngagedData(
        portalData,
        engagedTinybirdData,
    );
    const averageDurationText = calculateTotalAverageDuration(AverageData);

    // Check if there is chart data
    const hasChartData = AverageData.length > 0 || EngagedData.length > 0;

    return (
        <div className="mb-2 w-full">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink>Portals</BreadcrumbLink>
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={`/view/${params.id}`}
                                className={cn(
                                    "z-10 transition-transform hover:scale-90",
                                )}
                            >
                                <EyeIcon className="h-5 w-5 cursor-pointer" />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="top">Preview</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-6" />
                    <PortalOptionsDropdown
                        portalId={params.id}
                        portalTitle={portalData.portal.title ?? ""}
                        redirect={true}
                    >
                        <MoreHorizontalIcon className="h-5 w-5 cursor-pointer rounded-full bg-gray-100 p-1 dark:bg-gray-700" />
                    </PortalOptionsDropdown>

                    <ClientSheet portalData={portalData} />
                </div>
            </div>

            {hasLinks ? (
                <div className="flex flex-col  space-y-6 p-6">
                    <div className="flex gap-4 ">
                        {/* Left Bar Chart */}
                        <div className="h-full flex-1">
                            {hasChartData ? (
                                <BarChartComponent data={AverageData} />
                            ) : (
                                <Card className="mt-12 flex h-80 items-center justify-center  rounded-sm p-8 shadow-none">
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
                                            Engagement details will be displayed
                                            here when available.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Card className="rounded-sm shadow-none">
                            <CardHeader>
                                <CardTitle>Number of Visits</CardTitle>
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
                                    Total Average View Duration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-2xl">
                                    {averageDurationText}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Links Table */}
                    <LinksCard portalData={portalData} />
                </div>
            ) : (
                <Card className="m-16 flex flex-1 items-center justify-center  p-56">
                    <CardContent className="flex flex-col items-center justify-center gap-2 ">
                        <MarqueeCardVertical />
                        <p className="text-lg font-medium">No links found</p>
                        <p className="text-sm text-muted-foreground">
                            Create and share personalized links to enhance and
                            track engagement.
                        </p>
                        <ClientSheet portalData={portalData} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
