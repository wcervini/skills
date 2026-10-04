# Astro-Base Skill

Build with the Astro web framework: components, pages, SSR adapters, content collections, static deploys, project structure and CLI commands.

## Overview

Astro-base covers the framework only:

- **Quick Reference**: config file location, CLI commands (`dev`, `build`, `check`, `add`, `sync`), project structure
- **Core Config**: `site` option and `astro.config.ts` example
- **Workflows**: creating pages (`src/pages/` = routes), components with `Astro.props`, deploying with an adapter
- **Adapters**: Node, Cloudflare, Netlify, Vercel for on-demand rendering
- **Web Components**: custom elements in `.astro` pages, SSR caveats

## Usage

### For Claude Code / AI Agents

Loaded for Astro framework tasks. If the task involves Google sign-in / OAuth, invoke `astro-extended`; for local email/password auth with a database, use `better-auth-best-practices`.

### For Developers

Read `SKILL.md` for the quick reference. Always consult [docs.astro.build](https://docs.astro.build) for code examples and latest API.

## File Structure

```
astro-base/
├── SKILL.md          # Quick reference, routing, workflows, adapters
├── metadata.json     # Version, keywords, routes, sections, sources
├── README.md         # This file
├── references/
│   └── web-components.md  # Custom elements in .astro pages
└── assets/
    └── templates/
        └── page-template.astro  # Page + component template
```

## Key Principles

1. **Static first**: SSG by default; adapters only for on-demand rendering
2. **Pages are routes**: filename in `src/pages/` becomes the route
3. **Verify in docs**: behavior varies by Astro version — confirm at docs.astro.build
4. **Route auth away**: this skill does no auth; see Routing in `SKILL.md`

## References

- [Docs](https://docs.astro.build)
- [Config Reference](https://docs.astro.build/en/reference/configuration-reference/)
- [llms.txt](https://docs.astro.build/llms.txt)
- [GitHub](https://github.com/withastro/astro)
