import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME, getImageUrl } from "./client";
import { randomUUID } from "crypto";

export async function uploadImageToS3(
  file: Buffer,
  originalName: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  const ext = originalName.split(".").pop();
  const key = `artworks/${randomUUID()}.${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return { url: getImageUrl(key), key };
}

export async function deleteImageFromS3(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key })
  );
}

