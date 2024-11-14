import { getSectionQuery } from "@/server/actions/portal/queries";
import { notFound } from "next/navigation";
import EditorWrapper from "./_components/editor-wrapper";

async function ContentEditorPage({
    params,
}: {
    params: { sectionId: string };
}) {
    const [data] = await getSectionQuery(params.sectionId);
    if (!data) return notFound();
    const { section, portal } = data;
    // It's gotta be wrapped to be a client component
    return <EditorWrapper section={section} portal={portal} />;
}

export default ContentEditorPage;
