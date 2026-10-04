# Middleware (session-based route protection)

Validate the `session` cookie on every request; expose `user`/`session` on `Astro.locals`.

```ts
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from "./lib/session";

const PROTECTED = [/^\/dashboard(\/.*)?$/, /^\/api\/private(\/.*)?$/];

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("session")?.value ?? null;
  if (!token) {
    context.locals.user = null;
    context.locals.session = null;
    if (PROTECTED.some((re) => re.test(context.url.pathname))) {
      return context.redirect("/login");
    }
    return next();
  }

  const { session, user } = await validateSessionToken(token);
  if (!session) {
    deleteSessionTokenCookie(context);
    context.locals.user = null;
    context.locals.session = null;
    if (PROTECTED.some((re) => re.test(context.url.pathname))) {
      return context.redirect("/login");
    }
    return next();
  }

  // Refresh long-lived sessions (optional sliding window)
  context.locals.user = user;
  context.locals.session = session;
  return next();
});
```

```ts
// src/env.d.ts — type the locals
declare namespace App {
  interface Locals {
    user: { id: string; email: string; name: string } | null;
    session: { id: string; expiresAt: number } | null;
  }
}
```

## Rules

- Middleware is skipped for `export const prerender = true` pages — protected pages must be SSR.
- Public pages: set locals to null and `next()`; never redirect.
- Refresh the cookie when the session is renewed (sliding expiration).
