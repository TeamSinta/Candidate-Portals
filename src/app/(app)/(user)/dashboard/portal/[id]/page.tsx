import { ArrowLeftIcon, ChevronDownIcon, EyeIcon, MoreHorizontalIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Component as BarChartComponent } from "@/app/(app)/_components/bar-chart";
import { Component as SideBarChartComponent } from "@/app/(app)/_components/side-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPortalData } from "@/server/actions/portal/queries";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import CreateLinkSheetContent from "../../_components/sheet-content";
import { Tooltip, TooltipTrigger ,TooltipContent } from "@/components/ui/tooltip";
import { siteUrls } from "@/config/urls";
import { cn } from "@/lib/utils";

interface Props {
    params: { id: string };
}

export default async function PortalView({ params }: Props) {
    const portalData = await getPortalData(params.id);

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
                                    <BreadcrumbLink>
                                        Portals
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{portalData.candidateName}</BreadcrumbPage>
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
                    className={cn("z-10 transition-transform hover:scale-90")}
                >
      <EyeIcon className="h-5 w-5 cursor-pointer" />
                    </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                {"Preview"}
                                                            </TooltipContent>
                                                        </Tooltip>








                        <Separator orientation="vertical" className="h-6" />
                        <MoreHorizontalIcon className="h-5 w-5 p-1 rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer" />

                        {/* Create Link Button with Dropdown Icon */}
                        <Sheet>
        <SheetTrigger asChild>
            <Button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full">
                Create link
                <ChevronDownIcon className="h-4 w-4" />
            </Button>
        </SheetTrigger>
        <SheetContent>
            <CreateLinkSheetContent /> {/* Import the separate component for sheet content */}
        </SheetContent>
    </Sheet>

                    </div>
                </div>

            <div className="flex flex-col p-6 space-y-6">
                {/* Back button */}

                {/* Charts Section */}
                <div className="flex gap-4">
                    {/* Left Bar Chart */}
                    <div className="flex-1 h-full">
                        <BarChartComponent />
                    </div>

                    {/* Right Side Bar Chart */}
                    <div className="flex-1 h-full">
                        <SideBarChartComponent />
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <Card className="shadow-none rounded">
                        <CardHeader>
                            <CardTitle>Number of Visits</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-2xl">{portalData.views || 0}</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none rounded">
                        <CardHeader>
                            <CardTitle>Number of Reactions</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-2xl">0</p> {/* Placeholder */}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none rounded">
                        <CardHeader>
                            <CardTitle>Total Average View Duration</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-2xl">10 seconds</p> {/* Placeholder */}
                        </CardContent>
                    </Card>
                </div>

                {/* Links Table */}
                <Card className="mt-6 shadow-none rounded">
                    <CardHeader>
                        <CardTitle>All Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Name</th>
                                    <th className="py-2">Link</th>
                                    <th className="py-2">Views</th>
                                    <th className="py-2">Last Viewed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portalData.links && portalData.links.length > 0 ? (
                                    portalData.links.map((link, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-2">{link.title || "Untitled Link"}</td>
                                            <td className="py-2">
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    {link.url}
                                                </a>
                                            </td>
                                            <td className="py-2">1 views</td> {/* Placeholder for views */}
                                            <td className="py-2">Nov 1</td> {/* Placeholder for last viewed */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-2 text-center text-muted-foreground">
                                            No links available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Visitors Table */}
                <Card className="mt-6 shadow-none rounded">
                    <CardHeader>
                        <CardTitle>All Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-left border-collapse">
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
                        <div className="flex justify-between items-center mt-4 text-sm">
                            <span>Showing 1 of 1 visits</span>
                            <div className="flex space-x-2">
                                <button className="px-2 py-1 bg-gray-100 rounded">Previous</button>
                                <button className="px-2 py-1 bg-gray-100 rounded">Next</button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </div>


    );
}
