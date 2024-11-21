import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionContentType } from "@/server/db/schema";

import { DockIcon, Edit2Icon, FileCodeIcon, FileType2, TrashIcon } from "lucide-react";

import {
    ContentDataType,
    isUrlContentData,
} from "../utils/types";
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
import { FileTextIcon, LinkIcon, FilePlusIcon,  } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useSlidingSidebar } from "./sliding-sidebar";

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
    onSaveBlock: (args: SaveBlockArgs) => Promise<void>;
    onDeleteBlock: () => Promise<void>;
    editing: boolean;
    editBlock: () => void;
    cancelEdit: () => void;
    initialTitle: string;
    portalId: string;
}


const contentTypeIcons = {
    [SectionContentType.YOOPTA]: FileType2,
    [SectionContentType.URL]: LinkIcon,
    [SectionContentType.DOC]: DockIcon,
    [SectionContentType.NOTION]: FileTextIcon,
    [SectionContentType.PDF]: FileCodeIcon,
};


function ContentBlock({
    index,
    id,
    portalId,
    initialContentType,
    initialContentData,
    initialTitle,
    onDeleteBlock,
    editBlock,
}: ContentBlockProps) {


    // Toggle Sidebar
    const { isSlidingSidebarOpen, setPortalId ,toggleSlidingSidebar, setContentType, setTitle, setSectionId, setUrlContentData } = useSlidingSidebar();
// Fallback to FileTextIcon if contentType is undefined
  const IconComponent = initialContentType ? contentTypeIcons[initialContentType] || FileTextIcon : FileTextIcon;


    const handleViewClick = () => {
      if (!isSlidingSidebarOpen) {
        toggleSlidingSidebar(); // Only open the sidebar if it's closed
      }
      // Always set the content data
      setContentType(initialContentType);
      setTitle(initialTitle);
      setSectionId(id);
      setPortalId(portalId)
      if (initialContentType === SectionContentType.URL) {
        setUrlContentData(isUrlContentData(initialContentData) ? initialContentData : { url: "" });
      }
    };

    return (
      <div className="relative group">
            <Card className="overflow-hidden h-[15rem] max-w-[24rem] rounded-sm shadow-sm border border-gray-200 transition-transform duration-300 hover:shadow-lg hover:scale-105">
                {/* Number Container */}
                <div className="absolute top-2 left-2 bg-white text-black text-sm font-semibold rounded-full h-8 w-8 flex items-center justify-center shadow">
                    {index}
                </div>

                {/* Delete Button on Hover */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="absolute top-2 right-2 z-20 text-gray-500 hidden group-hover:block hover:text-red-600">
                            <TrashIcon size={20} />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. It will permanently delete this content block.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 text-white hover:bg-red-500"
                                onClick={onDeleteBlock}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Grayed-out Effect and View Button on Hover */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" onClick={handleViewClick} className="bg-white text-black px-4 py-2 rounded">
                        View
                    </Button>
                </div>

                {/* Card Header with Image */}
                <CardHeader className="bg-gray-200 rounded-t sm:px-12 px-4 sm:pb-0">
                    <img
                        src="https://s3.us-west-2.amazonaws.com/public.notion-static.com/template/416ca37a-c1e7-4ac5-b0f7-4766bcd7356a/desktop.png"
                        alt={`Preview of ${initialTitle}`}
                        className="w-full h-32 object-cover rounded"
                    />
                </CardHeader>

                {/* Card Content */}
                <CardContent className="py-4 px-1 sm:pt-4 border-t border-gray-200 flex items-center space-x-2">
                    {/* Icon */}
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg p-2 w-10 h-10 shadow-inner flex items-center justify-center shadow">
    <IconComponent size={20} className="text-black-500" />
</div>

                    {/* Title and Sub-header */}
                    <div className="flex-1">
                        <h3 className="text-lg overflow-hidden max-w-52 font-semibold truncate">{initialTitle || `Page ${index}`}</h3>
                        <div className="text-xs text-gray-500 mt-1 truncate">{`${initialContentType} `}</div>
                    </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter className="flex justify-end items-center text-sm text-gray-500 p-4 pt-0">
                    <button className="hover:text-gray-800" onClick={editBlock}>
                        <Edit2Icon size={16} />
                    </button>
                </CardFooter>
            </Card>
        </div>



    );
}

export default ContentBlock;
