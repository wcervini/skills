---
name: astro-base
description: Skill for building with the Astro web framework. Helps create Astro components and pages, configure SSR adapters, set up content collections, deploy static sites, and manage project structure and CLI commands. Use when the user needs to work with Astro, mentions .astro files, astro.config, astro dev/build/check/add/sync, src/pages, asks about static site generation (SSG), islands architecture, web components, custom elements, content collections, or deploying an Astro project. For Google sign-in / OAuth authentication, use the astro-extended skill. For local email/password auth with a database, use the better-auth-best-practices skill.
license: MIT
metadata: 
  authors: "Astro Team"
  version: "0.0.1"
---

# Astro Usage Guide

**Always consult [docs.astro.build](https://docs.astro.build) for code examples and latest API.**

Astro is the web framework for content-driven websites.

## Routing (entry point)

All Astro queries land here first. This skill covers the framework only (routes, config, build, islands without auth) and routes each case onward:

- Framework task (pages, components, config, adapters, SSG, islands without auth) → stay in this skill.
- If the task mentions `clerk`, Google sign-in / OAuth, `sign-in`/`sign-up`, protected pages, auth middleware, or `CLERK_*` / `GOOGLE_*` env variables → invoke the `astro-extended` skill and only return to this skill for structural matters (routes, config, build).
- If the task is local email/password auth with a database → use the `better-auth-best-practices` skill.

---

## Quick Reference

### File Location
CLI looks for `astro.config.js`, `astro.config.mjs`, `astro.config.cjs`, and `astro.config.ts` in: `./`. Use `--config` for custom path.

### CLI Commands

- `npx astro dev` - Start the development server.
- `npx astro build` - Build your project and write it to disk.
- `npx astro check` - Check your project for errors.
- `npx astro add` - Add an integration.
- `npx astro sync` - Generate TypeScript types for all Astro modules
- `npx astro telemetry enable|disable` - This will disable telemetry across your entire machine, not just the project directory that you run it.

**Re-run after adding/changing plugins.**

### Project Structure

Reference [project structure docs](https://docs.astro.build/en/basics/project-structure).

- `src/*` - Project source code (components, pages, styles, images, etc.)
- `src/pages` - **Required.** Defines all pages and routes.
- `src/components` - Components (convention, not required).
- `src/layouts` - Layout components (convention, not required).
- `src/styles` - CSS/Sass files (convention, not required).
- `public/*` - Non-code, unprocessed assets (fonts, icons, etc.); copied as-is to build output.
- `package.json` - Project manifest.
- `astro.config.{js,mjs,cjs,ts}` - Astro configuration file. (recommended)
- `tsconfig.json` - TypeScript configuration file. (recommended)

---

## Core Config Options

| Option | Notes |
|--------|-------|
| `site` | Your final, deployed URL. Used to generate sitemaps and canonical URLs. |

### Example `astro.config.ts`

```ts
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
});
```

---

## Common Workflows

### Creating a Basic Page

Add a file to `src/pages/` — the filename becomes the route:

```astro
---
// src/pages/index.astro
const title = 'Hello, Astro!';
---
<html>
  <head><title>{title}</title></head>
  <body>
    <h1>{title}</h1>
  </body>
</html>
```

### Creating a Component

```astro
---
// src/components/Card.astro
const { title, body } = Astro.props;
---
<div class="card">
  <h2>{title}</h2>
  <p>{body}</p>
</div>
```

### Deploying with an Adapter

1. Add the adapter: `npx astro add vercel --yes` (or `node`, `cloudflare`, `netlify`)
2. Run `npx astro check` to catch type and configuration errors before building.
3. Run `npx astro build` to produce the deployment artifact.
4. Verify the build output directory (e.g. `dist/`) exists and is non-empty before proceeding.
5. Deploy the output per the adapter's documentation.

---

## Adapters

Deploy to your favorite server, serverless, or edge host with build adapters. Use an adapter to enable on-demand rendering in your Astro project.

**Add [Node.js](https://docs.astro.build/en/guides/integrations-guide/node) adapter using astro add:**
```
npx astro add node --yes
```

**Add [Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare) adapter using astro add:**
```
npx astro add cloudflare --yes
```

**Add [Netlify](https://docs.astro.build/en/guides/integrations-guide/netlify) adapter using astro add:**
```
npx astro add netlify --yes
```

**Add [Vercel](https://docs.astro.build/en/guides/integrations-guide/vercel) adapter using astro add:**
```
npx astro add vercel --yes
```

[Other Community adapters](https://astro.build/integrations/2/?search=&categories%5B%5D=adapters)

## Resources

- [Docs](https://docs.astro.build)
- [Config Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [llms.txt](https://docs.astro.build/llms.txt)
- [GitHub](https://github.com/withastro/astro)

## References

- Custom elements in `.astro` pages: see [references/web-components.md](references/web-components.md). Verify SSR behavior against docs.astro.build.

## Veracity (anti-hallucination)

- Do not invent Astro APIs, config options, CLI flags, or adapter behaviors: use only what is documented in this skill, its `references/`, and [docs.astro.build](https://docs.astro.build). Behavior varies by Astro version — never state version-specific behavior without confirming.
- If something is not covered, say so explicitly — "not covered by this skill" — and check the official docs before answering.
- Never present deduced code as verified: mark anything not taken from a skill example as `TODO / verify`.
- When in doubt between two options (including which skill to route to), ask the user instead of choosing silently.
