import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
export const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL ?? "";

export function getImageUrl(key: string): string {
  if (CLOUDFRONT_URL) return `${CLOUDFRONT_URL}/${key}`;
  // Relative path served through the internal presigned-redirect proxy.
  // Never uses client-side env vars (BUCKET_NAME etc. are server-only).
  return `/api/images/${key}`;
}
