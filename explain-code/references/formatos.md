# Formatos de explicación

Plantillas input/output. Usa la que corresponda. No mezcles.

## Formato base (siempre)

```markdown
## Qué hace
[1-2 líneas]

## Cómo funciona
1. [paso en orden de ejecución]
2. [...]

## Parámetros y retorno
- `nombre` (`tipo`): qué es
- Retorna (`tipo`): qué devuelve

## Ejemplo
```js
// ejemplo mínimo ejecutable con node
```

## Ejercicio
[una práctica corta]
```

## Ejemplo 1: función

Input: `function sum(a, b) { return a + b; }`

Output:
```markdown
## Qué hace
Suma dos números.

## Cómo funciona
1. Recibe `a` y `b`.
2. Retorna la suma con `return`.

## Parámetros y retorno
- `a` (`number`): primer sumando
- `b` (`number`): segundo sumando
- Retorna (`number`): la suma

## Ejemplo
```js
console.log(sum(2, 3)); // 5
```

## Ejercicio
Crea `multiply(a, b)` y pruébala con `node test.mjs`.
```

## Ejemplo 2: snippet con import desconocido

Input: `import { z } from "zod"; const S = z.string().min(3); S.parse("hi");`

Output: explica qué es `zod` en 1 línea, qué hace `.string()`, `.min(3)`, y que `parse` lanza error si falla. No asumas conocimiento del paquete.

## Ejemplo 3: función async

Input: `async function getUser(id) { const r = await fetch("/api/users/" + id); return r.json(); }`

Output:
```markdown
## Qué hace
Busca un usuario por id en la API.

## Cómo funciona
1. Recibe `id` y pide la URL con `fetch` (pausa con `await` hasta que responde).
2. Convierte la respuesta a objeto con `r.json()` y la retorna.

## Parámetros y retorno
- `id` (`string`): identificador del usuario
- Retorna (`Promise<object>`): el usuario; `async` siempre retorna promesa

## Ejemplo
```js
const u = await getUser("42");
console.log(u.name);
```

## Ejercicio
Crea `getPost(id)` igual pero contra `/api/posts/`.
```

## Anti-patrones

- ❌ Explicar todo el archivo de golpe sin orden de ejecución
- ❌ Decir "esto obviamente hace X" sin leer el archivo
- ❌ Mezclar Drizzle + Astro en la misma explicación
- ❌ Omitir tipos de parámetros y retorno
