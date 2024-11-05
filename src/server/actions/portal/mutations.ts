"use server";
import { db } from "@/server/db";
import { portal, section, SectionContentType } from "@/server/db/schema";
import { protectedProcedure } from "@/server/procedures";
import { getOrganizations } from "../organization/queries";
import { YooptaContentValue } from "@yoopta/editor";

// portal should be initialized with an initial section
export async function createPortal() {
    const { user } = await protectedProcedure();
    const { currentOrg } = await getOrganizations();

    if (!currentOrg.id || !user.id) throw new Error("Missing data");

    const [newPortal] = await db
        .insert(portal)
        .values({ orgId: currentOrg.id, ownerId: user.id })
        .returning()
        .execute();

    if (!newPortal?.id) throw new Error("Failed to create portal");

    // const newSection = await db.insert(section).values({
    //     portalId: newPortal.id,
    //     title: "title",
    //     content: {},
    //     contentType: SectionContentType.YOOPTA,
    //     index: 0,
    // });
    return newPortal;
}

export async function updateSectionContent({
    id,
    portalId,
    title,
    content,
    contentType,
}: {
    id: string;
    portalId: string;
    title: string;
    content: YooptaContentValue;
    contentType: SectionContentType;
}) {
    return await db
        .insert(section)
        .values({ id, portalId, title, content, contentType })
        .onConflictDoUpdate({ target: section.id, set: { content, title } })
        .execute();
}
