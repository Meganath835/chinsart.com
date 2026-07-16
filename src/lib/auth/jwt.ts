import { SignJWT, jwtVerify } from "jose";
import type { AuthToken } from "@/types";

const getSecret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? "fallback-secret");

const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export async function signToken(
  payload: Omit<AuthToken, "iat" | "exp">
): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<AuthToken> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as AuthToken;
}
