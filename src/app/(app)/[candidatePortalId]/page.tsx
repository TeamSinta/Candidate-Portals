import Editor from "@/components/editor";
import { getTemplateByURLQuery } from "@/server/actions/template/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { notFound } from "next/navigation";

const sampleId = "a2710960-129a-4823-aaa8-ee26afbeba77";
export default async function page({
    params,
}: {
    params: { candidatePortalURL: string };
}) {
    const data = await getTemplateByURLQuery(params.candidatePortalURL);
    if (!data.template) return notFound();
    return (
        <>
            {/* <Editor /> */}
            {data.template.sections?.map((section) => (
                <Editor
                    sectionId={section.id}
                    templateId={section.templateId}
                    key={section.id}
                    content={section.content as YooptaContentValue}
                    editable={false}
                />
            ))}
        </>
    );
}
