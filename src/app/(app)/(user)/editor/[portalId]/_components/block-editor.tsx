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
import { FileText, Link, PlusCircleIcon, PlusIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
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
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6 pt-6">
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

                    {/* <div className="flex items-center justify-center gap-4 z-10 w-96">
                        <Button className="w-full rounded shadow-lg" variant="default" onClick={handleCreateBlock}>

                            Add Page
                            <PlusIcon className="h-4 w-4 ml-2"/>
                        </Button>
                        <div className="h-12 w-[1px] bg-slate-200" />

                    </div> */}

<Dialog>
           <DialogTrigger asChild>
             <div className="relative group cursor-pointer">
               {/* Skeleton Card Container */}
               <Card className="flex flex-col items-center justify-center h-[15rem] w-[22rem] rounded-sm shadow-sm border-2 border-dashed border-gray-300 hover:shadow-md transition-transform duration-300 hover:scale-105">
                 <div className="flex items-center justify-center bg-gray-100 rounded-t h-full w-full">
                   <PlusIcon size={32} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                 </div>
                 <CardContent className="text-center justify-center text-sm text-gray-500 sm:pt-8">
                   Add Page
                 </CardContent>
               </Card>
             </div>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[700px] rounded-lg">
             <DialogHeader>
               <DialogTitle>
                 <h1 className="text-2xl font-semibold font-heading">Add a Section</h1>
               </DialogTitle>
             </DialogHeader>
             <div className="flex justify-around py-6">
               {/* Box 1: Link */}
               <div className="flex  flex-col items-center">
                 <div className="flex flex-col items-center justify-center border rounded-lg p-16 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gray-50">
                   <Link size={24} className="text-gray-500 mb-2" />
                   <h3 className="font-semibold text-base">Link</h3>
                   <p className="text-sm text-gray-500 text-center mt-1">Attach an external link.</p>
                 </div>
                 {/* Description Under Box 1 */}
                 <p className="text-xs text-gray-400 text-center mt-4 max-w-64">
                   You can add links to external resources or documentation.
                 </p>
               </div>
               {/* Box 2: Custom Page */}
               <div className="flex flex-col items-center">
                 <div className="flex flex-col items-center justify-center border rounded-lg p-16 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gray-50">
                   <FileText size={24} className="text-gray-500 mb-2" />
                   <h3 className="font-semibold text-base">Create Page</h3>
                   <p className="text-sm text-gray-500 text-center mt-1">Create a Notion-like page.</p>
                 </div>
                 {/* Description Under Box 2 */}
                 <p className="text-xs text-gray-400 text-center mt-4 max-w-64">
                   Build a fully customizable page for your workspace.
                 </p>
               </div>
             </div>
           </DialogContent>
         </Dialog>


                </div>
            )}
            {blocks.length === 0 && (
           <Dialog>
           <DialogTrigger asChild>
             <div className="relative group cursor-pointer">
               {/* Skeleton Card Container */}
               <Card className="flex flex-col items-center justify-center h-[15rem] w-[22rem] rounded-sm shadow-sm border-2 border-dashed border-gray-300 hover:shadow-md transition-transform duration-300 hover:scale-105">
                 <div className="flex items-center justify-center bg-gray-100 rounded-t h-full w-full">
                   <PlusIcon size={32} className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
                 </div>
                 <CardContent className="text-center justify-center text-sm text-gray-500 sm:pt-8">
                   Add Page
                 </CardContent>
               </Card>
             </div>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[800px] rounded-lg">
             <DialogHeader>
               <DialogTitle>
                 <h1 className="text-2xl font-semibold font-heading">Add a Section</h1>
               </DialogTitle>
             </DialogHeader>
             <div className="flex justify-around py-6">
               {/* Box 1: Link */}
               <div className="flex  flex-col items-center">
               <div className="flex flex-col items-center justify-center border rounded-lg p-16 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gray-50">
                   <Link size={24} className="text-gray-500 mb-2" />
                   <h3 className="font-semibold text-base">Link</h3>
                   <p className="text-sm text-gray-500 text-center mt-1">Attach an external link.</p>
                 </div>
                 {/* Description Under Box 1 */}
                 <p className="text-xs text-gray-400 text-center mt-4 max-w-64">
                   You can add links to external resources or documentation.
                 </p>
               </div>
               {/* Box 2: Custom Page */}
               <div className="flex flex-col items-center">
                 <div className="flex flex-col items-center justify-center border rounded-lg p-16 hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-gray-50">
                   <FileText size={24} className="text-gray-500 mb-2" />
                   <h3 className="font-semibold text-base">Create Page</h3>
                   <p className="text-sm text-gray-500 text-center mt-1">Create a Notion-like page.</p>
                 </div>
                 {/* Description Under Box 2 */}
                 <p className="text-xs text-gray-400 text-center mt-4 max-w-64">
                   Build a fully customizable page for your workspace.
                 </p>
               </div>
             </div>
           </DialogContent>
         </Dialog>
            )}
        </>
    );
}

export default BlockEditor;
