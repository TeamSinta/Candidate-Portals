// app/queries.ts

import { db } from "@/server/db";
import { link, portal, candidate, section } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { getOrganizations } from "../organization/queries";
import { protectedProcedure } from "@/server/procedures";

// Define the function to fetch portal data by token
// app/queries.ts

export async function getPortalData(token: string) {
  // Query the link table to find the candidate's portal linked to the token
  const linkData = await db
      .select()
      .from(link)
      .where(eq(link.url, token))
      .execute()
      .then((results) => results[0]);

  if (!linkData) return null;

  // Fetch candidate and portal data associated with the link
  const candidateData = await db
      .select({
          candidateName: candidate.name,
          candidateEmail: candidate.email,
      })
      .from(candidate)
      .where(eq(candidate.id, linkData.candidateId))
      .execute()
      .then((results) => results[0]);

  if (!candidateData) return null;

  const sections = await db
      .select()
      .from(section)
      .where(eq(section.portalId, linkData.portalId))
      .execute();

  return {
      candidateName: candidateData.candidateName,
      candidateEmail: candidateData.candidateEmail,
      customContent: linkData.customContent as object | string | null, // Explicitly type it here
      sections: sections.map((section) => ({
          title: section.title,
          content: section.content as string, // Ensure content is string for rendering
          contentType: section.contentType,
      })),
  };
}



// Define the function to fetch portal list data
export async function getPortalListData() {
  const { user } = await protectedProcedure();
  const { currentOrg } = await getOrganizations();

  // Fetch portal data, including the title
  const portalData = await db
    .select({
      portalId: portal.id,
      ownerId: portal.ownerId,
      orgId: portal.orgId,
      title: portal.title,
    })
    .from(portal)
    .where(and(eq(portal.orgId, currentOrg.id), eq(portal.ownerId, user.id)))
    .execute();

  if (portalData.length === 0) return null;

  // Fetch linked data and sections for each portal
  const portals = await Promise.all(
    portalData.map(async (portal) => {
      const linkData = await db
        .select({
          candidateId: link.candidateId,
          url: link.url,
        })
        .from(link)
        .where(eq(link.portalId, portal.portalId))
        .execute();

      const sections = await db
        .select({
          title: section.title,
          content: section.content,
          contentType: section.contentType,
        })
        .from(section)
        .where(eq(section.portalId, portal.portalId))
        .execute();

      return {
        portalId: portal.portalId,
        ownerId: portal.ownerId,
        orgId: portal.orgId,
        title: portal.title || "Untitled", // Use portal title
        url: linkData[0]?.url || "#",
        sections: sections.map((sec) => ({
          title: sec.title || "",
          content: sec.content,
          contentType: sec.contentType,
        })),
      };
    })
  );

  return portals;
}
