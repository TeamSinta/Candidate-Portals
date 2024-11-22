"use client";

import { useState } from "react";
import { FileText, Link, PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SectionDialogProps {
    maxWidth: string;
    onAddLink: (url: string) => void;
    onCreatePage: (title: string) => void; // New callback for creating a page
}

function AddNewSectionDialog({
    maxWidth,
    onAddLink,
    onCreatePage,
}: SectionDialogProps) {
    const [isAddingLink, setIsAddingLink] = useState(false);
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("New Page"); // Default title for a new page
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSaveUrl = () => {
        if (url) {
            let formattedUrl = url.trim();

            if (
                !formattedUrl.startsWith("http://") &&
                !formattedUrl.startsWith("https://")
            )
                formattedUrl = `https://${formattedUrl}`;
            onAddLink(formattedUrl);
            setIsAddingLink(false);
            setUrl("");
            setIsDialogOpen(false);
        }
    };

    const handleCreatePage = () => {
        onCreatePage(title); // Call the parent function with the title
        setTitle("New Page"); // Reset the title
        setIsDialogOpen(false);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setIsAddingLink(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <div className="group relative h-[15rem]  min-w-[19rem] max-w-[24rem] cursor-pointer ">
                    <Card className="flex h-[15rem] max-w-[24rem] flex-col items-center justify-center overflow-hidden rounded-sm border-2  dark:border-gray-800 border-dashed border-gray-300 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-md">
                        <div className="flex h-full w-full dark:bg-gray-700 items-center justify-center rounded-t bg-gray-100">
                            <PlusIcon
                                size={32}
                                className="text-gray-400 transition-colors duration-300 group-hover:text-gray-600"
                            />
                        </div>
                        <CardContent className="justify-center text-center text-sm text-gray-500 sm:pt-8">
                            Add Page
                        </CardContent>
                    </Card>
                </div>
            </DialogTrigger>
            <DialogContent className={`rounded-lg ${maxWidth}`}>
                <DialogHeader>
                    <DialogTitle>
                        <h1 className="font-heading text-2xl font-semibold">
                            Add Section
                        </h1>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex justify-around py-6">
                    {isAddingLink ? (
                        <div className="w-full">
                            <h3 className="mb-2 text-lg font-medium text-gray-700">
                                Enter the URL
                            </h3>
                            <p className="mb-4 text-sm text-gray-500">
                                Please provide the full URL to the resource or
                                documentation you want to link to.
                            </p>
                            <div className="relative w-full">
                                <Input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full rounded border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <Link
                                    size={20}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    onClick={() => setIsAddingLink(false)}
                                    variant={"outline"}
                                    className="rounded border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveUrl}
                                    className="rounded bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
                                >
                                    Save URL
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div
                                className="flex cursor-pointer flex-col items-center"
                                onClick={() => setIsAddingLink(true)}
                            >
                                <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-16 transition-shadow duration-300 hover:shadow-lg">
                                    <Link
                                        size={24}
                                        className="mb-2 text-gray-500"
                                    />
                                    <h3 className="text-base font-semibold">
                                        Add Link
                                    </h3>
                                    <p className="mt-1 text-center text-sm text-gray-500">
                                        Attach an external link.
                                    </p>
                                </div>
                                <p className="mt-4 max-w-64 text-center text-xs text-gray-400">
                                    You can add links to external resources or
                                    documentation.
                                </p>
                            </div>

                            <div
                                className="flex cursor-pointer flex-col items-center"
                                onClick={handleCreatePage} // Handle creating a new page
                            >
                                <div className="flex flex-col items-center justify-center rounded-lg border bg-gray-50 p-16 transition-shadow duration-300 hover:shadow-lg">
                                    <FileText
                                        size={24}
                                        className="mb-2 text-gray-500"
                                    />
                                    <h3 className="text-base font-semibold">
                                        Create a Page
                                    </h3>
                                    <p className="mt-1 text-center text-sm text-gray-500">
                                        Create a Notion-like page.
                                    </p>
                                </div>
                                <p className="mt-4 max-w-64 text-center text-xs text-gray-400">
                                    Build a fully customizable page for your
                                    workspace.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddNewSectionDialog;
