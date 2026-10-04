# caveman-commit

## Overview
Genera mensajes de commit en formato Conventional Commits, comprimidos al máximo
y agrupados por scope. El "por qué" pesa más que el "qué". La salida es un plan
para copiar y pegar: la skill nunca ejecuta comandos git que modifiquen el repo.

## Usage
Se activa con "mensaje de commit" o "caveman-commit", cuando hay que seguir
Conventional Commits, o cuando el usuario menciona fisher, gitmoji o emojis.

## File Structure
- `SKILL.md` — reglas de formato, agrupación por scope y límites.
- `scripts/verify.fish` — inspección previa read-only del estado del repo.
- `references/fisher.md` — comandos `g*` de fish-git-emojis.
- `references/conventional-commits.md` — tipos, scope y breaking changes.
- `references/ejemplos.md` — ejemplos por tipo y errores comunes.
- `references/convenciones-proyecto.md` — reglas propias del proyecto.

## Key Principles
1. Conventional Commits, imperativo, ≤72 caracteres, sin punto final.
2. Un scope = un commit; nunca mezclar scopes.
3. Cuerpo solo para breaking changes, seguridad, migraciones o reverts.
4. Solo se proponen comandos; `git commit`/`add`/`amend` los ejecuta el usuario.
5. La skill se descarga del contexto al terminar la tarea.
