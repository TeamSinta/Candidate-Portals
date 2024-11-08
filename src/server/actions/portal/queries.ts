// app/queries.ts

import { db } from "@/server/db";
import { link, portal, candidate, section } from "@/server/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getOrganizations } from "../organization/queries";
import { protectedProcedure } from "@/server/procedures";

export async function getPortalData(token: string) {
    // Query the link table to find the candidate's portal linked to the token
    const linkData = await db
        .select({
            id: link.id, // Adding link_id
            portalId: link.portalId, // Adding portal_id
            candidateId: link.candidateId, // Needed for fetching candidate data
            customContent: link.customContent,
        })
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
            userId: candidate.id, // Adding user_id
        })
        .from(candidate)
        .where(eq(candidate.id, linkData.candidateId))
        .execute()
        .then((results) => results[0]);

    if (!candidateData) return null;

    const sections = await db
        .select({
            id: section.id, // Adding section_id
            title: section.title,
            content: section.content,
            contentType: section.contentType,
        })
        .from(section)
        .where(eq(section.portalId, linkData.portalId))
        .execute();

    return {
        candidateName: candidateData.candidateName,
        candidateEmail: candidateData.candidateEmail,
        userId: candidateData.userId, // Including user_id
        portalId: linkData.portalId, // Including portal_id
        linkId: linkData.id, // Including link_id
        customContent: linkData.customContent as object | string | null, // Explicitly type it here
        sections: sections.map((section) => ({
            sectionId: section.id, // Including section_id
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
        .where(
            and(eq(portal.orgId, currentOrg.id), eq(portal.ownerId, user.id)),
        )
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
        }),
    );

    return portals;
}




export async function getPortalDetails(portalId: string) {
  // Fetch the current organization to filter candidates
  const { currentOrg } = await getOrganizations();
  const orgId = currentOrg.id;

  // Fetch portal information
  const portalData = await db
      .select({
          portalId: portal.id,
          title: portal.title,
      })
      .from(portal)
      .where(eq(portal.id, portalId))
      .execute()
      .then((results) => results[0]);

  if (!portalData) return null;

  // Fetch sections associated with the portal
  const sections = await db
      .select({
          contentType: section.contentType,
          title: section.title,
          section_id: section.id,
      })
      .from(section)
      .where(eq(section.portalId, portalId))
      .execute();

  // Fetch links associated with the portal
  const links = await db
      .select({
          url: link.url,
          candidateId: link.candidateId,
          id: link.id
      })
      .from(link)
      .where(eq(link.portalId, portalId))
      .execute();

  // Collect candidate IDs from links
  const candidateIds = links.map((link) => link.candidateId);

  // Fetch candidates associated with the portal and current organization
  const candidates = await db
      .select({
          name: candidate.name,
          email: candidate.email,
          role: candidate.role,
          linkedin: candidate.linkedin,
          candidateId: candidate.id,
      })
      .from(candidate)
      .where(
          and(
              inArray(candidate.id, candidateIds), // Use inArray for filtering by candidate IDs
              eq(candidate.organizationId, orgId) // Combine with organization ID check
          )
      )
      .execute();

  // Return the data in the required format
  return {
      portal: {
          portalId: portalData.portalId,
          title: portalData.title,
      },
      sections: sections.map((section) => ({
          contentType: section.contentType,
          title: section.title,
          section_id: section.section_id
      })),
      links: links.map((link) => ({
          url: link.url,
          candidateId: link.candidateId,
          linkId: link.id,
      })),
      candidates: candidates.map((candidate) => ({
          name: candidate.name,
          email: candidate.email,
          role: candidate.role,
          linkedin: candidate.linkedin,
          candidateId: candidate.candidateId,
      })),
  };
}
