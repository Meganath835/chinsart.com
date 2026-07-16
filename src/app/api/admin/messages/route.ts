import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireSession } from "@/lib/auth/session";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try { await requireSession(); } catch { return unauthorized(); }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  try {
    const messages = await prisma.contactMessage.findMany({
      where: status && status !== "all" ? { status: status as "UNREAD" | "READ" | "REPLIED" } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return ok(messages);
  } catch { return serverError(); }
}
