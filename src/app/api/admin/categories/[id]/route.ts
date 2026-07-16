import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { ok, badRequest, unauthorized, notFound, serverError } from "@/lib/api-response";
import { slugify } from "@/utils";

const categorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

interface Params { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const category = await prisma.category.update({
      where: { id },
      data: { ...parsed.data, slug: slugify(parsed.data.name) },
    });
    return ok(category);
  } catch { return serverError(); }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { id } = await params;
  try {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) return notFound();
    await prisma.category.delete({ where: { id } });
    return ok(null, "Category deleted");
  } catch { return serverError(); }
}
