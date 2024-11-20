"use server";
import { db } from "@/server/db";
import {
    portal,
    section,
    SectionContentType,
    SectionInsert,
    SectionSelect,
} from "@/server/db/schema";
import { protectedProcedure } from "@/server/procedures";
import { getOrganizations } from "../organization/queries";
import { YooptaContentValue } from "@yoopta/editor";
import { asc, eq } from "drizzle-orm";

// portal should be initialized with an initial section
interface CreatePortalParams {
  title: string;
}

export async function createPortal({ title }: CreatePortalParams) {
  const { user } = await protectedProcedure();
  const { currentOrg } = await getOrganizations();

  if (!currentOrg.id || !user.id) throw new Error("Missing data");

  const [newPortal] = await db
    .insert(portal)
    .values({ orgId: currentOrg.id, ownerId: user.id, title })
    .returning()
    .execute();

  if (!newPortal?.id) throw new Error("Failed to create portal");

  return newPortal;
}


export async function updateSectionContent({
  id,
  portalId,
  title,
  content,
  contentType,
  index,
}: {
  id: string;
  portalId: string;
  title: string;
  content: YooptaContentValue;
  contentType: SectionContentType;
  index: number;
}) {
  try {
      // Log the inputs to the function
      console.log("updateSectionContent called with:");
      console.log("ID:", id);
      console.log("Portal ID:", portalId);
      console.log("Title:", title);
      console.log("Content:", content);
      console.log("Content Type:", contentType);
      console.log("Index:", index);

      // Perform the database operation
      const result = await db
          .insert(section)
          .values({ id, portalId, title, content, contentType, index })
          .onConflictDoUpdate({
              target: section.id,
              set: { content, title },
          })
          .execute();

      // Log the result of the database operation
      console.log("Database operation successful. Result:", result);

      return result;
  } catch (error) {
      // Log any error that occurs
      console.error("Error in updateSectionContent:", error);
      throw error; // Re-throw the error after logging it
  }
}

export async function reIndexSections(portalId: string) {
    const sections = await db.query.section.findMany({
        where: eq(section.portalId, portalId),
        orderBy: [asc(section.index)],
    });

    const updatePromises = sections.map((block, newIndex) => {
        return db
            .insert(section)
            .values({ ...block, index: newIndex })
            .onConflictDoUpdate({
                target: section.id,
                set: {
                    content: block.content,
                    title: block.title,
                    contentType: block.contentType,
                    index: newIndex,
                },
            })
            .execute();
    });

    await Promise.all(updatePromises);
}

export async function saveSection(data: SectionInsert | undefined) {
    if (!data) return;
    // console.log("data on save", data);
    await db
        .insert(section)
        .values(data)
        .onConflictDoUpdate({
            target: section.id,
            set: {
                content: data.content,
                title: data.title,
                contentType: data.contentType,
                index: data.index,
            },
        })
        .execute();

    await reIndexSections(data.portalId);
}

export async function deleteSection(sectionId: string, portalId: string) {
    await db.delete(section).where(eq(section.id, sectionId));
    await reIndexSections(portalId);
}
