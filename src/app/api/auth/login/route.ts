import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { comparePassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { USER_COOKIE } from "@/lib/auth/user-session";
import { userLoginSchema } from "@/lib/validations/user";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = userLoginSchema.safeParse(body);
    if (!result.success) return badRequest(result.error.issues[0].message);

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "USER") return unauthorized("Invalid email or password");

    const valid = await comparePassword(password, user.password);
    if (!valid) return unauthorized("Invalid email or password");

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
    return serverError("Failed to login");
  }
}
