"use client";

import React, { useState } from "react";
import { Eye, PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { NotionLogoIcon } from "@radix-ui/react-icons";

type VisitorsAccordionProps = {
    sectionData: Array<{
        section_id: string;
        section_title: string;
        total_duration: number;
        last_view_timestamp: string;
        session_id: string;
    }>;
};

const VisitorsAccordion: React.FC<VisitorsAccordionProps> = ({
    sectionData,
}) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    // Group the section data by section_id
    const groupedSections = sectionData.reduce(
        (acc, item) => {
            if (!acc[item.section_id]) {
                acc[item.section_id] = {
                    section_title: item.section_title,
                    sessions: [],
                };
            }
            acc[item.section_id].sessions.push(item);
            return acc;
        },
        {} as Record<
            string,
            { section_title: string; sessions: typeof sectionData }
        >,
    );

    const toggleSection = (sectionId: string) => {
        setExpandedSections((prev) =>
            prev.includes(sectionId)
                ? prev.filter((id) => id !== sectionId)
                : [...prev, sectionId],
        );
    };

    const formatDuration = (milliseconds: number) => {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.round((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <>
            {Object.entries(groupedSections).map(
                ([sectionId, section], index) => {
                    const isSectionExpanded =
                        expandedSections.includes(sectionId);
                    const isLastSection =
                        index === Object.entries(groupedSections).length - 1;
                    const isFirstSection = index === 0;
                    const duration = section.sessions.reduce(
                        (total, item) => (total += item.total_duration),
                        0,
                    );
                    return (
                        <React.Fragment key={sectionId}>
                            {/* Main Section Row */}
                            <TableRow
                                className="cursor-pointer border-none"
                                onClick={() => toggleSection(sectionId)}
                            >
                                {/* Timeline and Icon */}
                                <TableCell className="rounded text-end">
                                    <div className="relative mx-5 flex items-start space-x-5">
                                        {/* Eye Icon and Timeline Line */}
                                        <div className="flex flex-col items-center">
                                            {!isFirstSection && (
                                                <Separator
                                                    orientation="vertical"
                                                    className="h-5 text-gray-500"
                                                />
                                            )}
                                            {isFirstSection && (
                                                <div className="h-5 text-gray-500"></div>
                                            )}

                                            <Eye className="mb-1 h-5 w-5 text-gray-500" />
                                            {!isLastSection && (
                                                <Separator
                                                    orientation="vertical"
                                                    className="h-5 text-gray-500"
                                                />
                                            )}
                                        </div>

                                        {/* Timeline Content */}
                                        <div className="flex-1 py-3">
                                            <div className="flex flex-col text-start">
                                                <div className="flex items-center gap-2">
                                                    Viewed{" "}
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded px-2 text-sm font-medium"
                                                    >
                                                        <NotionLogoIcon
                                                            className="mr-3"
                                                            fontSize={16}
                                                        />
                                                        <div className="max-w-sm truncate">
                                                            {
                                                                section.section_title
                                                            }
                                                        </div>
                                                    </Badge>
                                                </div>

                                                <span className="text-sm text-gray-500">
                                                    For{" "}
                                                    {formatDuration(duration)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Empty Table Cells for Alignment */}
                                <TableCell className="rounded py-5 text-start"></TableCell>
                                <TableCell className="rounded py-5 text-start"></TableCell>

                                {/* Chevron Icon */}
                                <TableCell className="rounded py-5 text-end">
                                    {isSectionExpanded ? (
                                        <MinusCircleIcon className="h-4 w-4 text-gray-600" />
                                    ) : (
                                        <PlusCircleIcon className="h-4 w-4 text-gray-600" />
                                    )}
                                </TableCell>
                            </TableRow>

                            {/* Expanded Session Data */}
                            {isSectionExpanded && (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="rounded bg-gray-50 p-6"
                                    >
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableCell className="text-sm font-semibold">
                                                        View Duration
                                                    </TableCell>
                                                    <TableCell className="text-sm font-semibold">
                                                        Last Viewed
                                                    </TableCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {section.sessions.map(
                                                    (session) => (
                                                        <TableRow
                                                            key={
                                                                session.session_id
                                                            }
                                                        >
                                                            <TableCell className="text-sm text-gray-700">
                                                                {formatDuration(
                                                                    session.total_duration,
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-700">
                                                                {new Date(
                                                                    session.last_view_timestamp,
                                                                ).toLocaleString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    );
                },
            )}
        </>
    );
};

export default VisitorsAccordion;
