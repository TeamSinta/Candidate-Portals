"use server";
import { db } from "@/server/db";
import {
    portal,
    section,
    SectionContentType,
    SectionInsert,
    SectionSelect,
} from "@/server/db/schema";
import { protectedProcedure } from "@/server/procedures";
import { getOrganizations } from "../organization/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { asc, eq } from "drizzle-orm";

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
    index,
}: {
    id: string;
    portalId: string;
    title: string;
    content: YooptaContentValue;
    contentType: SectionContentType;
    index: number;
}) {
    return await db
        .insert(section)
        .values({ id, portalId, title, content, contentType, index })
        .onConflictDoUpdate({ target: section.id, set: { content, title } })
        .execute();
}

export async function reIndexSections(portalId: string) {
    const sections = await db.query.section.findMany({
        where: eq(section.portalId, portalId),
        orderBy: [asc(section.index)],
    });

    const updatePromises = sections.map((block, newIndex) => {
        return db
            .insert(section)
            .values({ ...block, index: newIndex })
            .onConflictDoUpdate({
                target: section.id,
                set: {
                    content: block.content,
                    title: block.title,
                    contentType: block.contentType,
                    index: newIndex,
                },
            })
            .execute();
    });

    await Promise.all(updatePromises);
}

export async function saveSection(data: SectionInsert | undefined) {
    if (!data) return;
    await db
        .insert(section)
        .values(data)
        .onConflictDoUpdate({
            target: section.id,
            set: {
                content: data.content,
                title: data.title,
                contentType: data.contentType,
                index: data.index,
            },
        })
        .execute();

    await reIndexSections(data.portalId);
}

export async function deleteSection(sectionId: string, portalId: string) {
    await db.delete(section).where(eq(section.id, sectionId));
    await reIndexSections(portalId);
}
