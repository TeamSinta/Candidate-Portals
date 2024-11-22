"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPortal } from "@/server/actions/portal/mutations";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreatePortalButton() {
    const [portalName, setPortalName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleCreate() {
        setLoading(true);
        try {
            const newPortal = await createPortal({ title: portalName });
            if (!newPortal?.id) throw new Error("Failed to create Portal");
            router.push("/editor/" + newPortal.id);
        } catch {
            toast.error("Failed to create Portal");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="group flex items-center gap-x-1 rounded px-3 text-left">
                    <span className="text-sm ">Create Portal</span>
                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-lg sm:max-w-[425px] ">
                <DialogHeader>
                    <DialogTitle>Name your Portal</DialogTitle>
                    <DialogDescription>
                        Your Portal holds all your content, settings, and much
                        more.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label
                        htmlFor="portalName"
                        className="mb-2 block text-slate-500"
                    >
                        Portal's name
                    </Label>
                    <Input
                        id="portalName"
                        value={portalName}
                        onChange={(e) => setPortalName(e.target.value)}
                        placeholder="Enter workspace name"
                        className="w-full rounded"
                    />
                </div>
                <div className="flex justify-start">
                    <Button
                        onClick={handleCreate}
                        disabled={loading}
                        className={loading ? "loading rounded" : "rounded"}
                    >
                        {loading ? "Creating..." : "Submit"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
