import { Button } from "@/components/ui/button";
import { EyeIcon, Upload } from "lucide-react";
import Link from "next/link";
import React from "react";

function EditorPageButtons({ portalId }: { portalId: string }) {
    return (
        <div className="flex items-center space-x-2">
            <Button className="rounded-sm border-gray-600" variant={"outline"}>
            Preview <EyeIcon className="ml-2 h-4 w-4" /></Button>
            {/* <Link href={`/dashboard/portal/${portalId}?createLink=true`}>
                <Button className="flex gap-1 rounded-full ">
                    <Upload className="h-4 w-4" />
                   Publish
                </Button>
            </Link> */}
        </div>
    );
}

export default EditorPageButtons;
