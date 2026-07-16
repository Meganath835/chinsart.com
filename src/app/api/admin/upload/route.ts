import { NextRequest } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { getPresignedUploadUrl } from "@/lib/s3/upload";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  try {
    const { fileName, contentType } = await req.json();
    if (!fileName || !contentType) return badRequest("fileName and contentType required");

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(contentType)) return badRequest("Only JPEG, PNG and WebP images are allowed");

    const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
    const key = `artworks/${randomUUID()}.${ext}`;
    const presignedUrl = await getPresignedUploadUrl(key, contentType);

    return ok({ presignedUrl, key });
  } catch {
    return serverError("Failed to generate upload URL");
  }
}
