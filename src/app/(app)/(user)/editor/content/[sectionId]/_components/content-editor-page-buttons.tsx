"use client";
import { Button } from "@/components/ui/button";
import React from "react";

function ContentEditorPageButtons() {
    return (
        <div className="flex items-center space-x-2">
            <Button variant={"secondary"}>Preview</Button>
            <Button>Save</Button>
        </div>
    );
}

export default ContentEditorPageButtons;
