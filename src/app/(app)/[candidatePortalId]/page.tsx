import React from "react";
import { getTemplateQuery } from "@/server/actions/template/queries";
import { YooptaContentValue } from "@yoopta/editor";
import Editor from "@/components/editor";
import { notFound } from "next/navigation";

const sampleId = "a2710960-129a-4823-aaa8-ee26afbeba77";
export default async function page({
    params,
}: {
    params: { candidatePortalId: string };
}) {
    const data = await getTemplateQuery(params.candidatePortalId);
    if (!data.template) return notFound();
    return (
        <>
            {/* <Editor /> */}
            {data.sections?.map((section) => (
                <Editor
                    key={section.id}
                    content={section.content as YooptaContentValue}
                    editable={false}
                />
            ))}
        </>
    );
}
