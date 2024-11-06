"use client";
import React, { useState } from "react";
import { SectionContentType, SectionSelect } from "@/server/db/schema";
import ContentBlock, { SaveBlockArgs } from "./content-block";
import { YooptaBlockData } from "@yoopta/editor";
import { Button } from "@/components/ui/button";
import { generateGUID } from "@/lib/utils";
import { deleteSection, saveSection } from "@/server/actions/portal/mutations";
import { ContentDataType } from "../utils/types";
function BlockEditor({
    portalId,
    sections,
}: {
    portalId: string;
    sections: SectionSelect[];
}) {
    const [blocks, setBlocks] = useState<SectionSelect[]>(sections);
    const [selectedBlock, setSelectedBlock] = useState<string | undefined>(
        undefined,
    );

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
                title: "title",
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
            {/* <div>SelectedBlock: {JSON.stringify(selectedBlock)}</div> */}
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
                        />
                    ))}
                    <div className="flex flex-row items-center justify-center gap-4 font-light">
                        <Button variant="link" onClick={handleCreateBlock}>
                            Add Section
                        </Button>
                        <div className="h-12 w-[1px] bg-slate-200" />
                        <Button variant="link" onClick={handleCreateBlock}>
                            Add Section
                        </Button>
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
            <div>{JSON.stringify(blocks)}</div>
        </>
    );
}

export default BlockEditor;
