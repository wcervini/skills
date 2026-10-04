# Web Components in Astro

Custom elements inside `.astro` pages/components. Read when the user
wants a `<mi-*>` tag in Astro. Verify specifics against
[docs.astro.build](https://docs.astro.build) — behavior varies by
Astro version and renderer.

## Rules

- Astro passes custom element tags through to the HTML output as-is.
  Light-DOM children and attributes render on the server normally.
- Shadow DOM renders on the client only. The element MUST be defined
  (its script loaded) in the browser before/with use.
- Load the defining script in the page/component that uses the tag:

```astro
---
// src/pages/demo.astro
import "../components/mi-saludo.js";
---
<mi-saludo nombre="Ana">Contenido light-DOM</mi-saludo>
```

- `client:*` directives apply to framework components (React, Vue,
  Svelte…), NOT to custom elements. For custom elements, script
  loading order is the hydration strategy.
- Props flow: static data via attributes (strings); rich or reactive
  data via properties set from a client-side script, not from `.astro`
  frontmatter.
- Events from inside Shadow DOM need `composed: true` to reach
  page-level listeners (see `references/lit.md` in
  `modern-javascript-patterns`).

## SSR caveat

Server output contains the bare tag (and light-DOM children). Anything
rendered exclusively inside Shadow DOM appears only after the browser
runs the defining script — expect unstyled/flat first paint without
a declarative shadow DOM strategy. Confirm current Astro guidance in
the docs before promising SSR behavior.
