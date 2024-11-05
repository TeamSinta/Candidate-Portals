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
import { Edit } from "lucide-react";

function ContentBlock({
    index,
    initialContentType,
    initialContentData,
    onSaveBlock,
    onDeleteBlock,
    editing,
    editBlock,
}: {
    index: number;
    initialContentType?: SectionContentType;
    initialContentData: YooptaBlockData | { url: string; title: string };
    onSaveBlock: (data: any) => void;
    onDeleteBlock: () => void;
    editing: boolean;
    editBlock: () => void;
}) {
    const [contentType, setContentType] = useState<
        SectionContentType | undefined
    >(initialContentType);
    const [contentData, setContentData] = useState<any>(initialContentData);

    function handleContentDataChange(key: string, value: any) {
        setContentData((prevData: any) => ({
            ...prevData,
            [key]: value,
        }));
    }

    return (
        <div className="flex w-[50rem] flex-col rounded-lg border-2 bg-white p-4 shadow">
            <div className="flex flex-row items-center justify-between text-xl font-bold">
                {editing && (
                    <div>
                        Content Block {index} Editing: {editing.toString()}
                    </div>
                )}
                {!editing && (
                    <>
                        <div>
                            {contentData?.title?.length > 0
                                ? contentData.title
                                : `Section ${index}`}
                        </div>
                        <Edit
                            className="h-6 w-6 cursor-pointer text-slate-400"
                            onClick={editBlock}
                        />
                    </>
                )}
            </div>
            {editing && (
                <>
                    <div className="text-sm font-light">
                        What would you like your candidate to review?
                    </div>
                    {!contentType && (
                        <div className="mt-4 flex flex-col self-center">
                            <div className="text-sm font-semibold">
                                Content Type
                            </div>
                            <Select
                                value={contentType}
                                onValueChange={(value: SectionContentType) =>
                                    setContentType(value)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Not Selected" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={SectionContentType.URL}>
                                        Link
                                    </SelectItem>
                                    <SelectItem
                                        value={SectionContentType.YOOPTA}
                                    >
                                        Editor
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Conditional render based on contentType */}
                    {contentType === SectionContentType.URL && (
                        <UrlInput
                            title={contentData?.title || ""}
                            url={contentData?.url || ""}
                            onChange={handleContentDataChange}
                        />
                    )}
                    {contentType === SectionContentType.YOOPTA && (
                        <div>Editor Component Placeholder</div>
                    )}

                    <div className="flex gap-2 self-end">
                        <Button variant="outline" onClick={onDeleteBlock}>
                            Delete Block
                        </Button>
                        <Button
                            disabled={!contentType}
                            onClick={() =>
                                onSaveBlock({
                                    contentType,
                                    contentData,
                                    title: contentData.title ?? "title",
                                })
                            }
                        >
                            Save Block
                        </Button>
                    </div>
                </>
            )}
            {!editing && (
                <div>
                    <div>Content Type: {contentType}</div>
                </div>
            )}
        </div>
    );
}

export default ContentBlock;
