"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useSlidingSidebar } from "../../../[portalId]/_components/sliding-sidebar";
import { ExpandIcon, PanelRight } from "lucide-react"; // Import the icon from Lucide
import Link from "next/link";

type Props = {
    onSave: () => void;
    onTogglePreview: () => void;
    isPreviewing: boolean;
    sectionid: number;
};

function ContentEditorPageButtons({
    onSave,
    onTogglePreview,
    isPreviewing,
    sectionid,
}: Props) {
    const { isSlidingSidebarOpen, setSlidingSidebarOpen } = useSlidingSidebar();

    return (
        <div className="relative">
            {/* Fixed Top Toolbar within the Section */}
            <div className=" flex items-center justify-between ">
                <Button
                    aria-label="Close Sidebar"
                    variant={"outline"}
                    onClick={onSave}
                    className="rounded border-2 border-gray-400 px-2 py-5 text-gray-500 hover:bg-gray-200 hover:text-black"
                >
                    <Link href={`/editor/content/${sectionid}`}>
                        <ExpandIcon size={26} />{" "}
                        {/* Lucide icon with a size of 24px */}
                    </Link>
                </Button>
                <div className=" flex justify-end space-x-2 ">
                    {/* Save/Publish Button */}
                    <Button
                        onClick={onSave}
                        variant="outline"
                        className="rounded border-2 border-indigo-500 p-5 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                    >
                        Save
                    </Button>

                    {/* Close Sidebar Button with Active/Highlighted State */}
                    <button
                        className={`rounded p-2 transition-colors duration-200 ${
                            isSlidingSidebarOpen
                                ? "text-black-600 bg-gray-200" // Highlighted state when open
                                : "hover:text-black-600 text-gray-500 hover:bg-gray-200"
                        }`}
                        onClick={() => setSlidingSidebarOpen(false)}
                        aria-label="Close Sidebar"
                    >
                        <PanelRight size={24} />{" "}
                        {/* Lucide icon with a size of 24px */}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContentEditorPageButtons;
