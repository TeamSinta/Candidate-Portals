// app/queries.ts

import { db } from "@/server/db";
import { link, portal, candidate, section } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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
