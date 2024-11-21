"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useSlidingSidebar } from "../../../[portalId]/_components/sliding-sidebar";
import { ExpandIcon, PanelRight } from "lucide-react"; // Import the icon from Lucide
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  onSave: () => void;

};

function EditorHeader({
  onSave,
}: Props) {

  return (
    <div className="relative">
      {/* Fixed Top Toolbar within the Section */}


      <div className=" flex justify-between space-x-2 ">
        {/* Save/Publish Button */}
        <SidebarTrigger/>

        <Button
          onClick={onSave}
          variant="outline"
          className="border-indigo-500 hover:bg-indigo-500 hover:text-white text-indigo-600 p-5 border-2 rounded"
        >
          Publish
        </Button>

        {/* Close Sidebar Button with Active/Highlighted State */}

      </div>

    </div>
  );
}

export default EditorHeader;
