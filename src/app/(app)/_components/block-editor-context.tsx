// block-editor-context.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { SectionSelect } from "@/server/db/schema";

type BlockEditorContextType = {
    blocks: SectionSelect[];
    setBlocks: React.Dispatch<React.SetStateAction<SectionSelect[]>>;
    initializeBlocks: (initialBlocks: SectionSelect[]) => void; // New method
};

const BlockEditorContext = createContext<BlockEditorContextType | undefined>(
    undefined,
);

export const BlockEditorProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [blocks, setBlocks] = useState<SectionSelect[]>([]);

    const initializeBlocks = (initialBlocks: SectionSelect[]) => {
        console.log("Initializing blocks with:", initialBlocks); // Debug log
        setBlocks(initialBlocks);
    };

    return (
        <BlockEditorContext.Provider
            value={{ blocks, setBlocks, initializeBlocks }}
        >
            {children}
        </BlockEditorContext.Provider>
    );
};

export const useBlockEditor = () => {
    const context = useContext(BlockEditorContext);
    if (!context) {
        throw new Error(
            "useBlockEditor must be used within a BlockEditorProvider",
        );
    }
    return context;
};
