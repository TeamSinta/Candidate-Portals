import React from "react";
import Editor from "@/components/editor";
import { getPortalQuery } from "@/server/actions/portal/queries";
import { YooptaContentValue } from "@yoopta/editor";
import CreateTemplateButton from "./create-template-button";

export default async function page() {
    const data = await getPortalQuery("a2710960-129a-4823-aaa8-ee26afbeba77");
    return (
        <>
            {/* <Editor /> */}
            {data.sections?.map((section) => (
                <Editor
                    key={section.id}
                    sectionId={section.id}
                    portalId={"a2710960-129a-4823-aaa8-ee26afbeba77"}
                    content={section.content as YooptaContentValue}
                    editable={true}
                />
            ))}
            <CreateTemplateButton />
        </>
    );
}
