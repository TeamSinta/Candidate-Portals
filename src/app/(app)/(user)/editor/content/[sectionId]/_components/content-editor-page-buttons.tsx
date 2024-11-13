"use client";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
    onSave: () => void;
    onTogglePreview: () => void;
    isPreviewing: boolean;
};
function ContentEditorPageButtons({
    onSave,
    onTogglePreview,
    isPreviewing,
}: Props) {
    return (
        <div className="flex items-center space-x-2">
            <Button variant={"secondary"} onClick={onTogglePreview}>
                {isPreviewing ? "Edit" : "Preview"}
            </Button>
            <Button onClick={onSave}>Save</Button>
        </div>
    );
}

export default ContentEditorPageButtons;
