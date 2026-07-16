import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { artworkSchema } from "@/lib/validations/artwork";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { slugify } from "@/utils";
import type { UploadedImage } from "@/components/admin/ImageUploader";

export async function GET(req: NextRequest) {
  try {
    await requireSession();
  } catch { return unauthorized(); }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        include: { category: true, images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.artwork.count(),
    ]);
    return ok({ artworks, total });
  } catch { return serverError(); }
}

export async function POST(req: NextRequest) {
  try { await requireSession(); } catch { return unauthorized(); }

  try {
    const body = await req.json();
    const parsed = artworkSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const images: UploadedImage[] = body.images ?? [];
    if (images.length === 0) return badRequest("At least one image is required");

    const { title, ...rest } = parsed.data;

    let slug = slugify(title);
    // Ensure slug uniqueness
    const existing = await prisma.artwork.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const artwork = await prisma.artwork.create({
      data: {
        title,
        slug,
        ...rest,
        images: {
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

    return created(artwork);
  } catch { return serverError(); }
}
