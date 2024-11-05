// components/CreateLinkSheetContent.tsx
"use client";
import { useState } from "react";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreateLinkSheetContent() {
    const [linkName, setLinkName] = useState("");
    const [emailGate, setEmailGate] = useState(false);
    const [expiryEnabled, setExpiryEnabled] = useState(false);

    const handleCreateLink = () => {
        // Logic to generate and save the link
        console.log({
            linkName,
            emailGate,
            expiryEnabled
        });
        // Close sheet or show a success message after creation
    };

    return (
        <div className="p-4 space-y-4">
            <SheetHeader>
                <SheetTitle>Create a New Link</SheetTitle>
                <SheetDescription>Customize your link settings before generating it.</SheetDescription>
            </SheetHeader>

            {/* Link Name Input */}
            <div>
                <Label htmlFor="linkName">Link Name</Label>
                <Input
                    id="linkName"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder="Enter a name for your link"
                    className="mt-1"
                />
            </div>

            {/* Email Gate Switch */}
            <div className="flex items-center justify-between">
                <Label htmlFor="emailGate">Require Email to Access</Label>
                <Switch
                    id="emailGate"
                    checked={emailGate}
                    onCheckedChange={setEmailGate}
                />
            </div>

            {/* Expiry Switch */}
            <div className="flex items-center justify-between">
                <Label htmlFor="expiry">Set Expiry</Label>
                <Switch
                    id="expiry"
                    checked={expiryEnabled}
                    onCheckedChange={setExpiryEnabled}
                />
            </div>

            {/* Create Link Button */}
            <div className="flex justify-end">
                <Button onClick={handleCreateLink} className="bg-black text-white">
                    Generate Link
                </Button>
            </div>
        </div>
    );
}
