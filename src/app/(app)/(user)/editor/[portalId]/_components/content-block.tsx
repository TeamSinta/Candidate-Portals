"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { SectionContentType } from "@/server/db/schema";
import { YooptaBlockData } from "@yoopta/editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UrlInput from "./url-input";

function ContentBlock({
    index,
    contentType,
    contentData,
}: {
    index: number;
    contentType: SectionContentType;
    contentData: YooptaBlockData | { url: string; title: string };
}) {
    const contentTypeOptions = [
        {
            label: "Link",
            value: "link",
            render: () => <UrlInput title="" url="" />,
        },
        { label: "Editor", value: "editor", render: () => <div>Editor</div> },
    ];
    return (
        <div className="flex w-[50rem] flex-col border-2 bg-white p-4 shadow">
            <div className="text-xl font-bold">Content Block {index}</div>
            <div className="text-sm font-light">
                What would you like your candidate to review?
            </div>
            {!contentType && (
                <div className="mt-4 flex flex-col self-center">
                    <div className="text-sm font-semibold">Content Type</div>
                    <Select onValueChange={(value) => console.log(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                            {contentTypeOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {/* <div className="my-4 flex flex-col items-end gap-4"></div> */}
            <div className="flex gap-2 self-end">
                <Button variant="outline">Delete Block</Button>
                <Button>Save Block</Button>
            </div>
        </div>
    );
}

export default ContentBlock;
