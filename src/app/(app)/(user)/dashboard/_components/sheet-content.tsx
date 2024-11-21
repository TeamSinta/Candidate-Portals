"use client";

import { useState } from "react";
import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Link, Lock, Settings2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { createLinkAndCandidateMutation } from "@/server/actions/candidate/mutations";
import { useAwaitableTransition } from "@/hooks/use-awaitable-transition";
import { PortalData } from "@/types/portal";

interface CreateLinkSheetContentProps {
    portalData: PortalData;
    closeSheet: () => void; // New prop to close the sheet
}

export default function CreateLinkSheetContent({
    portalData,
    closeSheet,
}: CreateLinkSheetContentProps) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roleTitle, setRoleTitle] = useState("");
    const [linkedProfile, setLinkedProfile] = useState("");
    const [emailGate, setEmailGate] = useState(false);
    const [expiryEnabled, setExpiryEnabled] = useState(false);
    const [isPending, startAwaitableTransition] = useAwaitableTransition();

    // Mutation Hook for Creating Link and Candidate
    const { isPending: isMutatePending, mutateAsync } = useMutation({
        mutationFn: () =>
            createLinkAndCandidateMutation({
                name,
                email,
                role: roleTitle,
                linkedin: linkedProfile,
                portalId: portalData.portal.portalId,
            }),
    });

    const onSubmit = async () => {
        try {
            console.log(
                name,
                email,
                roleTitle,
                linkedProfile,
                portalData.portal.portalId,
            );

            await mutateAsync();

            // Refresh the router
            await startAwaitableTransition(() => {
                router.refresh();
            });

            // Reset form state
            setName("");
            setEmail("");
            setRoleTitle("");
            setLinkedProfile("");
            setEmailGate(false);
            setExpiryEnabled(false);

            // Show success toast
            toast.success("Link and candidate created successfully");

            // Close the sheet
            closeSheet();
        } catch (error) {
            // Show error toast
            toast.error(
                (error as { message?: string })?.message ??
                    "Organization could not be created",
            );
        }
    };

    return (
        <div className="flex h-full flex-col justify-between space-y-6 overflow-scroll">
            {/* Header */}
            <SheetHeader>
                <SheetTitle className="text-xl font-semibold text-gray-900">
                    <div className="flex items-center gap-2">
                        <Link className="h-4 w-4" /> Create Link
                    </div>
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                    Configure your link settings to ensure proper access and
                    security.
                </SheetDescription>
            </SheetHeader>

            {/* Main Form */}
            <div className="flex-grow space-y-6">
                <div>
                    <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                    >
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Recipient's name"
                        className="mt-2 w-full rounded-sm border-gray-300 focus:border-black focus:ring-black"
                    />
                </div>

                {/* Optional Fields */}
                <Accordion
                    type="single"
                    collapsible
                    defaultValue="optional-fields"
                >
                    <AccordionItem value="optional-fields">
                        <AccordionTrigger className="flex items-center justify-between text-sm font-medium text-gray-800">
                            <div className="flex items-center space-x-2">
                                <Settings2Icon className="h-5 w-5 text-gray-600" />
                                <span>Optional</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="mt-2 space-y-4">
                            <SheetDescription className="text-xs text-gray-500">
                                Add these fields to use custom variables in your
                                portals.
                            </SheetDescription>
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email (Optional)
                                </Label>
                                <Input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@domain.com"
                                    className="mt-2 w-full rounded-sm border-gray-300 focus:border-black focus:ring-black"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="roleTitle"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Role Title (Optional)
                                </Label>
                                <Input
                                    id="roleTitle"
                                    value={roleTitle}
                                    onChange={(e) =>
                                        setRoleTitle(e.target.value)
                                    }
                                    placeholder="Enter role title"
                                    className="mt-2 w-full rounded-sm border-gray-300 focus:border-black focus:ring-black"
                                />
                            </div>
                            <div>
                                <Label
                                    htmlFor="linkedProfile"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Linked Profile Link (Optional)
                                </Label>
                                <Input
                                    id="linkedProfile"
                                    value={linkedProfile}
                                    onChange={(e) =>
                                        setLinkedProfile(e.target.value)
                                    }
                                    placeholder="LinkedIn URL"
                                    className="mt-2 w-full rounded-sm border-gray-300 focus:border-black focus:ring-black"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Line Separator */}
                <div className="my-4 border-t"></div>

                {/* Manage File Access & Extra Security Settings */}
                <Accordion type="single" collapsible>
                    <AccordionItem value="manage-access">
                        <AccordionTrigger className="flex items-center justify-between text-sm font-medium text-gray-800">
                            <div className="flex items-center space-x-2">
                                <Lock className="h-5 w-5 text-gray-600" />
                                <span>Manage File Access & Security</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="mt-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    Require Email to Access
                                </span>
                                <Switch
                                    id="emailGate"
                                    checked={emailGate}
                                    onCheckedChange={setEmailGate}
                                    className="scale-90 transform"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                    Set Expiry
                                </span>
                                <Switch
                                    id="expiry"
                                    checked={expiryEnabled}
                                    onCheckedChange={setExpiryEnabled}
                                    className="scale-90 transform"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Buttons at the Bottom */}
            <div className="mt-6 flex justify-end space-x-2">
                {name ? (
                    <div className="mt-6 flex w-full justify-end">
                        <div className="group relative w-full">
                            <span
                                className="absolute inset-0 animate-rainbow rounded-md bg-[linear-gradient(90deg,theme('colors.red.300'),theme('colors.purple.300'),theme('colors.blue.300'),theme('colors.cyan.300'),theme('colors.lime.300'),theme('colors.orange.300'))] bg-[length:200%] blur-[5px] group-hover:blur-[2px]"
                                aria-hidden="true"
                            ></span>

                            <Button
                                variant="rainbow"
                                onClick={onSubmit}
                                disabled={isPending || isMutatePending}
                                className="relative w-full text-white"
                            >
                                Create Link
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 flex w-full justify-end">
                        <div className="group relative w-full">
                            <Button
                                variant="default"
                                disabled={true}
                                className="relative w-full"
                            >
                                Create Link
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
