"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChevronRight,
    ChevronDown,
    PlusCircleIcon,
    MinusCircleIcon,
} from "lucide-react";
import Image from "next/image";
import VisitorsAccordion from "./link-details-table";
import CircleProgressLoader from "@/app/(app)/_components/circle-progress-loader";
import { siteUrls } from "@/config/urls";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { toast } from "sonner"; // Import the toast function
import { calculateViewCounts } from "@/server/tinybird/utils";
import { PortalData } from "@/types/portal";
import { getSectionDuration } from "@/server/tinybird/pipes/pipes";

interface LinksCardProps {
    portalData: PortalData;
}

export default function LinksCard({ portalData }: LinksCardProps) {
    const [expandedLinks, setExpandedLinks] = useState<string[]>([]);
    const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});
    const [progressMap, setProgressMap] = useState<{ [key: string]: number }>(
        {},
    );
    const [sectionDataMap, setSectionDataMap] = useState<{
        [key: string]: any[];
    }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { counts, progressData } = await calculateViewCounts(
                    portalData,
                    getSectionDuration,
                );
                setViewCounts(counts);
                setProgressMap(progressData);

                // Fetch section data for each link
                const sectionDataMap: { [key: string]: any[] } = {};
                for (const link of portalData.links) {
                    const data = await getSectionDuration({
                        link_id: link.linkId,
                    });
                    sectionDataMap[link.linkId] = data.data.filter(
                        (item) => item.link_id === link.linkId,
                    );
                }
                setSectionDataMap(sectionDataMap);
            } catch (error) {
                console.error("Error fetching data for links:", error);
            }
        };

        fetchData();
    }, [portalData.links]);

    const toggleLink = (url: string) => {
        setExpandedLinks((prev) =>
            prev.includes(url)
                ? prev.filter((link) => link !== url)
                : [...prev, url],
        );
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success("Link copied to clipboard!");
            })
            .catch((error) => {
                console.error("Failed to copy text: ", error);
                toast.error("Failed to copy link.");
            });
    };

    return (
        <Card className="mt-6 rounded-sm shadow-none">
            <CardHeader>
                <CardTitle>All Links</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-2">Name</TableHead>
                            <TableHead className="py-2">Link</TableHead>
                            <TableHead className="py-2 text-center">
                                Views
                            </TableHead>
                            <TableHead className="py-2 text-start">
                                Progress
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {portalData.links.map((link) => {
                            const candidate = portalData.candidates.find(
                                (c) => c.candidateId === link.candidateId,
                            );
                            const displayName =
                                candidate?.name ||
                                candidate?.email ||
                                "Untitled";
                            const isExpanded = expandedLinks.includes(link.url);
                            const viewCount = viewCounts[link.linkId] || 0;
                            const progress = progressMap[link.linkId] || 0;

                            // Get section data for this link
                            const sectionData =
                                sectionDataMap[link.linkId] || [];
                            return (
                                <React.Fragment key={link.url}>
                                    <TableRow
                                        className="cursor-pointer items-center justify-center border-none"
                                        onClick={() => toggleLink(link.url)}
                                    >
                                        <TableCell className="flex items-center gap-2 py-6 font-medium">
                                            <Image
                                                className="rounded-sm"
                                                width={26}
                                                height={30}
                                                alt="user pic"
                                                src={`https://avatar.vercel.sh/${displayName}`}
                                            />
                                            {displayName}
                                        </TableCell>
                                        <TableCell className="items-start py-2">
                                            <div
                                                className="group relative cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopyToClipboard(
                                                        siteUrls.prod +
                                                            siteUrls.view +
                                                            link.url,
                                                    );
                                                }}
                                            >
                                                <div className="w-[400px] truncate text-ellipsis rounded dark:bg-black dark:border dark:border-gray-700   bg-blue-50 p-2 text-center	 transition hover:border-blue-400 group-hover:border group-hover:bg-white">
                                                    <span className="max-w-[380px] text-ellipsis  dark:text-white  px-3 text-sm text-black group-hover:hidden">
                                                        {siteUrls.prod +
                                                            siteUrls.view +
                                                            link.url}
                                                    </span>
                                                    <span className="hidden text-blue-600 group-hover:inline">
                                                        Copy to Clipboard
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="items-center justify-center py-2 text-center">
                                            {viewCount > 0 ? (
                                                <AnimatedGradientText>
                                                    <p className="transition-transform duration-300 ease-in-out group-hover:translate-x-0.5">
                                                        🎉
                                                    </p>{" "}
                                                    <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
                                                    <span
                                                        className={cn(
                                                            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
                                                        )}
                                                    >
                                                        {viewCount} Views
                                                    </span>
                                                </AnimatedGradientText>
                                            ) : (
                                                <span className="text-center text-sm text-gray-500">
                                                    0 Views
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="flex items-center justify-around py-2">
                                            <CircleProgressLoader
                                                progress={progress}
                                            />
                                            {isExpanded ? (
                                                <MinusCircleIcon className="h-5 w-5 text-gray-600" />
                                            ) : (
                                                <PlusCircleIcon className="h-5 w-5 text-gray-600" />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <VisitorsAccordion
                                            sectionData={sectionData}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
