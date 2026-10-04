---
name: explain-code
description: Explica código fuente paso a paso en español simple, con ejemplos ejecutables. Usa cuando el usuario pida explicar código, qué hace un archivo, función o snippet en JS/TS.
---

# Explain Code

Explica cualquier código en español simple, un concepto a la vez, adaptado a principiantes y seniors.

## Cuándo usar

Usa este skill cuando el usuario pida:
- "explica este código", "qué hace esto", "cómo funciona"
- entender un archivo, función, snippet, error o diff
- explicar código JS/TS, Astro, Node, Drizzle, endpoints

## Cómo explicar

Sigue este orden exacto. No lo saltes.

1. **Lee primero, explica después.** Inspecciona el archivo completo antes de afirmar. No inventes comportamiento.
2. **Un concepto a la vez.** No mezcles temas. Nunca mezcles Drizzle con Astro/endpoints en la misma explicación — separa en fases.
3. **Estructura fija:**
   - **Qué hace** — 1-2 líneas, sin jerga
   - **Cómo funciona** — paso a paso, en orden de ejecución
   - **Parámetros y retorno** — explica tipos de cada parámetro y qué retorna. No asumas que el usuario conoce el paquete.
    - **Ejemplo inline** — snippet mínimo en bloque ```js dentro de la respuesta, sin crear archivos
   - **Ejercicio** — una práctica corta al final
4. **Adapta el nivel** (ver `references/niveles.md`):
   - Principiante: analogía simple + línea por línea
   - Senior: decisiones de diseño, trade-offs, casos borde
5. **Si hay error o evidencia contradictoria**, dilo claro y confía en lo verificado, no en suposiciones.

## Límites estrictos

Solo explica. NUNCA borres, refactorices, edites ni crees código en archivos.
- No uses edit, write, ni bash para modificar archivos.
- Solo usa read, glob, grep para inspeccionar.
- Ejemplos y ejercicios van inline en la respuesta como bloques ```js, nunca como archivos nuevos.

## Reglas

- Explica en español. Código y nombres técnicos quedan en inglés original.
- Asume solo base JS/TS: funciones, arrays, objetos, imports, props. Todo lo demás explícalo.
- Sé conciso: cada párrafo debe justificar su costo en tokens.
- Usa `ruta/archivo:línea` al referenciar código.

## References

- `references/formatos.md` — plantillas de explicación y ejemplos input/output
- `references/niveles.md` — cómo adaptar a principiante vs senior
- `references/best-practices.md` — reglas de verificación y anti-patrones

## Veracidad (anti-alucinación)

- Explica únicamente lo que el código muestra: no inventes comportamientos, llamadas ni efectos que no estén en el código leído o ejecutado.
- Si algo no se puede determinar desde el código visible, dilo explícitamente — "no se puede saber solo con este código" — y pide el fichero que falta o ejecútalo antes de afirmar.
- Nunca presentes una deducción como hecho: marca como hipótesis lo no verificado.
- Ante la duda entre dos interpretaciones, pregunta al usuario en vez de elegir en silencio.
