import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import type { AuthToken } from "@/types";

export const USER_COOKIE = "chinsart_user_token";

export async function getUserSession(): Promise<AuthToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_COOKIE)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
