import { OAuth2RequestError, decodeIdToken } from "arctic";
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

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const claims = decodeIdToken(tokens.idToken()) as { sub: string; name?: string; email?: string; picture?: string };
    // TODO: find-or-create user by claims.sub, then:
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, claims.sub);
    setSessionTokenCookie(context, sessionToken, session.expiresAt);
    return context.redirect("/");
  } catch (e) {
    if (e instanceof OAuth2RequestError) return new Response("Invalid code", { status: 400 });
    throw e;
  }
}
