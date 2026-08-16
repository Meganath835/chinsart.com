import { cookies } from "next/headers";
import { USER_COOKIE } from "@/lib/auth/user-session";
import { ok } from "@/lib/api-response";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(USER_COOKIE);
  return ok({ message: "Logged out" });
}
