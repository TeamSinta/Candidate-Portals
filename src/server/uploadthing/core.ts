import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getUser } from "@/server/auth";
import { getOrganizations } from "@/server/actions/organization/queries";
import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { membersToOrganizations } from "@/server/db/schema";

/**
 * File router for the application
 * learn more about uploadthing here: @see https://docs.uploadthing.com/getting-started/appdir
 */

const f = createUploadthing();

export const ourFileRouter = {
    profilePicture: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            const user = await getUser();

            if (!user) throw new UploadThingError("Unauthorized");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId, url: file.url };
        }),
    orgProfilePicture: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            const user = await getUser();

            if (!user) throw new UploadThingError("Unauthorized");

            const { currentOrg } = await getOrganizations();

            if (!currentOrg)
                throw new UploadThingError({
                    message: "You are not a member of any organization",
                    code: "BAD_REQUEST",
                });

            const memToOrg = await db.query.membersToOrganizations.findFirst({
                where: and(
                    eq(membersToOrganizations.memberId, user.id),
                    eq(membersToOrganizations.organizationId, currentOrg.id),
                    eq(membersToOrganizations.role, "Admin"),
                ),
            });

            if (currentOrg.ownerId === user.id || memToOrg) {
                return { orgId: currentOrg.id, userId: user.id };
            }

            throw new UploadThingError({
                message: "You are not an admin of this organization",
                code: "BAD_REQUEST",
            });
        })
        .onUploadError((error) => {
            return error.error;
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("UPLOAD COMPLETE", metadata, file);
            return {
                uploadedBy: metadata.userId,
                url: file.url,
                orgId: metadata.orgId,
            };
        }),
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await getUser();
            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized");
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            console.log("metadata", metadata);
            console.log("file", file);
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return {
                uploadedBy: metadata.userId,
                url: file.url,
                metadata: metadata,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
