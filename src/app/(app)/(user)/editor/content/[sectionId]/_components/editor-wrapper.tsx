"use client";
import { AppPageShell } from "@/app/(app)/_components/page-shell";
import Editor from "@/components/editor";
import { PortalSelect, SectionSelect } from "@/server/db/schema";
import { YooptaContentValue } from "@yoopta/editor";
import React from "react";
import ContentEditorPageButtons from "./content-editor-page-buttons";

interface Props {
    section: SectionSelect;
    portal: PortalSelect;
}
function EditorWrapper({ section, portal }: Props) {
    return (
        <AppPageShell
            title={`${portal.title}  >  ${section.title}`}
            description="Edit the contents of your portal here"
            buttons={[<ContentEditorPageButtons key={0} />]}
        >
            <div className="container">
                {" "}
                Content Editor Page {section.id}
                <div>{JSON.stringify(section)}</div>
                <div>{JSON.stringify(portal)}</div>
                <Editor
                    content={section.content as YooptaContentValue}
                    editable={true}
                    onChange={() => {
                        return;
                    }}
                />
            </div>
        </AppPageShell>
    );
}

export default EditorWrapper;
