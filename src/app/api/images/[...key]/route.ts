import { type NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/s3/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: parts } = await params;
  const key = parts.join("/");

  try {
    const obj = await s3Client.send(
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key })
    );

    const stream = obj.Body?.transformToWebStream();
    if (!stream) return new NextResponse("Not found", { status: 404 });

    return new Response(stream, {
      headers: {
        "Content-Type": obj.ContentType ?? "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(obj.ContentLength ?? ""),
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
