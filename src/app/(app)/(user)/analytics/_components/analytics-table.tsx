// components/AnalyticsTable.tsx
"use client";

import { useState, Fragment } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

const data = [
    {
        id: 1,
        name: "Parker",
        logo: "/path/to/logo1.png",
        action: "0:03",
        page: "DNT - Mid-deal",
        location: "Mill Valley, CA",
        timeAgo: "33 min ago",
    },
    {
        id: 2,
        name: "Stewart",
        logo: "/path/to/logo2.png",
        action: "0:04",
        page: "DNT - Post Demo summary",
        location: "Mill Valley, CA",
        timeAgo: "33 min ago",
    },
    {
        id: 3,
        name: "Elon",
        logo: "/path/to/logo3.png",
        action: "0:06",
        page: "DNT - Prospecting",
        location: "Mill Valley, CA",
        timeAgo: "33 min ago",
    },
];

export default function AnalyticsTable() {
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <Card>
            <CardContent>
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Name</th>
                            <th className="p-2">Action</th>
                            <th className="p-2">Page</th>
                            <th className="p-2">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <Fragment key={row.id}>
                                <tr
                                    className="cursor-pointer border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => toggleRow(row.id)}
                                >
                                    <td className="flex items-center gap-2 p-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={row.logo}
                                                alt={row.name}
                                            />
                                            <AvatarFallback>
                                                {row.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {row.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {row.timeAgo}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <span className="flex items-center gap-1">
                                            <span className="text-muted-foreground">
                                                📊
                                            </span>{" "}
                                            {row.action}
                                        </span>
                                    </td>
                                    <td className="p-2">{row.page}</td>
                                    <td className="flex items-center gap-1 p-2">
                                        🇺🇸 {row.location}
                                        {expandedRow === row.id ? (
                                            <ChevronUpIcon className="ml-auto h-4 w-4" />
                                        ) : (
                                            <ChevronDownIcon className="ml-auto h-4 w-4" />
                                        )}
                                    </td>
                                </tr>
                                {expandedRow === row.id && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="bg-gray-50 p-4 dark:bg-gray-800"
                                        >
                                            <div className="text-sm text-muted-foreground">
                                                {/* Example additional data, replace with real stats */}
                                                <p>
                                                    View Duration: {row.action}
                                                </p>
                                                <p>
                                                    Interaction Time:{" "}
                                                    {row.timeAgo}
                                                </p>
                                                <p>Location: {row.location}</p>
                                                <p>Page Viewed: {row.page}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
