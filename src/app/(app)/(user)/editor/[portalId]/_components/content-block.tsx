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
import { Edit, Router } from "lucide-react";
import { cn } from "@/lib/utils";
import Editor from "@/components/editor";
import {
    ContentDataType,
    isUrlContentData,
    isYooptaContentData,
    UrlContentData,
} from "../utils/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import AttachmentBlock from "./attachment-block";
import { useRouter } from "next/navigation";

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
    cancelEdit: () => void;
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
    cancelEdit,
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

    // Backup states for cancel functionality
    const [backupContentType, setBackupContentType] =
        useState(initialContentType);
    const [backupTitle, setBackupTitle] = useState(initialTitle ?? "");
    const [backupUrlContentData, setBackupUrlContentData] = useState(
        isUrlContentData(initialContentData) ? initialContentData : { url: "" },
    );
    const [backupYooptaContentData, setBackupYooptaContentData] = useState(
        isYooptaContentData(initialContentData) ? initialContentData : {},
    );

    const router = useRouter();
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
        // Update backup with saved data
        setBackupContentType(contentType);
        setBackupTitle(title);
        setBackupUrlContentData({ ...urlContentData });
        setBackupYooptaContentData({ ...yooptaContentData });

        // Optional navigation to a new route
        if (contentType === SectionContentType.YOOPTA) {
            router.push("/editor/content/" + id);
        }

        if (contentType === SectionContentType.YOOPTA) {
            router.push("/editor/content/" + id);
        }
    }
    function handleCancel() {
        // Revert to backup data
        setContentType(backupContentType);
        setTitle(backupTitle);
        setUrlContentData(backupUrlContentData);
        setYooptaContentData(backupYooptaContentData);

        cancelEdit();
    }

    return (
        <>
            <div
                className={cn(
                    "flex w-[50rem] flex-col rounded-lg border-2 bg-white p-4 px-8 shadow transition-shadow duration-300",
                    !editing && "hover:shadow-lg ",
                )}
            >
                <div className="flex flex-row items-center justify-between text-xl font-bold">
                    {editing && <div>Content Block {index}</div>}
                    {!editing && (
                        <>
                            <div>{title || `Section ${index}`}</div>
                        </>
                    )}
                </div>
                {!editing && (
                    <div className="flex w-full flex-col">
                        <div>
                            Content Type: <b>{contentType}</b>
                        </div>
                    </div>
                )}
                {editing && (
                    <>
                        <div className="text-sm font-light">
                            What would you like your candidate to review?
                        </div>

                        <div className="mt-4 flex flex-col self-start">
                            <div className="text-sm font-semibold">
                                Content Type
                            </div>
                            <Tabs
                                value={contentType}
                                onValueChange={(value: string) =>
                                    setContentType(value as SectionContentType)
                                }
                            >
                                <TabsList className="">
                                    <TabsTrigger
                                        value={SectionContentType.URL}
                                        className="px-8"
                                    >
                                        Link
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value={SectionContentType.DOC}
                                        className="px-8"
                                    >
                                        Attach
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value={SectionContentType.YOOPTA}
                                        className="px-8"
                                    >
                                        Content
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </>
                )}
                {contentType === SectionContentType.URL && (
                    <UrlInput
                        title={title}
                        url={urlContentData.url}
                        onChange={handleUrlContentDataChange}
                        onTitleChange={setTitle}
                        editable={editing}
                    />
                )}
                {contentType === SectionContentType.YOOPTA && (
                    <Editor
                        content={yooptaContentData}
                        editable={editing}
                        sectionId={id}
                        onChange={setYooptaContentData}
                        title={title}
                        onTitleChange={setTitle}
                    />
                )}
                {contentType === SectionContentType.DOC && <AttachmentBlock />}
                {editing && (
                    <div className="flex gap-2 self-end">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button disabled={!contentType} onClick={handleSave}>
                            {contentType === SectionContentType.YOOPTA
                                ? "Create Block"
                                : "Save Block"}
                        </Button>
                    </div>
                )}
                {!editing && (
                    <div className="flex gap-2 self-end">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-500"
                                >
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this content block.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        className="bg-red-600 text-white hover:bg-red-500"
                                        onClick={() => onDeleteBlock()}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button onClick={() => editBlock()} variant={"outline"}>
                            Edit Block
                        </Button>
                    </div>
                )}
                {/* {JSON.stringify(isYooptaContentData(initialContentData))}
            {JSON.stringify(initialContentData)} */}
            </div>
        </>
    );
}

export default ContentBlock;
