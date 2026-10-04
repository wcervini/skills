# Web Components (vanilla)

Custom Elements + Shadow DOM with no dependencies. Read when the user
wants a framework-free reusable element.

## Minimal element

```js
class MiSaludo extends HTMLElement {
  static observedAttributes = ["nombre"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const nombre = this.getAttribute("nombre") ?? "mundo";
    this.shadowRoot.innerHTML = `<p>Hola, ${nombre}</p>`;
  }
}

customElements.define("mi-saludo", MiSaludo);
```

```html
<mi-saludo nombre="Ana"></mi-saludo>
```

## Rules

- Tag name MUST contain a hyphen (`mi-saludo`, not `misaludo`).
- `observedAttributes` is static; only listed attributes trigger
  `attributeChangedCallback(name, oldValue, newValue)`.
- Lifecycle callbacks are just callbacks passed to the platform:
  `connectedCallback` (inserted), `disconnectedCallback` (removed),
  `adoptedCallback` (moved across documents).
- `attachShadow({ mode: "open" })` once per element, usually in the
  constructor before any DOM work.
- Attributes are strings; parse numbers/JSON explicitly.
- Prefer `<slot>` for user content over attributes for rich HTML:

```js
this.shadowRoot.innerHTML = `<div class="card"><slot></slot></div>`;
```

## Template pattern

For repeated markup, clone a `<template>` instead of string concat:

```js
const tpl = document.getElementById("mi-card-tpl");
this.shadowRoot.append(tpl.content.cloneNode(true));
```

## When NOT vanilla

Reach for `references/lit.md` when the element needs reactive state,
complex templates, or frequent re-renders.
