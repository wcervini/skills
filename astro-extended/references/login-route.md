# Login Route (authorization URL + PKCE)

`GET /login/google`: generate `state` + PKCE verifier, store as httpOnly cookies (10 min), redirect to Google.

```ts
// src/pages/login/google/index.ts
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "../../../lib/oauth";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);

  const cookieOpts = {
    path: "/",
    secure: import.meta.env.PROD, // false on localhost HTTP
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax" as const,
  };
  context.cookies.set("google_oauth_state", state, cookieOpts);
  context.cookies.set("google_code_verifier", codeVerifier, cookieOpts);

  return context.redirect(url.toString());
}
```

Login page links here:

```astro
<!-- src/pages/login.astro -->
<a href="/login/google">Sign in with Google</a>
```

## Rules

- `state` prevents CSRF; PKCE (`codeVerifier`) secures the code exchange. Never skip either.
- Cookies must be `httpOnly` + `sameSite: lax`; `secure` only in prod (localhost is HTTP).
