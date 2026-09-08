import { NextRequest } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { uploadImageToS3 } from "@/lib/s3/upload";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api-response";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    await requireSession();
  } catch {
    return unauthorized();
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return badRequest("file is required");
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest("Only JPEG, PNG and WebP images are allowed");
    }
    if (file.size > MAX_SIZE) {
      return badRequest("File must be 10MB or smaller");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, key } = await uploadImageToS3(buffer, file.name, file.type);

    return ok({ url, key });
  } catch (err) {
    console.error("[upload]", err);
    return serverError("Failed to upload image");
  }
}
