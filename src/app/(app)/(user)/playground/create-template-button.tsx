"use client";
import { Button } from "@/components/ui/button";
import { createPortal } from "@/server/actions/portal/mutations";
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
    return <Button onClick={handleClick}>Create a Portal</Button>;
}
