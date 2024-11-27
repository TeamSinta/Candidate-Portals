"use client";
import React from "react";
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
import { Edit, EllipsisVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
    portalId: string;
    portalTitle: string;
    children?: React.ReactNode;
    redirect?: boolean;
}
function PortalOptions({
    portalId,
    portalTitle,
    children,
    redirect = false,
}: Props) {
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deleteModalText, setDeleteModalText] = React.useState("");
    const router = useRouter();

    async function handleDeletePortal() {
        await deletePortal(portalId);
        toast.success("Portal deleted successfully");
        if (redirect) {
            router.push("/dashboard");
        } else {
            router.refresh();
        }
    }

    return (
        <>
            <AlertDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            >
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {`Delete Candidate Portal "${portalTitle}"?`}
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
                        placeholder={`Type "${portalTitle}" to confirm deletion`}
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-500 text-white"
                            onClick={handleDeletePortal}
                            disabled={deleteModalText !== portalTitle}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="mx-2 flex flex-row gap-4">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href={`/editor/${portalId}`}>
                            <Edit
                                size={20}
                                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Edit Portal</TooltipContent>
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
                    <TooltipContent side="bottom">Delete Portal</TooltipContent>
                </Tooltip>
            </div>
        </>
    );
}

export default PortalOptions;
