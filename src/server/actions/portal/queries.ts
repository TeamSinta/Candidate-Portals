"use server";
import { db } from "@/server/db";
import {
    link,
    portal,
    candidate,
    section,
    organizations,
    users,
} from "@/server/db/schema";
import { and, asc, eq, inArray } from "drizzle-orm";
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

    // Fetch candidate data associated with the link
    const candidateData = await db
        .select({
            candidateName: candidate.name,
            candidateEmail: candidate.email,
            roleTitle: candidate.role, // Adding role title
            organizationId: candidate.organizationId, // Adding organizationId to link to organizations table
        })
        .from(candidate)
        .where(eq(candidate.id, linkData.candidateId))
        .execute()
        .then((results) => results[0]);

    if (!candidateData) return null;

    // Fetch organization name using organizationId
    const organizationData = await db
        .select({
            orgName: organizations.name, // Fetch organization name
            ownerId: organizations.ownerId,
        })
        .from(organizations)
        .where(eq(organizations.id, candidateData.organizationId))
        .execute()
        .then((results) => results[0]);

    if (!organizationData) return null;

    // Fetch user data using organization ownerId from the organizations table
    const userData = await db
        .select({
            userName: users.name,
            userId: users.id // Fetch user name
        })
        .from(users)
        .where(eq(users.id, organizationData.ownerId))
        .execute()
        .then((results) => results[0]);

    if (!userData) return null;

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
        roleTitle: candidateData.roleTitle, // Include role title
        orgName: organizationData.orgName, // Include organization name
        userName: userData.userName,
        userId: userData.userId,// Include user name
        portalId: linkData.portalId, // Include portal_id
        linkId: linkData.id, // Include link_id
        customContent: linkData.customContent as object | string | null, // Explicitly type it here
        sections: sections.map((section) => ({
            sectionId: section.id, // Include section_id
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
    if (!currentOrg) return [];

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
                title: portal.title ?? "Untitled", // Use portal title
                url: linkData[0]?.url ?? "#",
                sections: sections.map((sec) => ({
                    title: sec.title ?? "",
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
            sectionContent: section.content
        })
        .from(section)
        .where(eq(section.portalId, portalId))
        .execute();

    // Fetch links associated with the portal
    const links = await db
        .select({
            url: link.url,
            candidateId: link.candidateId,
            id: link.id,
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
                eq(candidate.organizationId, orgId), // Combine with organization ID check
            ),
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
            section_id: section.section_id,
            content: section.sectionContent
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

export async function getPortalQuery(portalId: string) {
    const portalObject = await db.query.portal.findFirst({
        where: eq(portal.id, portalId),
    });
    if (!portalObject) return {};

    const sections = await db.query.section.findMany({
        where: eq(section.portalId, portalId),
        orderBy: [asc(section.index)],
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

export async function updatePortalData(portalId: string, data: object) {
    await db.update(portal).set(data).where(eq(portal.id, portalId)).execute();
}

export async function getSectionQuery(sectionId: string) {
    const res = await db
        .select()
        .from(section)
        .where(eq(section.id, sectionId))
        .innerJoin(portal, eq(portal.id, section.portalId))
        .execute();
    return res;
}
