import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { USER_COOKIE } from "@/lib/auth/user-session";
import { registerSchema } from "@/lib/validations/user";
import { ok, badRequest, serverError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);
    if (!result.success) return badRequest(result.error.issues[0].message);

    const { name, email, password } = result.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return badRequest("An account with this email already exists");

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: "USER" },
    });

    const token = await signToken({ userId: user.id, name: user.name, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set(USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return serverError("Failed to create account");
  }
}
