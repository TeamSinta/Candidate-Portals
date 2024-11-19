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
  sectionid
}: Props) {
  const { isSlidingSidebarOpen, setSlidingSidebarOpen } = useSlidingSidebar();

  return (
    <div className="relative">
      {/* Fixed Top Toolbar within the Section */}
      <div className=" flex justify-between items-center ">
      <Button
          aria-label="Close Sidebar"
          variant={'outline'}
          className="hover:bg-gray-200 border-gray-400 py-5 px-2 border-2 hover:text-black text-gray-500 rounded"
        >
          <Link href={`/editor/content/${sectionid}`}>
          <ExpandIcon size={26} /> {/* Lucide icon with a size of 24px */}
          </Link>
        </Button>
      <div className=" flex justify-end space-x-2 ">
        {/* Save/Publish Button */}
        <Button
          onClick={onSave}
          variant="outline"
          className="border-indigo-500 hover:bg-indigo-500 hover:text-white text-indigo-600 p-5 border-2 rounded"
        >
          Publish
        </Button>

        {/* Close Sidebar Button with Active/Highlighted State */}
        <button
          className={`p-2 rounded transition-colors duration-200 ${
            isSlidingSidebarOpen
              ? "bg-gray-200 text-black-600" // Highlighted state when open
              : "hover:bg-gray-200 text-gray-500 hover:text-black-600"
          }`}
          onClick={() => setSlidingSidebarOpen(false)}
          aria-label="Close Sidebar"
        >
          <PanelRight size={24} /> {/* Lucide icon with a size of 24px */}
        </button>
      </div>
      </div>
    </div>
  );
}

export default ContentEditorPageButtons;
