"use client";
import Editor from "@/components/editor";
import {
    PortalSelect,
    SectionContentType,
    SectionSelect,
} from "@/server/db/schema";
import { YooptaContentValue } from "@yoopta/editor";
import React, { useState } from "react";
import ContentEditorPageButtons from "./content-editor-page-buttons";
import { updateSectionContent } from "@/server/actions/portal/mutations";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { replaceText, sampleDictionary } from "../../../utils/yoopta-config";
import { useSlidingSidebar } from "../../../[portalId]/_components/sliding-sidebar";
import { useBlockEditor } from "@/app/(app)/_components/block-editor-context";

interface Props {
    section: SectionSelect;
    portal: PortalSelect;
}
function EditorWrapperHeaders({ section, portal }: Props) {
    const [sectionContent, setSectionContent] = useState<YooptaContentValue>(
        section.content as YooptaContentValue,
    );
    const [title, setTitle] = useState<string>(section.title ?? "");
    const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
    const sidebar = useSidebar();
    const router = useRouter();
    const { setSlidingSidebarOpen } = useSlidingSidebar();

    const { setBlocks } = useBlockEditor();

    async function handleSave() {
        try {
            const updatedSection = {
                id: section.id,
                portalId: portal.id,
                title: title ?? "",
                content: sectionContent,
                contentType: SectionContentType.YOOPTA,
                index: section.index,
            };

            // Update the section in the database
            await updateSectionContent(updatedSection);

            // Update the shared blocks state
            setBlocks((prevBlocks) =>
                prevBlocks.map((block) =>
                    block.id === section.id ? { ...block, ...updatedSection } : block                )


            );

            toast.success("Section saved successfully");
            setSlidingSidebarOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to save section");
        }
    }
    function handleTogglePreview() {
        sidebar.setOpen(isPreviewing);
        setIsPreviewing(!isPreviewing);
    }

    return (
        <>
          <div className="relative">
      {/* Sticky Toolbar */}

      <div className="sticky top-0 z-10 p-4">
         <ContentEditorPageButtons
                    key={0}
                    onSave={handleSave}
                    onTogglePreview={handleTogglePreview}
                    isPreviewing={isPreviewing}
                    sectionid={section.id}
                />
                  </div>

            <div >
                <Editor
                    // key={isPreviewing ? "preview" : "edit"}
                    // content={JSON.parse(
                    //     replaceText(
                    //         JSON.stringify(sectionContent),
                    //         sampleDictionary,
                    //     ),
                    // )}
                    content={
                        isPreviewing
                            ? JSON.parse(
                                  replaceText(
                                      JSON.stringify(sectionContent),
                                      sampleDictionary,
                                  ),
                              )
                            : sectionContent
                    }
                    editable={!isPreviewing}
                    onChange={setSectionContent}
                    onTitleChange={(newTitle: string) => {
                        setTitle(newTitle);
                    }}
                    title={
                        isPreviewing
                            ? replaceText(title, sampleDictionary)
                            : (title ?? "")
                    }
                />
            </div>
            </div>
        </>
    );
}

export default EditorWrapperHeaders;
