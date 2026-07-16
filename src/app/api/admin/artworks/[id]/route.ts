import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { artworkSchema } from "@/lib/validations/artwork";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/api-response";
import { deleteImageFromS3 } from "@/lib/s3/upload";
import type { UploadedImage } from "@/components/admin/ImageUploader";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { id } = await params;
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] }, category: true },
    });
    if (!artwork) return notFound();
    return ok(artwork);
  } catch { return serverError(); }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = artworkSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const images: UploadedImage[] = body.images ?? [];
    if (images.length === 0) return badRequest("At least one image is required");

    const existing = await prisma.artwork.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!existing) return notFound();

    // Delete S3 images that were removed
    const newKeys = new Set(images.map((img) => img.key));
    const removed = existing.images.filter((img) => !newKeys.has(img.key));
    await Promise.allSettled(removed.map((img) => deleteImageFromS3(img.key)));

    // Replace all images
    const artwork = await prisma.artwork.update({
      where: { id },
      data: {
        ...parsed.data,
        images: {
          deleteMany: {},
          create: images.map((img, i) => ({
            url: img.url,
            key: img.key,
            isPrimary: img.isPrimary,
            sortOrder: i,
          })),
        },
      },
      include: { images: true, category: true },
    });

    return ok(artwork);
  } catch { return serverError(); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { id } = await params;

  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!artwork) return notFound();

    await Promise.allSettled(artwork.images.map((img) => deleteImageFromS3(img.key)));
    await prisma.artwork.delete({ where: { id } });

    return ok(null, "Artwork deleted");
  } catch { return serverError(); }
}
