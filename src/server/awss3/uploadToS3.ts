"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});
const BUCKET_NAME = "sinta-test";

export async function uploadItem(
    file: Blob,
    // orgId: string,
    portalId: string,
    sectionId: string,
    fileName: string,
    type: string,
) {
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

export function getUploadFunction(
    // orgId: string,
    portalId: string,
    sectionId: string,
) {
    return async function (formData: FormData) {
        const parsedData = formSchema.safeParse({
            file: formData.get("file"),
            size: formData.get("size"),
            // orgId: formData.get("orgId"),
            // portalId: formData.get("workflowId"),
            // sectionId: formData.get("sectionId"),
            fileName: formData.get("fileName"),
            type: formData.get("type"),
        });
        if (!parsedData.success) {
            console.error("Validation error:", parsedData.error);
            throw new Error("Form data validation failed.");
        }
        const { file, fileName, size, type } = parsedData.data;
        return uploadItem(file, portalId, sectionId, fileName, type);
    };
}
