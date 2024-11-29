"use client";
// components/PortalCard.tsx

import React from "react";
import {
    FolderIcon,
    ExternalLinkIcon,
    MailIcon,
    DockIcon,
    File,
    BookOpenTextIcon,
    BarChartIcon,
    EllipsisVertical,
    Pencil,
    Trash,
    Trash2,
    Edit,
} from "lucide-react";
import {
    NotionLogoIcon,
    Pencil1Icon,
    Pencil2Icon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { deletePortal } from "@/server/actions/portal/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Section = {
    title: string;
    contentType: string;
};

type PortalCardProps = {
    title: string;
    sections: Section[];
    url: string;
    date: string;
    linkCount: number;
    views: number;
};

function getIcon(contentType: string) {
    switch (contentType) {
        case "yoopta":
            return <DockIcon className="h-6 w-6 " />;
        case "url":
            return <ExternalLinkIcon className="h-6 w-6 " />;
        case "doc":
            return <BookOpenTextIcon className="h-6 w-6 " />;
        case "notion":
            return <NotionLogoIcon className="h-6 w-6 " />;
        case "pdf":
            return <MailIcon className="h-6 w-6 " />;
        default:
            return <DockIcon className="h-6 w-6 text-muted-foreground" />;
    }
}

const PortalCard: React.FC<PortalCardProps> = ({
    title,
    sections,
    url,
    date,
    linkCount,
    views,
}) => {
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deleteModalText, setDeleteModalText] = React.useState("");
    const router = useRouter();
    async function handleDeletePortal() {
        await deletePortal(url);
        toast.success("Portal deleted successfully");
        router.refresh();
    }
    return (
        <>
            <AlertDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {`Delete Candidate Portal "${title}"?`}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this candidate portal.
                            To confirm deletion, type the name of the candidate
                            portal.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input
                        value={deleteModalText}
                        onChange={(e) => setDeleteModalText(e.target.value)}
                        placeholder={`Type "${title}" to confirm deletion`}
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 text-white"
                            onClick={handleDeletePortal}
                            disabled={deleteModalText !== title}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Link href={`dashboard/portal/${url}`} passHref>
                <div
                    className="mb-3 flex cursor-pointer items-center justify-between rounded-lg border p-5 transition-shadow hover:bg-gray-50 hover:shadow-md dark:hover:bg-neutral-800"
                    style={{ minHeight: "80px" }} // Adjusts the card height slightly
                >
                    {/* Left Section with Icon and Info */}
                    <div className="flex items-center space-x-4">
                        {/* Icon */}
                        {getIcon(sections[0]?.contentType ?? "doc")}

                        {/* Title and Meta */}
                        <div className="flex flex-col">
                            <h3 className="text-sm font-semibold leading-tight text-foreground">
                                {title}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {date} • {linkCount} Link
                                {linkCount > 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    {/* Right Section with Views and Options */}
                    <div className="flex items-center space-x-4">
                        {/* Views Count */}
                        <div className="flex min-w-20 items-center gap-2 rounded bg-gray-100 px-2 py-2 text-xs text-gray-500">
                            <BarChartIcon />
                            <span>
                                {views} link{views !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={`/editor/${url}`}>
                                    <Edit
                                        size={20}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>Edit Portal</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger
                                onClick={(e) => {
                                    e.preventDefault();
                                    setDeleteModalOpen(true);
                                }}
                            >
                                <Trash2
                                    size={20}
                                    className="text-red-300 hover:text-red-600 focus:outline-none"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Delete Portal</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default PortalCard;
