"use server";
import { db } from "@/server/db";
import { section, template } from "@/server/db/schema";
import { protectedProcedure } from "@/server/procedures";
import { getOrganizations } from "../organization/queries";
import { YooptaContentValue } from "@yoopta/editor";

// Templates should be initialized with an initial section
export async function createTemplate() {
    const { user } = await protectedProcedure();
    const { currentOrg } = await getOrganizations();

    if (!currentOrg.id || !user.id) throw new Error("Missing data");

    const [newTemplate] = await db
        .insert(template)
        .values({ orgId: currentOrg.id, ownerId: user.id })
        .returning()
        .execute();

    if (!newTemplate?.id) throw new Error("Failed to create template");

    const newSection = await db.insert(section).values({
        templateId: newTemplate.id,
        title: "title",
        content: {},
    });
    return newTemplate;
}

export async function updateSectionContent({
    id,
    templateId,
    title,
    content,
}: {
    id: string;
    templateId: string;
    title: string;
    content: YooptaContentValue;
}) {
    return await db
        .insert(section)
        .values({ id, templateId, title, content })
        .onConflictDoUpdate({ target: section.id, set: { content, title } })
        .execute();
}
