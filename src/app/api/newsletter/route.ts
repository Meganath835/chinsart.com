import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { newsletterSchema } from "@/lib/validations/contact";
import { ok, badRequest, serverError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const { email } = parsed.data;

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    });

    return ok(null, "Subscribed successfully");
  } catch {
    return serverError("Failed to subscribe");
  }
}
