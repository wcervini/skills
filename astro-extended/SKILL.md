---
name: astro-extended
description: 'Google sign-in / OAuth for Astro with arctic — login route, OAuth callback, sessions, middleware, protected SSR pages, API route auth, hybrid rendering. Triggers on: google oauth astro, sign in with google, google login astro, arctic, oauth callback, protected page astro, google session cookie. For local email/password auth with a database, use the better-auth-best-practices skill.'
license: MIT
metadata:
  author: google
  version: 1.0.0
---

# Google OAuth on Astro (arctic)

Sign in with Google via OAuth 2.0 authorization-code + PKCE using the `arctic` library. Requires Astro with a server adapter (`output: 'server'` or hybrid). No external auth service: Google is only the identity provider; users and sessions live in your own database.

Entry: Astro queries normally arrive routed from `astro-base` (the entry point). If loaded directly, confirm the task is Google OAuth — otherwise route back (`astro-base` for framework, `better-auth-best-practices` for local auth).

## When NOT to Use This Skill

- Local email/password auth with a database (registration, hashing, credentials) → use the `better-auth-best-practices` skill.
- Framework-only tasks (routes, config, build, static content) → use the `astro-base` skill.

## arctic vs better-auth

- `arctic` direct (this skill): full control, manual PKCE/state/cookies, 4 DB queries you write yourself. Best when you want zero magic and own the session scheme.
- `better-auth` (other skill): integrated DB adapters (Drizzle/Prisma), plugins, less code. Best for local credentials or when you want batteries included.

## What Do You Need?

| Task | Reference |
|------|-----------|
| Google Cloud console + arctic setup | references/oauth-setup.md |
| Login route (authorization URL + PKCE) | references/login-route.md |
| OAuth callback (tokens, user, session) | references/callback-route.md |
| Sessions (token, cookie, helpers) | references/session.md |
| Protect routes via middleware | references/middleware.md |
| Protect SSR pages | references/ssr-pages.md |
| Auth in API routes | references/api-routes.md |

## Mental Model

OAuth code flow with sessions in your own DB:

```
User → /login/google → Google sign-in → /login/google/callback
  → find-or-create user (users.google_id = sub) → session cookie
  → middleware reads session → Astro.locals.user
```

`arctic` ends at step 3 (tokens + profile). Everything after (users table, sessions table, cookies) is your code — any DB works (`drizzle` / `sqlite-database-expert` skills fit here).

## Setup

### Google Cloud Console

1. Create an OAuth client (Web application) at console.cloud.google.com.
2. Authorized redirect URI: `http://localhost:4321/login/google/callback` (plus prod URL).
3. Copy client ID + secret to `.env`:

```
# .env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
```

Astro uses `PUBLIC_` prefix for client-exposed variables — these two are server-only, no prefix.

### arctic client

```ts
// src/lib/oauth.ts
import { Google } from "arctic";

export const google = new Google(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:4321/login/google/callback"
);
```

### astro.config.mjs

```ts
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'

export default defineConfig({
  output: 'server', // or hybrid + prerender=false on protected pages
  adapter: node({ mode: 'standalone' }),
})
```

> Content site with only a few protected pages? Prefer hybrid: keep `output` static and set `export const prerender = false` on login/callback/protected pages. Full-auth app? Global `output: 'server'` is fine.

## DB Schema (minimal)

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL, -- claims.sub, stable key (email can change)
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT
);
CREATE TABLE sessions (
  id TEXT PRIMARY KEY, -- random token (sha256 hex)
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at INTEGER NOT NULL
);
```

## Env Variables

```
# .env (server-only, no PUBLIC_ prefix)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxx
```

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `state` mismatch / 400 on callback | Cookies lost or compared wrong | Compare `state` param vs `google_oauth_state` cookie; httpOnly, `sameSite: lax`, 10min maxAge |
| `redirect_uri_mismatch` | URI not registered | Register exact callback URL in Cloud Console (dev + prod) |
| Auth works locally, not in prod | `secure: true` missing / HTTP | `secure: import.meta.env.PROD`, HTTPS in prod |
| User logged out after 1h | Confusing ID token exp with session | ID token exp (1h) is not your session; your `sessions.expires_at` rules |
| Wrong user matched | Keyed by email | Always key by `claims.sub` (`google_id`); email can change |
| Static page shows logged-out state | Prerendered page skips middleware/session | `export const prerender = false` or fetch session client-side |

## Import Map

| What | Import From |
|------|-------------|
| `Google` | `arctic` |
| `generateState`, `generateCodeVerifier`, `decodeIdToken` | `arctic` |
| `OAuth2RequestError` | `arctic` |

## Docs

- [Lucia Google OAuth on Astro tutorial](https://lucia-auth.com/tutorials/google-oauth/astro)
- [arctic Google provider](https://v1.arcticjs.dev/providers/google)
- [arctic OAuth2 + PKCE guide](https://v1.arcticjs.dev/guides/oauth2-pkce)
- [Verify Google ID token (server)](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)

## Veracity (anti-hallucination)

- Do not invent `arctic` APIs, OAuth endpoints, token claims, or session behaviors: use only what is documented in this skill, its `references/`, and the docs above. Security-sensitive code (state, PKCE, cookies, session validation) must come from skill examples, never from deduction.
- If something is not covered, say so explicitly — "not covered by this skill" — and check the official docs before answering.
- Never present auth code as verified without walking the full flow (login → callback → session → middleware). Mark gaps as `TODO / verify`.
- When in doubt between two options, ask the user instead of choosing silently.
