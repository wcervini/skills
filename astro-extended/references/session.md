# Sessions (token, cookie, helpers)

Sessions live in YOUR database. Google's ID token expiry (1h) is unrelated to your session lifetime.

## Schema

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY, -- sha256 hex of random 32 bytes
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL -- unix ms, e.g. now + 30 days
);
```

## Helpers

```ts
// src/lib/session.ts
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
  await db.insert(sessions).values({ id: sessionId, userId, expiresAt });
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
  // TODO: SELECT session + user; delete if expired
  return { session, user } | { session: null, user: null };
}

export function deleteSessionTokenCookie(context: APIContext) {
  context.cookies.delete("session", { path: "/" });
}
```

## Rules

- Store the SHA-256 hash in DB, the raw token in the cookie (leaked DB ≠ usable sessions).
- `httpOnly` + `sameSite: lax` always; `secure` in prod.
- Logout = delete session row + delete cookie.
