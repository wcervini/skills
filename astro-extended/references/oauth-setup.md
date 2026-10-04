# OAuth Setup (Google + arctic)

## 1. Google Cloud Console

1. console.cloud.google.com → APIs & Services → Credentials → Create OAuth client (Web application).
2. Authorized redirect URIs: `http://localhost:4321/login/google/callback` + prod URL (exact match, no trailing differences).
3. OAuth consent screen: app name + support email (external = any Google account; internal = Workspace only).

## 2. Install arctic

```bash
npm install arctic
```

## 3. Client singleton

```ts
// src/lib/oauth.ts
import { Google } from "arctic";

const redirectURI =
  import.meta.env.PROD
    ? "https://example.com/login/google/callback"
    : "http://localhost:4321/login/google/callback";

export const google = new Google(
  import.meta.env.GOOGLE_CLIENT_ID,
  import.meta.env.GOOGLE_CLIENT_SECRET,
  redirectURI
);
```

## 4. Astro config

Server rendering required for login/callback/session routes:

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'

export default defineConfig({
  output: 'server', // or hybrid + prerender=false on auth pages
  adapter: node({ mode: 'standalone' }),
})
```
