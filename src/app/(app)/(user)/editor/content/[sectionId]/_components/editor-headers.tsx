"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useSlidingSidebar } from "../../../[portalId]/_components/sliding-sidebar";
import { ChevronLeft, ExpandIcon, PanelRight } from "lucide-react"; // Import the icon from Lucide
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    AlertDialog,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

type Props = {
    onSave: () => void;
    portalId: string;
    contentChanged: boolean;
};

function EditorHeader({ onSave, portalId, contentChanged }: Props) {
    const [backButtonHovered, setBackButtonHovered] = useState(false);
    const [promptLeave, setPromptLeave] = useState(false);
    const router = useRouter();
    function handleBack() {
        if (contentChanged) {
            setPromptLeave(true);
        } else {
            router.push(`/editor/${portalId}`);
        }
    }
    return (
        <div className="relative">
            <AlertDialog open={promptLeave} onOpenChange={setPromptLeave}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to leave? Unsaved changes will
                            be lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button
                            onClick={() => setPromptLeave(false)}
                            variant="ghost"
                        >
                            Stay on this page
                        </Button>
                        <Button
                            onClick={() => {
                                router.push(`/editor/${portalId}`);
                            }}
                            variant="secondary"
                        >
                            Discard Changes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Fixed Top Toolbar within the Section */}

            <div className=" flex justify-between space-x-2 ">
                {/* Save/Publish Button */}
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div
                        className="flex items-center"
                        onMouseOver={() => setBackButtonHovered(true)}
                        onMouseOut={() => setBackButtonHovered(false)}
                    >
                        {backButtonHovered && <ChevronLeft size={12} />}
                        <Button
                            variant="link"
                            className="px-1"
                            onClick={handleBack}
                        >
                            Back to Portal
                        </Button>
                    </div>
                </div>

                <Button
                    onClick={onSave}
                    variant="outline"
                    className="rounded border-2 border-indigo-500 p-5 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                >
                    Save
                </Button>

                {/* Close Sidebar Button with Active/Highlighted State */}
            </div>
        </div>
    );
}

export default EditorHeader;
