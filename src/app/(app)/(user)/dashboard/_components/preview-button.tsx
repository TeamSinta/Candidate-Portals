"use client";

import { Button } from "@/components/ui/button";
import { EyeIcon, Upload } from "lucide-react";
import React, { useState } from "react";
import PreviewDialog from "../../dashboard/_components/preview-page";

function PreviewButton({ portalData }: { portalData: string }) {

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenChange = (open: boolean | ((prevState: boolean) => boolean)) => {
    setIsPreviewOpen(open);
  };

    return (
        <div className="flex items-center space-x-2">
            <button
            onClick={() => handleOpenChange(true)} // Open the preview dialog
            >
             <EyeIcon className="ml-2 h-4 w-4" /></button>

                <PreviewDialog portalData={portalData} isPreviewOpen={isPreviewOpen} setIsPreviewOpen={setIsPreviewOpen} />

        </div>
    );
}

export default PreviewButton;
