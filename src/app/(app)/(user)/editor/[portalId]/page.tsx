import { AppPageShell } from "@/app/(app)/_components/page-shell";
import Editor from "@/components/editor";
import { getPortalQuery } from "@/server/actions/portal/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { notFound } from "next/navigation";
import React from "react";
import EditorPageButtons from "./editor-page-buttons";

async function page({ params }: { params: { portalId: string } }) {
    const data = await getPortalQuery(params.portalId);
    if (!data.portal) return notFound();

    return (
        <AppPageShell
            title="Portal Editor"
            description="Edit the contents of your portal here"
            buttons={[<EditorPageButtons key={0} portalId={params.portalId} />]}
        >
            <div className="">
                {data.sections?.map((section) => (
                    <Editor
                        key={section.id}
                        sectionId={section.id}
                        portalId={params.portalId}
                        content={section.content as YooptaContentValue}
                        editable={true}
                    />
                ))}
            </div>
        </AppPageShell>
    );
}

export default page;
