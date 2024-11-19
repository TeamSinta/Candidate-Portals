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
    const { isSlidingSidebarOpen } = useSlidingSidebar(); // Access the sidebar state

    const router = useRouter();
    const fillerGUID = generateGUID();
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

    const handleAddLink = (url: string) => {
      const newId = generateGUID();
      const newBlock: SectionSelect = {
        id: newId,
        portalId: portalId,
        title: "New Link", // Default title for the link block
        content: { url }, // Save the URL in the content field
        contentType: SectionContentType.URL, // Set the content type to URL
        index: blocks.length,
      };
      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      saveSection({ ...newBlock, portalId }).catch((error) =>
        console.error("Error saving section:", error)
      );
    };


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

    return (
        <>
            {/* <PortalEditBlock
                onRenamePortal={handleRenamePortal}
                portalData={portalData}
                editing={Boolean(selectedBlock) && selectedBlock === "portal"}
                onCancel={() => setSelectedBlock(undefined)}
                onClick={() => {
                    if (selectedBlock !== "portal") setSelectedBlock("portal");
                }}
            /> */}

      {blocks.length > 0 && (
        <div
          className={`${
            isSlidingSidebarOpen
              ? "flex flex-col gap-4 px-6 pt-6" // Column layout when sidebar is open
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pt-6" // Grid layout when sidebar is closed
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
            />
          ))}
           <AddNewSectionDialog
            maxWidth="sm:max-w-[700px]"
            onAddLink={handleAddLink} // Pass the function to AddNewSectionDialog
          />
        </div>
      )}
      {blocks.length === 0 &&  <AddNewSectionDialog
            maxWidth="sm:max-w-[700px]"
            onAddLink={handleAddLink} // Pass the function to AddNewSectionDialog
          />}
    </>
    );
}

export default BlockEditor;
