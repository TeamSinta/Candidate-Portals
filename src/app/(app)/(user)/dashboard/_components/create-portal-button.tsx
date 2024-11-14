"use client";

import { Button } from "@/components/ui/button";
import { createPortal } from "@/server/actions/portal/mutations";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function CreatePortalButton() {
    const router = useRouter();
    async function handleClick() {
        try {
            const newPortal = await createPortal();
            if (!newPortal?.id) throw new Error("Failed to create Portal");
            router.push("/editor/" + newPortal.id);
        } catch {
            toast.error("Failed to create Portal");
        }
    }
    return (
        <Button
            className="group flex flex-1 items-center justify-start gap-x-1 whitespace-nowrap rounded px-1 text-left sm:gap-x-3 sm:px-3"
            onClick={handleClick}
        >
            <PlusIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-base">Add New Portal</span>
        </Button>
    );
}
