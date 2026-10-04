# Callback Route (tokens, user, session)

`GET /login/google/callback`: verify `state`, exchange code, find-or-create user by `sub`, create session, set cookie.

```ts
// src/pages/login/google/callback.ts
import { OAuth2RequestError } from "arctic";
import { decodeIdToken } from "arctic";
import { google } from "../../../lib/oauth";
import { generateSessionToken, createSession, setSessionTokenCookie } from "../../../lib/session";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("google_oauth_state")?.value ?? null;
  const codeVerifier = context.cookies.get("google_code_verifier")?.value ?? null;
  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response("Invalid state", { status: 400 });
  }

  let claims: { sub: string; name?: string; email?: string; picture?: string };
  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    claims = decodeIdToken(tokens.idToken()) as typeof claims;
  } catch (e) {
    if (e instanceof OAuth2RequestError) return new Response("Invalid code", { status: 400 });
    throw e;
  }

  // TODO: replace with your DB (drizzle / sqlite-database-expert skills)
  const existingUser = await getUserFromGoogleId(claims.sub);
  const user = existingUser ?? await createUser({
    googleId: claims.sub, // stable key — never key by email
    email: claims.email!,
    name: claims.name ?? "",
    picture: claims.picture ?? "",
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(context, sessionToken, session.expiresAt);
  return context.redirect("/");
}
```

## Rules

- Always compare `state` before exchanging the code.
- Key users by `claims.sub` (`google_id` UNIQUE), never by email.
- Optionally use the `userinfo` endpoint instead of the ID token: `GET https://www.googleapis.com/oauth2/v3/userinfo` with the access token.
