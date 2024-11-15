"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CreateLinkSheetContent from "./sheet-content"; // Adjust import if necessary
import { PortalData } from "@/types/portal";

interface ClientModalProps {
    portalData: PortalData;
}

export default function ClientModal({ portalData }: ClientModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter(); // Initialize useRouter for navigation

    // Logic to handle query parameters for "createLink"
    useEffect(() => {
        const shouldOpen = searchParams.get("createLink") === "true";
        setIsModalOpen(shouldOpen);
    }, [searchParams]);

    const handleOpenChange = (open: boolean) => {
        // Update the modal state only if it has actually changed
        if (isModalOpen !== open) {
            setIsModalOpen(open);

            // Update the query parameters
            const params = new URLSearchParams(searchParams.toString());
            if (open) {
                params.set("createLink", "true");
            } else {
                params.delete("createLink");
            }
            router.replace(`?${params.toString()}`);
        }
    };

    return (
        <Dialog  open={isModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    {/* <DialogTitle>Create Link</DialogTitle> */}
                    <DialogDescription>
                        {/* Customize your link and set up how it should behave. */}
                    </DialogDescription>
                </DialogHeader>
                <CreateLinkSheetContent
                    portalData={portalData}
                    closeSheet={() => handleOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
