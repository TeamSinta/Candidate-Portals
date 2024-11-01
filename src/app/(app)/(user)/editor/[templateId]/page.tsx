import Editor from "@/components/editor";
import { getPortalQuery } from "@/server/actions/template/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { notFound } from "next/navigation";
import React from "react";

async function page({ params }: { params: { templateId: string } }) {
    const data = await getPortalQuery(params.templateId);
    if (!data.portal) return notFound();
    return (
        <>
            {/* <Editor /> */}
            {data.sections?.map((section) => (
                <Editor
                    key={section.id}
                    sectionId={section.id}
                    templateId={params.templateId}
                    content={section.content as YooptaContentValue}
                    editable={true}
                />
            ))}
        </>
    );
}

export default page;
