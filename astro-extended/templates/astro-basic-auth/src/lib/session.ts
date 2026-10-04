import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import type { APIContext } from "astro";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeHexLowerCase(bytes);
}

export async function createSession(token: string, userId: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  // TODO: INSERT INTO sessions (id, user_id, expires_at)
  return { id: sessionId, userId, expiresAt };
}

export function setSessionTokenCookie(context: APIContext, token: string, expiresAt: number) {
  context.cookies.set("session", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    expires: new Date(expiresAt),
  });
}

export async function validateSessionToken(token: string) {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  // TODO: SELECT session + user; return nulls when missing/expired
  return { session: null, user: null } as { session: null; user: null };
}

export function deleteSessionTokenCookie(context: APIContext) {
  context.cookies.delete("session", { path: "/" });
}
