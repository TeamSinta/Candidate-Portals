"use client";
import React, { useState } from "react";
import {
    PortalSelect,
    SectionContentType,
    SectionSelect,
} from "@/server/db/schema";
import ContentBlock, { SaveBlockArgs } from "./content-block";
import { YooptaBlockData } from "@yoopta/editor";
import { Button } from "@/components/ui/button";
import { generateGUID } from "@/lib/utils";
import { deleteSection, saveSection } from "@/server/actions/portal/mutations";
import { ContentDataType } from "../utils/types";
import { updatePortalData } from "@/server/actions/portal/queries";
import { toast } from "sonner";
import PortalEditBlock from "./portal-edit-block";
import { useRouter } from "next/navigation";
import { PlusCircleIcon, PlusIcon } from "lucide-react";
function BlockEditor({
    portalId,
    sections,
    initialPortalData,
}: {
    portalId: string;
    sections: SectionSelect[];
    initialPortalData: PortalSelect;
}) {
    const [blocks, setBlocks] = useState<SectionSelect[]>(sections);
    const [selectedBlock, setSelectedBlock] = useState<string | undefined>(
        undefined,
    );
    const [portalData, setPortalData] =
        useState<PortalSelect>(initialPortalData);
    const router = useRouter();
    async function handleRenamePortal(newName: string) {
        const updatedPortal = { ...portalData, title: newName };
        try {
            setPortalData(updatedPortal);
            await updatePortalData(portalId, updatedPortal);
            toast.success("Portal updated successfully");
            setSelectedBlock("");
            // Display the updated name on the AppPageShell
            router.refresh();
        } catch {
            toast.error("Failed to update portal name");
        }
    }

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
            console.log("Updating block at index:", index);
        } else {
            newBlocks.splice(index, 0, {
                ...updatedBlockData,
                portalId,
                index: index,
            });
            console.log("Creating new block at index:", index);
        }
        setBlocks(newBlocks);
        setSelectedBlock(undefined);
        await saveSection({ ...updatedBlockData, portalId, index });
    }

    async function handleDeleteBlock(sectionId: string) {
        setBlocks((prevBlocks) => {
            const updatedBlocks = prevBlocks.filter(
                (block, index) => block.id !== sectionId,
            );
            console.log("Deleted block with id:", sectionId);
            return updatedBlocks;
        });
        await deleteSection(sectionId, portalId);
    }

    function handleCreateBlock() {
        const newId = generateGUID();
        setBlocks((prevBlocks) => {
            const newBlock = {
                contentType: undefined,
                title: "",
                content: { title: "", url: "" },
                id: newId,
                portalId: portalId,
                index: Math.max(...prevBlocks.map((block) => block.index)) + 1,
            };
            return [...prevBlocks, newBlock];
        });
        setSelectedBlock(newId);
    }

    return (
        <>
            <PortalEditBlock
                onRenamePortal={handleRenamePortal}
                portalData={portalData}
                editing={Boolean(selectedBlock) && selectedBlock === "portal"}
                onCancel={() => setSelectedBlock(undefined)}
                onClick={() => {
                    if (selectedBlock !== "portal") setSelectedBlock("portal");
                }}
            />
            {blocks.length > 0 && (
                <div className="flex flex-col items-center gap-8">
                    {blocks.map((section, index) => (
                        <ContentBlock
                            key={section.id}
                            id={section.id}
                            index={index + 1}
                            initialContentData={
                                section.content as ContentDataType
                            }
                            initialTitle={section.title ?? ""}
                            initialContentType={section.contentType}
                            onSaveBlock={(data) => handleSaveBlock(index, data)}
                            onDeleteBlock={() => handleDeleteBlock(section.id)}
                            editing={selectedBlock === section.id}
                            editBlock={() => setSelectedBlock(section.id)}
                            cancelEdit={() => setSelectedBlock(undefined)}
                        />
                    ))}
                    <div className="flex flex-row items-center justify-center gap-4 z-10 w-96">
                        <Button className="w-full shadow-lg" variant="default" onClick={handleCreateBlock}>
                          <PlusIcon className="h-4 w-4"/>
                            Add Section
                        </Button>
                        {/* <div className="h-12 w-[1px] bg-slate-200" /> */}

                    </div>
                </div>
            )}
            {blocks.length === 0 && (
                <ContentBlock
                    index={1}
                    id={""}
                    initialTitle=""
                    initialContentData={{ url: "" }}
                    onSaveBlock={(data) =>
                        handleSaveBlock(0, { ...data, id: generateGUID() })
                    }
                    onDeleteBlock={() => {
                        return;
                    }}
                    editing={true}
                    editBlock={() => {
                        return;
                    }}
                />
            )}
        </>
    );
}

export default BlockEditor;
