"use server";
import { db } from "@/server/db";
import { section, template } from "@/server/db/schema";
import { adminProcedure } from "@/server/procedures";
import { eq } from "drizzle-orm";

export async function updateSectionContent({
    id,
    templateId,
    title,
    content,
}: {
    id: string;
    templateId: string;
    title: string;
    content: any;
}) {
    return await db
        .insert(section)
        .values({ id, templateId, title, content })
        .onConflictDoUpdate({ target: section.id, set: { content, title } })
        .execute();
}
