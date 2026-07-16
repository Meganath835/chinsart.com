import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { contactSchema } from "@/lib/validations/contact";
import { ok, badRequest, serverError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const { name, email, subject, message } = parsed.data;

    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return ok(null, "Message sent successfully");
  } catch {
    return serverError("Failed to send message");
  }
}
