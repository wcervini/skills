# API Routes (auth via session)

API routes are always SSR — `prerender` does not apply. Read the session from `context.locals` (middleware) or validate the cookie directly.

```ts
// src/pages/api/me.ts
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (context) => {
  const user = context.locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  return new Response(JSON.stringify({ id: user.id, email: user.email, name: user.name }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

```ts
// src/pages/api/logout.ts
import type { APIRoute } from 'astro'
import { deleteSessionTokenCookie } from '../../../lib/session';

export const POST: APIRoute = async (context) => {
  const token = context.cookies.get("session")?.value ?? null;
  if (token) {
    // TODO: DELETE FROM sessions WHERE id = sha256(token)
    await deleteSessionByToken(token);
  }
  deleteSessionTokenCookie(context);
  return context.redirect("/");
}
```

## Rules

- Return 401 JSON (not redirects) for API consumers.
- Mutations must re-validate the session — never rely on a user object sent by the client.
