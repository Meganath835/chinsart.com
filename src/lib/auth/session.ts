import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import type { AuthToken } from "@/types";

export const AUTH_COOKIE = "chinsart_token";

export async function getSession(): Promise<AuthToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AuthToken> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
