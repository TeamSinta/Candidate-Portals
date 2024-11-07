"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { PortalData } from "@/types/portal";
import CreateLinkSheetContent from "./sheet-content";

interface ClientSheetProps {
    portalData: PortalData;
}

export default function ClientSheet({ portalData }: ClientSheetProps) {
    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white">
                    Create link
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <CreateLinkSheetContent portalData={portalData} closeSheet={closeSheet} />
            </SheetContent>
        </Sheet>
    );
}
