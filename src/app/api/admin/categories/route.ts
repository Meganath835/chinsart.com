import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { ok, created, badRequest, unauthorized, serverError } from "@/lib/api-response";
import { slugify } from "@/utils";

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function GET() {
  try { await requireSession(); } catch { return unauthorized(); }
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { artworks: true } } },
      orderBy: { name: "asc" },
    });
    return ok(categories);
  } catch { return serverError(); }
}

export async function POST(req: NextRequest) {
  try { await requireSession(); } catch { return unauthorized(); }
  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const slug = slugify(parsed.data.name);
    const category = await prisma.category.create({
      data: { ...parsed.data, slug },
    });
    return created(category);
  } catch { return serverError(); }
}
