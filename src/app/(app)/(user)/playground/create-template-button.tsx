"use client";
import { Button } from "@/components/ui/button";
import { createPortal } from "@/server/actions/template/mutations";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function CreateTemplateButton() {
    const router = useRouter();
    async function handleClick() {
        try {
            const newTemplate = await createPortal();
            if (!newTemplate?.id) throw new Error("Failed to create template");
            router.push("/editor/" + newTemplate.id);
        } catch {
            toast.error("Failed to create template");
        }
    }
    return <Button onClick={handleClick}>Create a Template</Button>;
}
