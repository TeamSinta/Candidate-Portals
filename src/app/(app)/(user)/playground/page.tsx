import React from "react";
import Editor from "./editor";
import { db } from "@/server/db";
import { getTemplateQuery } from "@/server/actions/template/queries";
import { YooptaContentValue } from "@yoopta/editor";

export default async function page() {
    const data = await getTemplateQuery("a2710960-129a-4823-aaa8-ee26afbeba77");
    console.log(JSON.stringify(data));
    return (
        <>
            {/* <Editor /> */}
            {data.sections?.map((section) => (
                <Editor
                    key={section.id}
                    content={section.content as YooptaContentValue}
                />
            ))}
        </>
    );
}
