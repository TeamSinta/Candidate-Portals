"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { PortalData } from "@/types/portal";
import CreateLinkSheetContent from "./sheet-content";
import { useRouter, useSearchParams } from "next/navigation";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

interface ClientSheetProps {
    portalData: PortalData;
}

export default function ClientSheet({ portalData }: ClientSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        setIsOpen(searchParams.get("createLink") === "true");
    }, []);

    const toggleSheet = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (isOpen) {
            params.delete("createLink");
        } else {
            params.set("createLink", "true");
        }
        // Update the URL with new parameters
        router.push(`?${params.toString()}`);
        setIsOpen(!isOpen);
    };
    return (
        <Sheet open={isOpen} onOpenChange={toggleSheet}>
            <SheetTrigger asChild>
                <Button
                    className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white"
                    onClick={toggleSheet}
                >
                    Create link
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                {portalData.links.length === 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 1, // Ensure it appears above content
                            pointerEvents: "none",
                        }}
                    >
                        <Fireworks
                            onInit={(confetti) => {
                                confetti.conductor.shoot();
                            }}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                pointerEvents: "none", // Prevent interactions with canvas
                            }}
                        />
                    </div>
                )}

                <CreateLinkSheetContent
                    portalData={portalData}
                    closeSheet={toggleSheet}
                />
            </SheetContent>
        </Sheet>
    );
}
