import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import React from "react";

function EditorPageButtons({ portalId }: { portalId: string }) {
    return (
        <div className="flex items-center space-x-2">
            <Button variant={"secondary"}>Preview</Button>
            <Button className="flex gap-1 ">
                <Upload className="h-4 w-4" />
                Send to Candidate
            </Button>
        </div>
    );
}

export default EditorPageButtons;
