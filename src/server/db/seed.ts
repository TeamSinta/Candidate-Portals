// src/db/seed.ts
import { Pool } from "pg";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

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
            `INSERT INTO "sinta-candidate-portals_portal" (id, "organizationId", "ownerId")
             VALUES (gen_random_uuid(), $1, $2)
             RETURNING id`,
            ["9c4607f7-e9bd-4b23-b537-7b67d66a39e3", "6cb53420-3d86-444d-94ad-3f2a9f7abba9"]
        );
        const portalId = portalResult.rows[0].id;
        console.log("Portal inserted with ID:", portalId);

        // Insert a candidate
        const candidateResult = await client.query(
            `INSERT INTO "sinta-candidate-portals_candidate" (id, "organizationId", name, email, role, stage, notes)
             VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [
                "9c4607f7-e9bd-4b23-b537-7b67d66a39e3",
                faker.name.fullName(),
                faker.internet.email(),
                faker.name.jobTitle(),
                "Interview",
                JSON.stringify({ text: faker.lorem.sentence() }),
            ]
        );
        const candidateId = candidateResult.rows[0].id;
        console.log("Candidate inserted with ID:", candidateId);

        // Insert sections
        const sectionData = [
            { title: "Section 1", content: { text: faker.lorem.paragraph() }, contentType: "yoopta" },
            { title: "Section 2", content: { text: faker.lorem.paragraph() }, contentType: "url" },
            { title: "Section 3", content: { text: faker.lorem.paragraph() }, contentType: "doc" },
        ];

        for (const section of sectionData) {
            const sectionResult = await client.query(
                `INSERT INTO "sinta-candidate-portals_section" (id, "portalId", title, content, "contentType")
                 VALUES (gen_random_uuid(), $1, $2, $3, $4)
                 RETURNING id`,
                [portalId, section.title, JSON.stringify(section.content), section.contentType]
            );
            console.log(`Section inserted with ID: ${sectionResult.rows[0].id}`);
        }

        // Insert link
        await client.query(
            `INSERT INTO "sinta-candidate-portals_link" (id, "candidateId", "portalId", url, "customContent")
             VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
            [
                candidateId,
                portalId,
                faker.internet.url(),
                JSON.stringify({ note: faker.lorem.sentence() }),
            ]
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
