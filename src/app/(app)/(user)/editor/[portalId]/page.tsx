import Editor from "@/components/editor";
import { getPortalQuery } from "@/server/actions/portal/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { notFound } from "next/navigation";
import React from "react";

async function page({ params }: { params: { portalId: string } }) {
    const data = await getPortalQuery(params.portalId);
    if (!data.portal) return notFound();
    return (
        <>
            {/* <Editor /> */}
            {data.sections?.map((section) => (
                <Editor
                    key={section.id}
                    sectionId={section.id}
                    portalId={params.portalId}
                    content={section.content as YooptaContentValue}
                    editable={true}
                />
            ))}
        </>
    );
}

export default page;
