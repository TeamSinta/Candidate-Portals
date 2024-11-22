"use server";
import {
    DeleteObjectsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { z } from "zod";

const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});
const BUCKET_NAME = "sinta-test";

const formSchema = z.object({
    // orgId: z.string(),
    // portalId: z.string(),
    // sectionId: z.string(),
    file: z.instanceof(Blob),
    fileName: z.string(),
    size: z.string().transform((val) => {
        const num = parseInt(val, 10); // Always specify radix
        if (isNaN(num)) {
            throw new Error("Invalid number");
        }
        return num;
    }),
    type: z.string(),
});

export async function uploadItem(
    formData: FormData,
    portalId: string,
    sectionId: string,
) {
    const parsedData = formSchema.safeParse({
        file: formData.get("file"),
        size: formData.get("size"),
        // orgId: formData.get("orgId"),
        // portalId: formData.get("workflowId"),
        // sectionId: formData.get("sectionId"),
        fileName: formData.get("fileName"),
        type: formData.get("type"),
    });

    console.log("PARSEDDATA", parsedData);
    if (!parsedData.success) {
        console.error("Validation error:", parsedData.error);
        throw new Error("Form data validation failed.");
    }

    const { file, fileName, size, type } = parsedData.data;
    const key = `${portalId}/${sectionId}/${fileName}`;
    // const key = `${orgId}/${portalId}/${sectionId}/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Body: Buffer.from(arrayBuffer),
                Key: key,
                ContentType: type,
            }),
        );
        console.log(`Uploaded ${key}`);
    } catch (e) {
        console.error("Error uploading to S3:", e);
        throw e; // Re-throw the error for further handling if needed
    }

    return {
        url: getS3ObjectURL(portalId, sectionId, fileName),
        // url: getS3ObjectURL(orgId, portalId, sectionId, fileName),
        title: fileName,
        id: key,
    };
}

function getS3ObjectURL(
    // orgId: string,
    portalId: string,
    sectionId: string,
    fileName: string,
) {
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${portalId}/${sectionId}/${fileName}`;
}

export async function deleteS3Images(portalId: string, sectionId?: string) {
    try {
        if (sectionId) {
            await deleteFolder(`${portalId}/${sectionId}`);
        } else {
            await deleteFolder(`${portalId}`);
        }
    } catch (error) {
        console.error("Error deleting folder:", error);
    }
}

async function deleteFolder(folderPrefix: string): Promise<void> {
    const bucketName = BUCKET_NAME;
    try {
        let continuationToken: string | undefined = undefined;

        do {
            // Fetch objects with the given prefix (folder name)
            const listResponse = await s3Client.send(
                new ListObjectsV2Command({
                    Bucket: bucketName,
                    Prefix: folderPrefix,
                    ContinuationToken: continuationToken,
                }),
            );

            // Extract the keys of objects to delete
            const keysToDelete =
                listResponse.Contents?.map((object) => ({ Key: object.Key })) ||
                [];
            if (keysToDelete.length > 0) {
                // Delete the objects in bulk
                await s3Client.send(
                    new DeleteObjectsCommand({
                        Bucket: bucketName,
                        Delete: {
                            Objects: keysToDelete,
                        },
                    }),
                );

                console.log(
                    `Deleted ${keysToDelete.length} objects from ${folderPrefix}`,
                );
            }

            continuationToken = listResponse.NextContinuationToken; // For paginated results
        } while (continuationToken);

        console.log(`Successfully deleted folder: ${folderPrefix}`);
    } catch (error) {
        console.error(`Error deleting folder ${folderPrefix}:`, error);
    }
}
