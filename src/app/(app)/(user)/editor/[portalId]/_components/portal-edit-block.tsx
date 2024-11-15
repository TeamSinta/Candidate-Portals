import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PortalSelect } from "@/server/db/schema";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function PortalEditBlock({
    portalData,
    onRenamePortal,
    editing = false,
    onCancel,
    onClick,
}: {
    portalData: PortalSelect;
    onRenamePortal: (newName: string) => void;
    editing: boolean;
    onCancel: () => void;
    onClick: () => void;
}) {
    const [title, setTitle] = useState<string>(portalData.title ?? "");

    function handleCancel() {
        console.log("CLicked cancel");
        onCancel();
    }

    function handleSave() {
        if (!title) {
            toast("Portal name is required");
            return;
        }

        onRenamePortal(title);
    }

    return (
        <div
            className={cn(
              "flex w-[50rem] z-10  flex-col rounded-sm space-y-2 border bg-white p-8 px-8  transition-shadow duration-300",
              !editing && "cursor-pointer hover:shadow-lg ",
            )}
            onClick={onClick}
        >
            {editing && (
                <>
                    <div className="text-2xl font-semibold">
                        Candidate Portal
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <label className="font-medium">
                            Candidate Portal Name
                        </label>
                        <input
                            type="text"
                            placeholder={"Candidate Portal Name"}
                            className="min-w-[30rem] rounded border-2 border-gray-200 p-2"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className="flex gap-2 self-end">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </>
            )}
            {!editing && (
                <div className="flex flex-row items-center justify-between gap-2 text-2xl font-normal">
                    <div className="flex flex-row items-center gap-2">
                        Candidate Portal:
                        <div className="font-semibold">{title}</div>
                    </div>
                    <Edit className="h-6 w-6 cursor-pointer text-slate-400" />
                </div>
            )}
        </div>
    );
}

export default PortalEditBlock;
