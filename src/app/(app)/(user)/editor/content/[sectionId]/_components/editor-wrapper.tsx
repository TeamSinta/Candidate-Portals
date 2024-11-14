"use client";
import { AppPageShell } from "@/app/(app)/_components/page-shell";
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
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    section: SectionSelect;
    portal: PortalSelect;
}
function EditorWrapper({ section, portal }: Props) {
    const [sectionContent, setSectionContent] = useState<YooptaContentValue>(
        section.content as YooptaContentValue,
    );
    const [title, setTitle] = useState<string>(section.title ?? "");
    const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
    const sidebar = useSidebar();
    const router = useRouter();
    async function handleSave() {
        try {
            await updateSectionContent({
                id: section.id,
                portalId: portal.id,
                title: section.title ?? "",
                content: sectionContent,
                contentType: SectionContentType.YOOPTA,
                index: section.index,
            });
            toast.success("Section saved successfully");
            router.push(`/editor/${portal.id}`);
        } catch {
            toast.error("Failed to save section");
        }
    }

    function handleTogglePreview() {
        sidebar.setOpen(isPreviewing);
        setIsPreviewing(!isPreviewing);
    }

    return (
        <AppPageShell
            title={`${portal.title ?? "Untitled"}  >  ${section.title}`}
            description="Edit the contents of your portal here"
            buttons={[
                <ContentEditorPageButtons
                    key={0}
                    onSave={handleSave}
                    onTogglePreview={handleTogglePreview}
                    isPreviewing={isPreviewing}
                />,
            ]}
        >
            <div className="container">
                <Editor
                    // key={isPreviewing ? "preview" : "edit"}
                    content={sectionContent}
                    editable={!isPreviewing}
                    onChange={setSectionContent}
                    onTitleChange={(newTitle: string) => {
                        setTitle(newTitle);
                    }}
                    title={title ?? ""}
                />
            </div>
        </AppPageShell>
    );
}

export default EditorWrapper;
