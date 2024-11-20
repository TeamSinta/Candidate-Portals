"use client";

import { Button } from "@/components/ui/button";
import { EyeIcon, Upload } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import PreviewDialog from "../../dashboard/_components/preview-page";

function EditorPageButtons({ data }: { portalId: string }) {

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenChange = (open: boolean | ((prevState: boolean) => boolean)) => {
    setIsPreviewOpen(open);
  };

    return (
        <div className="flex items-center space-x-2">
            <Button className="rounded-sm border-gray-600" variant={"outline"}
            onClick={() => handleOpenChange(true)} // Open the preview dialog
            >
            Preview <EyeIcon className="ml-2 h-4 w-4" /></Button>
            {/* <Link href={`/dashboard/portal/${portalId}?createLink=true`}>
                <Button className="flex gap-1 rounded-full ">
                    <Upload className="h-4 w-4" />
                   Publish
                </Button>
            </Link> */}
                <PreviewDialog portalData={data} isPreviewOpen={isPreviewOpen} setIsPreviewOpen={setIsPreviewOpen} />

        </div>
    );
}

export default EditorPageButtons;
