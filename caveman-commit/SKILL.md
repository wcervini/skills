---
name: caveman-commit
description: Genera mensajes de commit en Conventional Commits comprimidos al máximo y agrupados por scope, listos para copiar y pegar. Usar cuando el usuario diga "mensaje de commit" o "caveman-commit", pida seguir Conventional Commits, o mencione fisher/gitmoji/emojis. Nunca ejecuta git commit, add ni amend.
---

# Caveman Commit

Genera mensajes de commit concisos y exactos. Conventional Commits. Sin relleno.
Enfócate en el *por qué* más que en el *qué*. La salida es un plan para copiar y
pegar: **nunca** ejecutes git.

## Cuándo usarla
- El usuario pide un "mensaje de commit" o invoca "caveman-commit".
- Hay que seguir el estándar Conventional Commits.
- El usuario menciona `fisher`, `gitmoji` o emojis para el commit.

## Capacidades y alcance
- **Puede**: inspeccionar el repo (`git status --short`, `git diff`) en modo lectura.
- **Usa**: `scripts/verify.fish` para la inspección previa (read-only).
- **Produce**: mensajes + `git add <paths>` + comando `g*` si aplica.
- **Prohibido**: ejecutar `git commit`, `git add` o `git amend`; dejar cambios en
  staging; inventar el diff sin inspeccionarlo.
- **Alcance**: proyecto local (`~/.skills/caveman-commit`).

## Inspección previa
Antes de proponer los mensajes, ejecuta `scripts/verify.fish` para conocer el
estado real del repo (rama, log, staged/tracked) sin volcar el diff al contexto.
Trabaja sobre su salida resumida.

## Reglas

### Línea de asunto
- `<tipo>(<ámbito>): <resumen imperativo>` — `<ámbito>` opcional.
- Tipos: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`,
  `ci`, `style`, `revert`.
- Imperativo en inglés: "add", "fix", "remove" (no "added", "adds", "adding").
- ≤50 caracteres cuando sea posible, límite estricto de 72.
- Sin punto final.
- Sigue la convención del proyecto para mayúsculas tras los dos puntos.
- Puede tener más de una línea de asunto.
- Si el usuario menciona emoji, sugiérele el comando `g*` de fisher.

### Cuerpo (solo si es necesario)
- Omitir si el asunto es autoexplicativo; si el usuario lo pide, ofrecer una mejor opción.
- Añadir solo para: el *por qué* no obvio, breaking changes, migraciones o issues.
- Ancho a 72 caracteres. Viñetas `-`, no `*`.
- Referenciar al final: `Closes #42`, `Refs #17`.

### Nunca incluir
- "This commit does X", "I", "we", "now", "currently" (el diff ya explica el qué).
- "As requested by..." (usar tráiler `Co-authored-by`).
- Repetir el nombre del archivo si el scope ya lo indica.

## Agrupación por scope
Cuando el diff toca varios scopes, dividir en un commit por scope. Nunca mezclar.
- Inspeccionar con `git status --short`. Derivar scope de la carpeta/módulo: `api`, `auth`, `ui`, `db`, `ci`, `docs`.
- Un scope = un commit. Orden: `feat` > `fix` > resto, luego alfabético por scope.
- Cambio transversal → sin scope, solo.
- Por commit: bloque de mensaje + `git add <paths>`.
- Si el usuario menciona `fisher`, añadir el comando `g*`. Ver `references/fisher.md`.

## Auto-claridad
Incluir siempre cuerpo para: breaking changes, fixes de seguridad, migraciones de
datos y reverts. Nunca comprimir esto a solo-asunto.

## Economía de contexto
No vuelques el diff completo al contexto: usa `scripts/verify.fish` para la
inspección previa y resume por scope. Consulta `references/` solo cuando la tarea
lo requiera. Detalle en `references/conventional-commits.md`,
`references/ejemplos.md` y `references/convenciones-proyecto.md`.

## Ciclo de vida (Unload/Cleanup)
Al terminar, entrega el plan de commits (bloques copiables + comando final
`git add ... && g<tipo> "..."`) y **descarga de la memoria el diff, la salida de
`scripts/verify.fish` y las referencias usadas**. No mantengas el diff en
contexto tras responder.

## Referencias
- `references/fisher.md` — comandos `g*` de fish-git-emojis.
- `references/conventional-commits.md` — tipos, scope y breaking changes.
- `references/ejemplos.md` — ejemplos por tipo y errores comunes.
- `references/convenciones-proyecto.md` — reglas propias del proyecto.
- Estándar: https://www.conventionalcommits.org
