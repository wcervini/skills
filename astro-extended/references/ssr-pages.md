# SSR Pages (protected)

Read the session from `Astro.locals` (populated by middleware) in frontmatter. Redirect when anonymous.

```astro
---
// src/pages/dashboard.astro
export const prerender = false; // required: prerendered pages skip middleware
const user = Astro.locals.user;
if (!user) return Astro.redirect('/login');
---
<h1>Welcome, {user.name}</h1>
```

## Session state in islands

Islands hydrate on the client and cannot read the cookie directly. Pass session data as props from SSR:

```astro
---
// src/pages/index.astro
import UserNav from '../components/UserNav.tsx';
const user = Astro.locals.user;
---
<UserNav client:load user={user} />
```

```tsx
// src/components/UserNav.tsx
export function UserNav({ user }: { user: { name: string } | null }) {
  if (!user) return <a href="/login/google">Sign in with Google</a>;
  return <span>{user.name} <a href="/logout">Sign out</a></span>;
}
```

## Rules

- Protected pages MUST NOT have `export const prerender = true`; opt out per page with `export const prerender = false`.
- Never trust client-passed user data for authorization — re-validate the session server-side on every mutation.
- Logout route: delete session row + cookie, redirect to `/`.
