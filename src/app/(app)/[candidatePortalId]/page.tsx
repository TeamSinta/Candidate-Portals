import Editor from "@/components/editor";
import { getPortalByURLQuery } from "@/server/actions/template/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { notFound } from "next/navigation";

const sampleId = "a2710960-129a-4823-aaa8-ee26afbeba77";
export default async function page({
    params,
}: {
    params: { candidatePortalURL: string };
}) {
    const data = await getPortalByURLQuery(params.candidatePortalURL);
    if (!data.portal) return notFound();
    return (
        <>
            {/* <Editor /> */}
            {data.portal.sections?.map((section) => (
                <Editor
                    sectionId={section.id}
                    portalId={section.portalId}
                    key={section.id}
                    content={section.content as YooptaContentValue}
                    editable={false}
                />
            ))}
        </>
    );
}
