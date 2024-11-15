"use client";

import { useState } from "react";
import { EyeIcon } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PortalContentPreview from "./preview-content";

export default function PreviewDialog({ portalData }) {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handleOpenChange = (open) => {
        setIsPreviewOpen(open);
    };

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="z-10 transition-transform hover:scale-90"
                        onClick={() => handleOpenChange(true)}
                    >
                        <EyeIcon className="h-5 w-5 cursor-pointer" />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top">Preview</TooltipContent>
            </Tooltip>

            <Dialog  open={isPreviewOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="max-w-[88rem] min-h-[85%] max-h-[85%]  mx-auto p-6">
                    {/* Centered content with a max width */}
                    <div className="">
                        <PortalContentPreview portalData={portalData} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
