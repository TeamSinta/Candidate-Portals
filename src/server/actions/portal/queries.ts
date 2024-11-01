import { db } from "@/server/db";
import { candidate, link, section, portal } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getPortalQuery(portalId: string) {
    const portalObject = await db.query.portal.findFirst({
        where: eq(portal.id, portalId),
    });
    if (!portalObject) return {};

    const sections = await db.query.section.findMany({
        where: eq(section.portalId, portalId),
    });
    return { portal: portalObject, sections };
}

export async function getPortalByURLQuery(url: string) {
    const [portal] = await db
        .select()
        .from(link)
        .leftJoin(candidate, eq(candidate.id, link.candidateId))
        .where(eq(link.url, url))
        .limit(1)
        .execute();

    const portalId = portal?.link?.portalId;
    if (!portalId) return {};

    return {
        candidate: portal,
        portal: await getPortalQuery(portalId),
    };
}
