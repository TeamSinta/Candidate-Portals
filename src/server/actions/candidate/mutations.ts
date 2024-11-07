
"use server";

import { db } from "@/server/db";
import { candidate, createCandidateInsertSchema, createLinkInsertSchema, link } from "@/server/db/schema";
import { getOrganizations } from "../organization/queries";
import { generateCustomUrl } from "@/lib/utils";

export async function createLinkAndCandidateMutation(props: {
    name: string;
    email?: string;
    role?: string;
    stage?: string;
    customContent?: object;
    portalId: string;
    linkedin: string;
}) {
    const { currentOrg } = await getOrganizations();


    const cleanedEmail = props.email && props.email.trim() !== "" ? props.email : undefined;

    // Parse and validate candidate input
    const candidateParse = await createCandidateInsertSchema.safeParseAsync({
        organizationId: currentOrg.id,
        name: props.name,
        linkedin: props.linkedin,
        email: cleanedEmail,
        role: props.role,
        stage: props.stage,
        notes: [], // Assuming you initialize notes as an empty array
    });

    if (!candidateParse.success) {
        throw new Error("Invalid candidate data", {
            cause: candidateParse.error.errors,
        });
    }

    // Insert the candidate into the database
    const createCandidate = await db
        .insert(candidate)
        .values(candidateParse.data)
        .returning()
        .execute();

    const candidateId = createCandidate[0]?.id;
    if (!candidateId) {
        throw new Error("Failed to create candidate");
    }

    // Generate custom URL for the link
    const customUrl = generateCustomUrl();

    // Parse and validate link input
    const linkParse = await createLinkInsertSchema.safeParseAsync({
        candidateId,
        portalId: props.portalId,
        url: customUrl,
        customContent: props.customContent || {},
    });

    if (!linkParse.success) {
        throw new Error("Invalid link data", {
            cause: linkParse.error.errors,
        });
    }

    // Insert the link into the database
    const createLink = await db
        .insert(link)
        .values(linkParse.data)
        .returning()
        .execute();

    if (!createLink[0]) {
        throw new Error("Failed to create link");
    }

    return {
        candidate: createCandidate[0],
        link: createLink[0],
    };
}
