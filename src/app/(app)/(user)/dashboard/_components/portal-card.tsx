"use client";
// components/PortalCard.tsx

import React from "react";
import { FolderIcon, ExternalLinkIcon, MailIcon, DockIcon, File, BookOpenTextIcon, BarChartIcon, EllipsisVertical } from "lucide-react";
import { NotionLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

type Section = {
    title: string;
    contentType: string;
};

type PortalCardProps = {
    title: string;
    sections: Section[];
    url: string;
    date: string;
    linkCount: number;
    views: number;
};

function getIcon(contentType: string) {
    switch (contentType) {
        case "yoopta":
            return <DockIcon className="h-6 w-6 " />;
        case "url":
            return <ExternalLinkIcon className="h-6 w-6 " />;
        case "doc":
            return <BookOpenTextIcon className="h-6 w-6 " />;
        case "notion":
            return <NotionLogoIcon className="h-6 w-6 " />;
        case "pdf":
            return <MailIcon className="h-6 w-6 " />;
        default:
            return <DockIcon className="h-6 w-6 text-muted-foreground" />;
    }
}

const PortalCard: React.FC<PortalCardProps> = ({ title, sections, url, date, linkCount, views }) => {
    return (
        <Link href={`dashboard/portal/${url}`} passHref>
            <div
                className="flex items-center justify-between p-5 rounded-lg border mb-3 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ minHeight: "80px" }} // Adjusts the card height slightly
            >
                {/* Left Section with Icon and Info */}
                <div className="flex items-center space-x-4">
                    {/* Icon */}
                    {getIcon(sections[0]?.contentType || "doc")}

                    {/* Title and Meta */}
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{date} • {linkCount} Link{linkCount > 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Right Section with Views and Options */}
                <div className="flex items-center space-x-4">
                    {/* Views Count */}
                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-500 rounded px-3 py-2 text-xs">
                        <BarChartIcon/>
                        <span>{views} view{views !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Options Button */}
                    <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                      <EllipsisVertical className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default PortalCard;
