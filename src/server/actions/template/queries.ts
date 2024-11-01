import { db } from "@/server/db";
import {
    candidate,
    candidatePortal,
    section,
    template,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getTemplateQuery(templateId: string) {
    const templateObject = await db.query.template.findFirst({
        where: eq(template.id, templateId),
    });
    if (!templateObject) return {};

    const sections = await db.query.section.findMany({
        where: eq(section.templateId, templateId),
    });
    return { template: templateObject, sections };
}

export async function getTemplateByURLQuery(url: string) {
    const [portal] = await db
        .select()
        .from(candidatePortal)
        .leftJoin(candidate, eq(candidate.id, candidatePortal.candidateId))
        .where(eq(candidatePortal.url, url))
        .limit(1)
        .execute();

    const templateId = portal?.candidatePortal?.templateId;
    if (!templateId) return {};

    return {
        candidate: portal,
        template: await getTemplateQuery(templateId),
    };
}
