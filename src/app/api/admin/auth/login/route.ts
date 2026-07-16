import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { comparePassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { loginSchema } from "@/lib/validations/auth";
import { badRequest, serverError, unauthorized } from "@/lib/api-response";
import { AUTH_COOKIE } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.issues[0].message);

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return unauthorized("Invalid credentials");

    const valid = await comparePassword(password, user.password);
    if (!valid) return unauthorized("Invalid credentials");

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({ success: true, message: "Logged in" });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return serverError();
  }
}
