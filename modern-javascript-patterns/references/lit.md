# Lit

Reactive web components via LitElement. Read when vanilla
(`references/web-components.md`) gets painful: reactive state,
complex templates, frequent re-renders.

## Setup

Lit is a package — explain `import`, specifiers, and types, never
assume the user knows it:

```bash
npm i lit
```

## Minimal element

```js
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("mi-contador")
class MiContador extends LitElement {
  static styles = css`
    :host { display: inline-block; }
    button { font-size: 1.2rem; }
  `;

  @property({ type: Number }) valor = 0; // public, reflected as attribute
  @state() _privado = 0;                 // internal reactive state

  #sumar() {
    this.valor += 1;
  }

  render() {
    return html`
      <button @click=${this.#sumar}>+1</button>
      <span>${this.valor}</span>
    `;
  }
}
```

## Rules

- `@property` = public reactive API (attribute ↔ property with
  `type: Number/Boolean/Array/Object` converters). Add `reflect: true`
  only when CSS or SSR needs the attribute in sync.
- `@state` = internal reactive state, never an attribute.
- `render()` returns a `html` template; Lit re-renders only on
  reactive change — no manual DOM patching.
- Events: `@click=${handler}` in templates; dispatch outward with
  `new CustomEvent("cambio", { detail, bubbles: true, composed: true })`.
- `composed: true` is required for events to cross Shadow DOM.
- Styles: `static styles = css`...`` is scoped to the shadow root.
- Lifecycle: `connectedCallback` / `disconnectedCallback` still apply;
  reactive work goes in `willUpdate` / `updated`, not `render`.

## Vanilla vs Lit

| | Vanilla | Lit |
|---|---|---|
| Deps | none | `lit` package |
| State | manual `render()` calls | reactive `@property`/`@state` |
| Templates | strings / `<template>` clone | `html` tagged templates |
| Best for | 1 small element, learning | stateful or repeated elements |
