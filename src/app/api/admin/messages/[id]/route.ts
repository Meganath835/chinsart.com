import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api-response";

const schema = z.object({ status: z.enum(["UNREAD", "READ", "REPLIED"]) });
interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return badRequest("Invalid status");
    const message = await prisma.contactMessage.update({ where: { id }, data: parsed.data });
    return ok(message);
  } catch { return serverError(); }
}
