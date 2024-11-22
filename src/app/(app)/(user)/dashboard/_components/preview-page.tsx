"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import PortalContentPreview from "./preview-content";

export default function PreviewDialog({
    portalData,
    isPreviewOpen,
    setIsPreviewOpen,
}) {
    const handleOpenChange = (open: any) => {
        setIsPreviewOpen(open);
    };

    return (
        <>
            <Dialog open={isPreviewOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="mx-auto max-h-[85%] min-h-[85%] max-w-[88rem] p-6">
                    <div className="">
                        <PortalContentPreview portalData={portalData} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
