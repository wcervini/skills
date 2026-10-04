# Astro-Extended Skill

Google sign-in / OAuth for Astro with `arctic`: login route, OAuth callback, sessions in your own DB, middleware, protected SSR pages, API route auth.

## Overview

No external auth service: Google is only the identity provider. `arctic` handles the OAuth dance (authorization URL, PKCE, code exchange); users and sessions live in your database.

- **Setup**: Google Cloud OAuth client + `arctic` singleton + server/hybrid Astro config
- **Login route**: state + PKCE verifier as httpOnly cookies, redirect to Google
- **Callback**: verify state, exchange code, find-or-create user by `sub`, create session
- **Sessions**: token + `sessions` table + cookie helpers (hash in DB, raw token in cookie)
- **Middleware**: validate session cookie, protect route patterns, expose `Astro.locals.user`
- **SSR pages**: read session in frontmatter, `prerender = false`, props to islands
- **API routes**: 401 JSON when unauthenticated, re-validate on mutations

## Usage

### For Claude Code / AI Agents

Loaded for Google OAuth tasks on Astro. Local email/password auth → `better-auth-best-practices`. Framework-only → `astro-base`.

### For Developers

Read `SKILL.md` for the mental model, setup, pitfalls and import map; each `references/*.md` for copy-paste code. DB queries are marked TODO — adapt to Drizzle/SQLite (`drizzle`, `sqlite-database-expert` skills).

## File Structure

```
astro-extended/
├── SKILL.md          # Mental model, setup, schema, pitfalls, import map
├── metadata.json     # Version, keywords, routes, sections, sources
├── README.md         # This file
├── references/       # 7 guides (setup → login → callback → session → middleware → ssr → api)
│   ├── oauth-setup.md
│   ├── login-route.md
│   ├── callback-route.md
│   ├── session.md
│   ├── middleware.md
│   ├── ssr-pages.md
│   └── api-routes.md
├── templates/
│   └── astro-basic-auth/  # Runnable scaffold (config, middleware, lib, routes)
├── evals/
│   └── evals.json    # 6 evals for the OAuth flow
└── assets/
    └── templates/
        └── login-route.ts  # Login route snippet
```

## Key Principles

1. **arctic ends at tokens**: users + sessions are your DB code, keyed by `sub`
2. **State + PKCE always**: never skip CSRF/PKCE in the login route
3. **Hash in DB, raw in cookie**: leaked DB must not yield usable sessions
4. **ID token exp ≠ session**: your `sessions.expires_at` rules
5. **Prerender skips auth**: protected pages must be SSR

## References

- [Lucia Google OAuth on Astro](https://lucia-auth.com/tutorials/google-oauth/astro)
- [arctic Google provider](https://v1.arcticjs.dev/providers/google)
- [arctic OAuth2 + PKCE](https://v1.arcticjs.dev/guides/oauth2-pkce)
- [Verify Google ID token](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
