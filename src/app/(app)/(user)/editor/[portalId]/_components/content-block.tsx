import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionContentType } from "@/server/db/schema";
import { YooptaContentValue } from "@yoopta/editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UrlInput from "./url-input";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import Editor from "@/components/editor";
import {
    ContentDataType,
    isUrlContentData,
    isYooptaContentData,
    UrlContentData,
} from "../utils/types";

export interface SaveBlockArgs {
    content: ContentDataType;
    id: string;
    contentType: SectionContentType;
    title: string;
}

interface ContentBlockProps {
    index: number;
    id: string;
    initialContentType?: SectionContentType;
    initialContentData: ContentDataType;
    onSaveBlock: (args: SaveBlockArgs) => void;
    onDeleteBlock: () => void;
    editing: boolean;
    editBlock: () => void;
    initialTitle: string;
}

function ContentBlock({
    index,
    id,
    initialContentType,
    initialContentData,
    initialTitle,
    onSaveBlock,
    onDeleteBlock,
    editing,
    editBlock,
}: ContentBlockProps) {
    const [contentType, setContentType] = useState<
        SectionContentType | undefined
    >(initialContentType);
    const [title, setTitle] = useState<string>(initialTitle ?? "");
    const [urlContentData, setUrlContentData] = useState<UrlContentData>(
        isUrlContentData(initialContentData) ? initialContentData : { url: "" },
    );
    const [yooptaContentData, setYooptaContentData] =
        useState<YooptaContentValue>(
            isYooptaContentData(initialContentData) ? initialContentData : {},
        );

    function handleUrlContentDataChange(key: string, value: string) {
        setUrlContentData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }

    function handleSave() {
        if (!contentType) return;
        const content =
            contentType === SectionContentType.URL
                ? { ...urlContentData }
                : { ...yooptaContentData };
        onSaveBlock({
            id,
            contentType,
            content,
            title,
        });
    }

    return (
        <div
            className={cn(
                "flex w-[50rem] flex-col rounded-lg border-2 bg-white p-4 shadow transition-shadow duration-300",
                !editing && "cursor-pointer hover:shadow-lg ",
            )}
            onClick={() => {
                if (!editing) editBlock();
            }}
        >
            <div className="flex flex-row items-center justify-between text-xl font-bold">
                {editing && <div>Content Block {index}</div>}
                {!editing && (
                    <>
                        <div>{title || `Section ${index}`}</div>
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
                    {contentType === SectionContentType.URL && (
                        <UrlInput
                            title={title}
                            url={urlContentData.url}
                            onChange={handleUrlContentDataChange}
                            onTitleChange={setTitle}
                        />
                    )}
                    {contentType === SectionContentType.YOOPTA && (
                        <Editor
                            content={yooptaContentData}
                            editable
                            sectionId={id}
                            onChange={setYooptaContentData}
                            title={title}
                            onTitleChange={setTitle}
                        />
                    )}
                    <div className="flex gap-2 self-end">
                        <Button variant="outline" onClick={onDeleteBlock}>
                            Delete Block
                        </Button>
                        <Button disabled={!contentType} onClick={handleSave}>
                            Save Block
                        </Button>
                    </div>
                </>
            )}
            {!editing && (
                <div>
                    <div>
                        Content Type: <b>{contentType}</b>
                    </div>
                    {contentType === SectionContentType.URL && (
                        <div>
                            <b>{urlContentData.url}</b>
                        </div>
                    )}
                </div>
            )}
            {/* {JSON.stringify(isYooptaContentData(initialContentData))}
            {JSON.stringify(initialContentData)} */}
        </div>
    );
}

export default ContentBlock;
