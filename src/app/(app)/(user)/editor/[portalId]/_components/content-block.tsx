"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionContentType } from "@/server/db/schema";

import {
    DockIcon,
    Edit2Icon,
    FileCodeIcon,
    FileType2,
    TrashIcon,
} from "lucide-react";

import { ContentDataType, isUrlContentData } from "../utils/types";
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
import { FileTextIcon, LinkIcon, FilePlusIcon } from "lucide-react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { useSlidingSidebar } from "./sliding-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
      isSlidingSidebarOpen,
      setPortalId,
      toggleSlidingSidebar,
      setContentType,
      setTitle,
      setSectionId,
      setUrlContentData,
  } = useSlidingSidebar();

  const IconComponent = initialContentType
      ? contentTypeIcons[initialContentType] || FileTextIcon
      : FileTextIcon;

  useEffect(() => {
      if (initialContentType === SectionContentType.URL && isUrlContentData(initialContentData)) {
          const fetchOpenGraphImage = async () => {
              setLoading(true);
              try {
                  const response = await fetch(
                      `/api/images?url=${encodeURIComponent(initialContentData.url)}`
                  );
                  const { image: fetchedImage } = await response.json();
                  setImage(fetchedImage || "/path-to-fallback-image.jpg");
              } catch (error) {
                  console.error("Error fetching OpenGraph image:", error);
                  setImage("/path-to-fallback-image.jpg");
              } finally {
                  setLoading(false);
              }
          };
          fetchOpenGraphImage();
      }
  }, [initialContentType, initialContentData]);

  const handleViewClick = () => {
      if (!isSlidingSidebarOpen) {
          toggleSlidingSidebar();
      }
      setContentType(initialContentType);
      setTitle(initialTitle);
      setSectionId(id);
      setPortalId(portalId);
      if (initialContentType === SectionContentType.URL) {
          setUrlContentData(
              isUrlContentData(initialContentData)
                  ? initialContentData
                  : { url: "" },
          );
      }
  };

  return (
    <div className="group relative">
    <Card className="h-[15rem] max-w-[24rem] overflow-hidden rounded-sm border border-gray-200 shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:shadow-none">
        {/* Number Container */}
        <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-black shadow dark:bg-gray-800 dark:text-white">
            {index}
        </div>

        {/* Delete Button on Hover */}
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="absolute right-2 top-2 z-20 hidden text-gray-500 hover:text-red-600 group-hover:block dark:text-gray-400 dark:hover:text-red-500">
                    <TrashIcon size={20} />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                        This action cannot be undone. It will permanently delete this content block.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-300">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600"
                        onClick={onDeleteBlock}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* Grayed-out Effect and View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gray-900 dark:bg-opacity-50">
            <Button
                variant="ghost"
                onClick={handleViewClick}
                className="rounded bg-white px-4 py-2 text-black dark:bg-gray-800 dark:text-white"
            >
                View
            </Button>
        </div>

        {/* Card Header with Image */}
        <CardHeader className="rounded-t bg-gray-200 px-4 sm:px-12 sm:pb-0 dark:bg-gray-800">
            {loading ? (
                <Skeleton className="h-32 w-full rounded" />
            ) : (
                <img
                    src={image || "https://cdn.dribbble.com/userupload/14196667/file/original-431017da41cec525ed9af4115905b503.png?resize=2048x1536&vertical=center"}
                    alt={`Preview of ${initialTitle}`}
                    className="h-32 w-full rounded object-cover"
                    onError={(e) => (e.currentTarget.src = "https://s3.us-west-2.amazonaws.com/public.notion-static.com/template/416ca37a-c1e7-4ac5-b0f7-4766bcd7356a/desktop.png")}
                />
            )}
        </CardHeader>

        {/* Card Content */}
        <CardContent className="flex items-center space-x-2 border-t border-gray-200 px-1 py-4 sm:pt-4 dark:border-gray-700">
            {/* Icon */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 p-2 shadow shadow-inner dark:bg-gray-700">
                <IconComponent size={20} className="text-black dark:text-white" />
            </div>

            {/* Title and Sub-header */}
            <div className="flex-1">
                <h3 className="max-w-52 overflow-hidden truncate text-lg font-semibold dark:text-white">
                    {initialTitle || `Page ${index}`}
                </h3>
                <div className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{`${initialContentType}`}</div>
            </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex items-center justify-end p-4 pt-0 text-sm text-gray-500 dark:text-gray-400">
            <button className="hover:text-gray-800 dark:hover:text-white" onClick={editBlock}>
                <Edit2Icon size={16} />
            </button>
        </CardFooter>
    </Card>
</div>

  );
}

export default ContentBlock;
