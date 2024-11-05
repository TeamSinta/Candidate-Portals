"use client";
import React, { useState } from "react";
import { SectionSelect } from "@/server/db/schema";
import ContentBlock from "./content-block";
import { YooptaBlockData } from "@yoopta/editor";
function BlockEditor({ sections }: { sections: SectionSelect[] }) {
    const [blocks, setBlocks] = useState<SectionSelect[]>(sections);
    function handleSaveBlock(index: number) {
        console.log("SVAE BLOCK", index);
    }

    function handleDeleteBlock(index: number) {
        console.log("DELETE BLOCK", index);
    }
    return (
        <>
            {blocks.map((section, index) => (
                <ContentBlock
                    key={section.id}
                    index={index}
                    contentData={
                        section.content as
                            | YooptaBlockData
                            | { url: string; title: string }
                    }
                    onSaveBlock={handleSaveBlock}
                    onDeleteBlock={handleDeleteBlock}
                />
            ))}
            {!blocks.length && (
                <ContentBlock
                    index={blocks.length}
                    contentData={null}
                    onSaveBlock={handleSaveBlock}
                    onDeleteBlock={(index: number) => {
                        return;
                    }}
                />
            )}
        </>
    );
}

export default BlockEditor;
