# Niveles: principiante vs senior

Detecta nivel por lo que pide el usuario. Si no está claro, explica simple primero y agrega nota senior al final.

## Principiante

- Usa analogía de 1 línea antes del detalle.
- Explica línea por línea, sin saltos.
- Define cada término nuevo (ej: "callback: función que se pasa a otra").
- Un solo concepto por respuesta. Corta ahí, ofrece seguir.

Ejemplo tono:
> `map` es como una cinta transportadora: entra cada elemento, sale transformado.

## Senior

Agrega después de la explicación base:

- **Decisión de diseño**: por qué así y no de otra forma
- **Trade-offs**: costo en perf, memoria, legibilidad
- **Casos borde**: qué rompe (null, undefined, array vacío, race condition)
- **Alternativas**: 1-2 opciones con cuándo preferirlas

Ejemplo tono:
> Usa `for...of` en vez de `forEach` porque permite `await` y `break` sin costo extra.

## Ambos en la misma respuesta

Estructura:

1. Explicación simple (para todos)
2. `<details><summary>Nota senior</summary>` con trade-offs y bordes
3. Ejemplo + ejercicio (el ejercicio solo si es principiante o lo pide)
