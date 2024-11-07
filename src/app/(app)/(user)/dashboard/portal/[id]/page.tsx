import {

    EyeIcon,
    MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Component as BarChartComponent } from "@/app/(app)/_components/bar-chart";
import { Component as SideBarChartComponent } from "@/app/(app)/_components/side-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import ClientSheet from "../../_components/ClientSheet";
import { siteUrls } from "@/config/urls";
import LinksCard from "../../_components/all-links";

interface Props {
    params: { id: string };
}

export default async function PortalView({ params }: Props) {
    const portalData = await getPortalDetails(params.id);

    console.log(portalData);
    if (!portalData) return notFound();

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between px-4">
                {/* Left Side - Sidebar Trigger and Breadcrumb */}
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

                {/* Right Side - Action Buttons */}
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
                        <TooltipContent side="top">{"Preview"}</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-6" />
                    <MoreHorizontalIcon className="h-5 w-5 cursor-pointer rounded-full bg-gray-100 p-1 dark:bg-gray-700" />

                    {/* Create Link Button with Dropdown Icon */}
                    <ClientSheet portalData={portalData} />

                </div>
            </div>

            <div className="flex flex-col space-y-6 p-6">
                {/* Back button */}

                {/* Charts Section */}
                <div className="flex gap-4">
                    {/* Left Bar Chart */}
                    <div className="h-full flex-1">
                        <BarChartComponent />
                    </div>

                    {/* Right Side Bar Chart */}
                    <div className="h-full flex-1">
                        <SideBarChartComponent />
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <Card className="rounded shadow-none">
                        <CardHeader>
                            <CardTitle>Number of Visits</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-2xl">{portalData.candidates?.length || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow-none">
                        <CardHeader>
                            <CardTitle>Number of Reactions</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-2xl">0</p> {/* Placeholder */}
                        </CardContent>
                    </Card>

                    <Card className="rounded shadow-none">
                        <CardHeader>
                            <CardTitle>Total Average View Duration</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-2xl">10 seconds</p>{" "}
                            {/* Placeholder */}
                        </CardContent>
                    </Card>
                </div>

                {/* Links Table */}
                <LinksCard portalData={portalData} />


                {/* Visitors Table */}
                <Card className="mt-6 rounded shadow-none">
                    <CardHeader>
                        <CardTitle>All Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Name</th>
                                    <th className="py-2">Visit Duration</th>
                                    <th className="py-2">Visit Completion</th>
                                    <th className="py-2">Last Viewed</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2">Anonymous</td>
                                    <td className="py-2">10 secs</td>
                                    <td className="py-2 text-center">100%</td>
                                    <td className="py-2">Nov 1</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span>Showing 1 of 1 visits</span>
                            <div className="flex space-x-2">
                                <button className="rounded bg-gray-100 px-2 py-1">
                                    Previous
                                </button>
                                <button className="rounded bg-gray-100 px-2 py-1">
                                    Next
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
