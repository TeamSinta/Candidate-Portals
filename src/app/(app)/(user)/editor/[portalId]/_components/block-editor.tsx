"use client";
import React, { useState } from "react";
import {
    PortalSelect,
    SectionContentType,
    SectionSelect,
} from "@/server/db/schema";
import ContentBlock, { SaveBlockArgs } from "./content-block";

import { generateGUID } from "@/lib/utils";
import { deleteSection, saveSection } from "@/server/actions/portal/mutations";
import { ContentDataType } from "../utils/types";
import { updatePortalData } from "@/server/actions/portal/queries";
import { toast } from "sonner";
import PortalEditBlock from "./portal-edit-block";
import { useRouter } from "next/navigation";

import AddNewSectionDialog from "./add-new-section";
import { useSlidingSidebar } from "./sliding-sidebar";


import { useEffect } from "react";
import { useBlockEditor } from "@/app/(app)/_components/block-editor-context";

function BlockEditor({
    portalId,
    sections,
    initialPortalData,
}: {
    portalId: string;
    sections: SectionSelect[];
    initialPortalData: PortalSelect;
}) {
    const { blocks, setBlocks, initializeBlocks } = useBlockEditor();
    const [selectedBlock, setSelectedBlock] = useState<string | undefined>(
        undefined,
    );
        useState<PortalSelect>(initialPortalData);
    const { setSlidingSidebarOpen, setSectionId, setContentType, isSlidingSidebarOpen } = useSlidingSidebar();

    const router = useRouter();

    // Initialize blocks when BlockEditor mounts
    useEffect(() => {
        initializeBlocks(sections);
    }, []);

    useEffect(() => {
      console.log("Rendering BlockEditor with blocks:", blocks);
  }, [blocks]);

    async function handleSaveBlock(
        index: number,
        updatedBlockData: SaveBlockArgs,
    ) {
        const newBlocks = [...blocks];
        if (newBlocks[index]) {
            newBlocks[index] = {
                ...newBlocks[index],
                ...updatedBlockData,
                portalId,
                index,
            };
        } else {
            newBlocks.splice(index, 0, {
                ...updatedBlockData,
                portalId,
                index: index,
            });
        }
        setBlocks(newBlocks);
        setSelectedBlock(undefined);
        await saveSection({ ...updatedBlockData, portalId, index });
    }

    const handleAddLink = (url: string) => {
        const newId = generateGUID();
        const newBlock: SectionSelect = {
            id: newId,
            portalId: portalId,
            title: "New Link",
            content: { url },
            contentType: SectionContentType.URL,
            index: blocks.length,
        };
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        saveSection({ ...newBlock, portalId }).catch((error) =>
            console.error("Error saving section:", error),
        );
    };

    const handleCreatePage = (title: string) => {
        const newId = generateGUID();
        const newBlock: SectionSelect = {
            id: newId,
            portalId,
            title: title,
            content: {},
            contentType: SectionContentType.YOOPTA,
            index: blocks.length,
        };
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        saveSection(newBlock)
            .then(() => {
                setSectionId(newId);
                setContentType(SectionContentType.YOOPTA);
                setSlidingSidebarOpen(true);
            })
            .catch((error) => console.error("Error saving section:", error));
    };

    async function handleDeleteBlock(sectionId: string) {
        setBlocks((prevBlocks) =>
            prevBlocks.filter((block) => block.id !== sectionId),
        );
        await deleteSection(sectionId, portalId);
    }

    return (
        <>
            {blocks.length > 0 && (
                <div
                    className={`${
                        isSlidingSidebarOpen
                            ? "flex flex-col items-center w-full justify-center gap-4 px-6 pt-6"
                            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pt-6"
                    }`}
                >
                    {blocks.map((section, index) => (
                        <ContentBlock
                            key={section.id}
                            id={section.id}
                            index={index + 1}
                            initialContentData={section.content as ContentDataType}
                            initialTitle={section.title ?? ""}
                            initialContentType={section.contentType}
                            onSaveBlock={(data) => handleSaveBlock(index, data)}
                            onDeleteBlock={() => handleDeleteBlock(section.id)}
                            editing={selectedBlock === section.id}
                            editBlock={() => setSelectedBlock(section.id)}
                            cancelEdit={() => setSelectedBlock(undefined)}
                            portalId={portalId}
                        />
                    ))}
                    <AddNewSectionDialog
                        maxWidth="sm:max-w-[700px]"
                        onAddLink={handleAddLink}
                        onCreatePage={handleCreatePage}
                    />
                </div>
            )}
            {blocks.length === 0 && (
                <AddNewSectionDialog
                    maxWidth="sm:max-w-[700px]"
                    onAddLink={handleAddLink}
                    onCreatePage={handleCreatePage}
                />
            )}
        </>
    );
}

export default BlockEditor;
