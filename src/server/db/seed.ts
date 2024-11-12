// src/db/seed.ts
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Ensure DATABASE_URL is defined
if (!("DATABASE_URL" in process.env)) {
    throw new Error("DATABASE_URL not found in .env.development");
}

const main = async () => {
    const client = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log("Seeding start");

        // Insert a portal
        const portalResult = await client.query(
            `INSERT INTO "sinta-candidate-portals_portal" (id, "organizationId", "ownerId", title)
             VALUES (gen_random_uuid(), $1, $2, $3)
             RETURNING id`,
            [
                "9c4607f7-e9bd-4b23-b537-7b67d66a39e3", // organizationId
                "6cb53420-3d86-444d-94ad-3f2a9f7abba9", // ownerId
                "Sample Portal Title", // Title
            ],
        );
        const portalId = portalResult.rows[0].id;
        console.log("Portal inserted with ID:", portalId);

        // Insert a candidate
        const candidateResult = await client.query(
            `INSERT INTO "sinta-candidate-portals_candidate" (id, "organizationId", name, email, role, linkedin, "createdAt", "updatedAt", notes)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW(), $6)
             RETURNING id`,
            [
                "9c4607f7-e9bd-4b23-b537-7b67d66a39e3", // organizationId
                faker.person.fullName(), // Name
                faker.internet.email(), // Email
                faker.person.jobTitle(), // Role
                faker.internet.url(), // Linkedin (used as stage)
                JSON.stringify([{ text: faker.lorem.sentence() }]), // Notes
            ],
        );
        const candidateId = candidateResult.rows[0].id;
        console.log("Candidate inserted with ID:", candidateId);

        // Insert sections with updated content types
        const sectionData = [
            {
                title: "Section 1",
                content: { text: faker.lorem.paragraph() },
                contentType: "Notion Editor",
                index: 0,
            },
            {
                title: "Section 2",
                content: { text: faker.lorem.paragraph() },
                contentType: "Link",
                index: 1,
            },
            {
                title: "Section 3",
                content: { text: faker.lorem.paragraph() },
                contentType: "Document",
                index: 2,
            },
            {
                title: "Section 4",
                content: { text: faker.lorem.paragraph() },
                contentType: "notion",
                index: 3,
            },
            {
                title: "Section 5",
                content: { text: faker.lorem.paragraph() },
                contentType: "pdf",
                index: 4,
            },
        ];

        for (const section of sectionData) {
            const sectionResult = await client.query(
                `INSERT INTO "sinta-candidate-portals_section" (id, "portalId", title, content, "contentType", index)
                 VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
                 RETURNING id`,
                [
                    portalId,
                    section.title,
                    JSON.stringify(section.content),
                    section.contentType,
                    section.index,
                ],
            );
            console.log(`Section inserted with ID: ${sectionResult.rows[0].id}`);
        }

        // Insert link
        await client.query(
            `INSERT INTO "sinta-candidate-portals_link" (id, "candidateId", "portalId", url, "customContent", "createdAt", "updatedAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())`,
            [
                candidateId,
                portalId,
                faker.internet.url(), // URL
                JSON.stringify({ note: faker.lorem.sentence() }), // Custom content
            ],
        );
        console.log("Link inserted");
    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        await client.end();
        console.log("Seeding complete");
    }
};

main().catch((err) => {
    console.error("Error seeding database:", err);
});
