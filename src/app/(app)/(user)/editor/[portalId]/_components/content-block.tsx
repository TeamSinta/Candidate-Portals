"use client";
import React, { useState } from "react";
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
import { set } from "date-fns";

function ContentBlock({
    index,
    initialContentType,
    contentData,
    onSaveBlock,
    onDeleteBlock,
}: {
    index: number;
    initialContentType?: SectionContentType;
    contentData: YooptaBlockData | { url: string; title: string };
    onSaveBlock: (index: number) => void;
    onDeleteBlock: (index: number) => void;
}) {
    const [contentType, setContentType] = useState<
        SectionContentType | undefined
    >(initialContentType);
    const contentTypeOptions: {
        label: string;
        value: SectionContentType;
        render: React.ReactNode;
    }[] = [
        {
            label: "Link",
            value: SectionContentType.URL,
            render: <UrlInput title="" url="" />,
        },
        {
            label: "Editor",
            value: SectionContentType.YOOPTA,
            render: <div>Editor</div>,
        },
    ];
    return (
        <div className="flex w-[50rem] flex-col rounded-lg border-2 bg-white p-4 shadow">
            <div className="text-xl font-bold">Content Block {index}</div>
            <div className="text-sm font-light">
                What would you like your candidate to review?
            </div>
            {!contentType && (
                <div className="mt-4 flex flex-col self-center">
                    <div className="text-sm font-semibold">Content Type</div>
                    <Select
                        value={contentType}
                        onValueChange={(value) =>
                            setContentType(value as SectionContentType)
                        }
                    >
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
            {contentType &&
                contentTypeOptions.find(
                    (option) => option.value === contentType,
                )?.render}

            <div className="flex gap-2 self-end">
                <Button variant="outline" onClick={() => onDeleteBlock(index)}>
                    Delete Block
                </Button>
                <Button onClick={() => onSaveBlock(index)}>Save Block</Button>
            </div>
        </div>
    );
}

export default ContentBlock;
