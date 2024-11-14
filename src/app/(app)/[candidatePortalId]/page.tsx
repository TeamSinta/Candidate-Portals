import Editor from "@/components/editor";
import { getPortalByURLQuery } from "@/server/actions/portal/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { notFound } from "next/navigation";

export default async function page({
    params,
}: {
    params: { candidatePortalURL: string };
}) {
    const data = await getPortalByURLQuery(params.candidatePortalURL);
    if (!data.portal) return notFound();
    return (
        <>
            <div>Candidate Portal Page</div>
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
