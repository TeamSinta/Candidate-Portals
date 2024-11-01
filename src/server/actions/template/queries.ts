import { db } from "@/server/db";
import { section, template } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { StringDecoder } from "string_decoder";

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
