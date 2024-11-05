"use client";
import React, { useState } from "react";
import { SectionContentType, SectionSelect } from "@/server/db/schema";
import ContentBlock from "./content-block";
import { YooptaBlockData } from "@yoopta/editor";
import { Button } from "@/components/ui/button";
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

    function handleSaveBlock(index: number, updatedBlockData: any) {
        setBlocks((prevBlocks) => {
            const blocksCopy = [...prevBlocks];
            if (blocksCopy[index]) {
                blocksCopy[index] = {
                    ...blocksCopy[index],
                    ...updatedBlockData,
                    portalId,
                };
                console.log("Updating block at index:", index);
            } else {
                blocksCopy.splice(index, 0, { ...updatedBlockData, portalId });
                console.log("Creating new block at index:", index);
            }
            return blocksCopy;
        });
        setSelectedBlock(undefined);
    }

    function handleDeleteBlock(index: number) {
        setBlocks((prevBlocks) => {
            const updatedBlocks = prevBlocks.filter((_block, i) => i !== index);
            console.log("Deleted block at index:", index);
            return updatedBlocks;
        });
    }

    function handleCreateBlock() {
        const newId = Date.now().toString();
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
        if (!blocks.length) setSelectedBlock(undefined);
        else setSelectedBlock(newId);
    }

    return (
        <>
            {blocks.length > 0 && (
                <div className="flex flex-col items-center gap-8">
                    {blocks.map((section, index) => (
                        <ContentBlock
                            key={section.id}
                            index={index + 1}
                            initialContentData={
                                section.content as
                                    | YooptaBlockData
                                    | { url: string; title: string }
                            }
                            initialContentType={section.contentType}
                            onSaveBlock={(data) => handleSaveBlock(index, data)}
                            onDeleteBlock={() => handleDeleteBlock(index)}
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
                    initialContentData={{ title: "", url: "" }}
                    onSaveBlock={(data) => handleSaveBlock(0, data)}
                    onDeleteBlock={() => {}}
                    editing={true}
                    editBlock={() => {}}
                />
            )}
            <div>{JSON.stringify(blocks)}</div>
        </>
    );
}

export default BlockEditor;
