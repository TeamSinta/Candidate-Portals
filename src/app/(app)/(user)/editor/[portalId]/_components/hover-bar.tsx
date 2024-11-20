"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  EyeIcon,
  FileText,
  HomeIcon,
  Link2Icon,
  LinkIcon,
  MailIcon,
  PencilIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dock, DockIcon } from "@/components/ui/dock";
import ShinyButton from "@/components/ui/shiny-button";
import PreviewDialog from "../../../dashboard/_components/preview-page";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useSlidingSidebar } from "./sliding-sidebar"; // Import your custom hook
import { generateGUID } from "@/lib/utils";
import { saveSection } from "@/server/actions/portal/mutations";
import { SectionContentType } from "@/server/db/schema";
import { useRouter } from "next/navigation";

export function HoverBar({ portalData }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State for the popover
  const [url, setUrl] = useState(""); // State for URL input
  const router = useRouter();

  const {
    setSlidingSidebarOpen,
    setSectionId,
    setContentType,
  } = useSlidingSidebar();

  console.log(portalData, "this is it")
  // Handle preview dialog
  const handleOpenChange = (open) => {
    setIsPreviewOpen(open);
  };

  // Function to handle creating a new page
  const handleCreatePage = () => {
    const newId = generateGUID();
    const newBlock = {
      id: newId,
      portalId: portalData.portal.id,
      title: "New Page",
      content: {},
      contentType: SectionContentType.YOOPTA,
      index: portalData.sections.length,
    };

    saveSection(newBlock)
      .then(() => {
        setSectionId(newId);
        setContentType(SectionContentType.YOOPTA);
        setSlidingSidebarOpen(true);
        router.refresh(); // Refresh the data to make the new page appear

      })
      .catch((error) => console.error("Error creating new page:", error));
  };

  // Function to handle adding a new link
  const handleAddLink = () => {
    const newId = generateGUID();
    const newBlock = {
      id: newId,
      portalId: portalData.portal.id,
      title: "New Link",
      content: { url },
      contentType: SectionContentType.URL,
      index: portalData.sections.length,
    };

    saveSection(newBlock)
      .then(() => {
        setIsPopoverOpen(false);
        setUrl("");
        router.refresh(); // Refresh the data to make the new page appear

      })
      .catch((error) => console.error("Error creating new link:", error));
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 flex z-50 items-center justify-center gap-4 p-4 rounded-t-2xl">
      <TooltipProvider>
        <Dock direction="middle" className="w-1000px shadow-md">
          <DockIcon size={48} className="w-480 mx-14">
            <Tooltip>
              <TooltipTrigger asChild className="w-96">
              <Link href={`/dashboard/portal/${portalData.portal.id}?createLink=true`}>
                <ShinyButton className="bg-indigo-500 text-white text-sm rounded-sm hover:bg-indigo-600">
                  Share my Portal
                </ShinyButton>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Publish</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
{/*
                <Button disabled={true} className="bg-indigo-500 text-white text-sm rounded-sm hover:bg-indigo-600 ">
                   Share my portal
                </Button> */}
          <Separator orientation="vertical" className="h-1/2" />

          {/* Create Page Button */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="transition-transform hover:scale-90"
                  onClick={handleCreatePage}
                >
                  <FileText className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Page</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>


          {/* Add New Link Popover */}
          <DockIcon>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button className="transition-transform hover:scale-90">
                      <LinkIcon className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Link</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-80">
                <div className="flex flex-col gap-4">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button
                    onClick={handleAddLink}
                    className="bg-indigo-500 text-white hover:bg-indigo-600"
                  >
                    Add Link
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </DockIcon>

          <Separator orientation="vertical" className="h-1/2 py-2" />

          {/* Preview Button */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="transition-transform hover:scale-90"
                  onClick={() => handleOpenChange(true)}
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>

      {/* Preview Dialog */}
      <PreviewDialog
        portalData={portalData}
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
      />
    </div>
  );
}
