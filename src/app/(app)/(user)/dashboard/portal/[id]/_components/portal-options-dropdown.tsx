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
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

interface Props {
    portalId: string;
    portalTitle: string;
    children?: React.ReactNode;
    redirect?: boolean;
}
function PortalOptionsDropdown({
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
                <AlertDialogContent>
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

            <DropdownMenu>
                <DropdownMenuTrigger
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                    {children ? (
                        children
                    ) : (
                        <EllipsisVertical className="h-4 w-4" />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            console.log("edit");
                        }}
                    >
                        <Link href={`/editor/${portalId}`}>Edit Portal</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={(e) => {
                            e.preventDefault();
                            setDeleteModalOpen(true);
                        }}
                        className="text-red-600"
                    >
                        Delete Portal
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default PortalOptionsDropdown;
