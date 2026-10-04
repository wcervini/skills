import { generateState, generateCodeVerifier } from "arctic";
import { google } from "../../../lib/oauth";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  const cookieOpts = {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax" as const,
  };
  context.cookies.set("google_oauth_state", state, cookieOpts);
  context.cookies.set("google_code_verifier", codeVerifier, cookieOpts);

  return context.redirect(url.toString());
}
