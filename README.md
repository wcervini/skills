# .skills

Repositorio de **Agent Skills** reutilizables en cualquier proyecto. Cada skill es
una carpeta con un `SKILL.md` (frontmatter YAML con `name` y `description`) y, de
forma opcional, `references/`, `scripts/` y `assets/`.

Las skills se importan, listan y enlazan con **[Tabernáculo](#tabernáculo)**, un
gestor de skills para CLIs de agentes que las enlaza por symlink en la carpeta que
cada CLI espera (`.opencode/skills`, `.claude/skills`, `.agents/skills`, …).

## Estructura

```
.skills/
├── <skill>/
│   ├── SKILL.md          # obligatorio: name + description en frontmatter
│   ├── metadata.json     # opcional: metadata estructurada (scope, permisos, refs…)
│   ├── README.md         # opcional: documentación humana
│   ├── references/       # documentación de apoyo (se carga bajo demanda)
│   ├── scripts/          # lógica dura ejecutable (evita saturar el contexto)
│   ├── assets/           # plantillas, imágenes, iconos…
│   └── .tabernaculo.json # metadata de importación (generada por Tabernáculo)
├── .opencode/            # config local del proyecto + symlinks a las skills
├── AGENTS.md             # instrucciones del repositorio
└── skills-lock.json      # skills importadas desde origen externo (hash)
```

## Uso rápido

```bash
# apuntar el store de Tabernáculo a este repositorio (una vez)
tabernaculo config --set ~/.skills

# listar lo disponible
tabernaculo list

# enlazar una skill en el proyecto actual para OpenCode
tabernaculo link --cli opencode --project . --skill drizzle
```

Instalación de Tabernáculo: `npm i -g tabernaculo`, `npx tabernaculo …` o binario
compilado. Ver [`tabernaculo/README.md`](tabernaculo/README.md).

## Skills incluidas

### Diseño y frontend
| Skill | Descripción |
|---|---|
| `frontend-design` | Interfaces frontend distintivas y de calidad de producción; evita la estética genérica de IA. |
| `impeccable` | Diseñar, rediseñar, auditar, pulir y mejorar interfaces (UX, jerarquía, accesibilidad, theming, motion). |
| `impeccable--183cc09b` | Copia/variante de `impeccable`. |
| `tailwind-css-patterns` | Patrones utility-first de Tailwind: responsive, layout, grid, tipografía, color. |
| `astro-base` | Astro: componentes, páginas, adaptadores SSR, content collections, despliegue estático. |
| `astro-extended` | Google Sign-in / OAuth en Astro con `arctic`: callback, sesiones, middleware, rutas protegidas. |
| `accessibility` | Auditoría y mejora de accesibilidad siguiendo WCAG 2.2. |
| `web-perf` | Análisis de rendimiento web con Chrome DevTools MCP: Core Web Vitals. |
| `seo` | Optimización para buscadores: meta tags, datos estructurados, sitemaps. |

### Backend, datos y lenguajes
| Skill | Descripción |
|---|---|
| `nodejs-backend-patterns` | Backends Node.js de producción con Express/Fastify: middleware, errores, auth, APIs. |
| `nodejs-best-practices` | Principios y decisiones en Node.js: frameworks, async, seguridad, arquitectura. |
| `drizzle` | Drizzle ORM: tablas, índices, relaciones, joins y tipos inferidos. |
| `sqlite-database-expert` | SQLite embebido (Tauri/desktop): migraciones, FTS, prevención de inyección. |
| `zod` | Validación de esquemas con Zod: tipos, parsing y manejo de errores. |
| `better-auth-best-practices` | Better Auth: servidor y cliente, adaptadores de BD, sesiones, plugins. |
| `modern-javascript-patterns` | ES6+: async/await, destructuring, módulos, iteradores, Lit y web components. |
| `javascript-testing-patterns` | Testing con Jest, Vitest y Testing Library: unit, integración, E2E, mocks. |
| `typescript-advanced-types` | Sistema de tipos avanzado de TypeScript: genéricos, condicionales, mapped types. |
| `oxlint` | Ejecutar y configurar oxlint (linter JS/TS sobre Oxc). |

### Cloudflare
| Skill | Descripción |
|---|---|
| `cloudflare` | Plataforma Cloudflare completa: Workers, Pages, KV/D1/R2, IA, networking, seguridad, IaC. |
| `cloudflare-deploy` | Despliegue de aplicaciones e infraestructura en Cloudflare. |
| `workers-best-practices` | Revisión y escritura de Workers frente a buenas prácticas de producción. |
| `wrangler` | CLI de Cloudflare Workers: deploy, dev y gestión de servicios. |

### Flujo de trabajo, Git y calidad
| Skill | Descripción |
|---|---|
| `caveman-commit` | Mensajes de commit en Conventional Commits, comprimidos y agrupados por scope. |
| `using-git-worktrees` | Aislar trabajo por feature con worktrees / herramientas nativas + tests base. |
| `writing-plans` | Planes de implementación pequeños a partir de una spec, antes de tocar código. |
| `systematic-debugging` | Depuración por fases: reproducir → causa raíz → arreglo. |
| `create-github-action-workflow-specification` | Especificación formal consumible por IA de un workflow de GitHub Actions. |
| `explain-code` | Explicar código paso a paso en español simple, con ejemplos ejecutables. |

### Herramientas y entorno
| Skill | Descripción |
|---|---|
| `hyprland-config` | Configurar Hyprland: atajos, monitores, autostart, windowrules, diagnóstico. |
| `vivaldi-bookmarks` | Organizar, deduplicar, respaldar y restaurar marcadores de Vivaldi. |

### Gestión de skills (meta)
| Skill | Descripción |
|---|---|
| `opencode-skill-generator` | Genera skills multi-archivo para OpenCode mediante una entrevista de 6 pasos. |
| `find-skills` | Descubrir e instalar skills del ecosistema abierto (skills.sh). |
| `kitter` | Gestionar una librería de skills reutilizable con la CLI de Kitter. |
| `kitter-builtin` / `_kitter-builtin` | Variantes de la skill de Kitter. |

### Aplicación
| Skill | Descripción |
|---|---|
| `tabernaculo` | Gestor de skills para CLIs de agentes (import/scan/link). Ver su propio README. |

## Crear una nueva skill

1. Usa la skill `opencode-skill-generator` (entrevista de 6 pasos: disparadores,
   fuentes, permisos, orquestación, scripts y limpieza de contexto).
2. Estructura mínima: `SKILL.md` con frontmatter `name` + `description` detallada.
3. Añade `references/` para documentación, `scripts/` para lógica dura y
   `metadata.json` para declarar scope, permisos y dependencias.

## Enlaces simbólicos en OpenCode

El usuario enlaza las skills globales desde `~/.skills/` hacia la carpeta de skills
de OpenCode. **No eliminar ni modificar esos enlaces.** Para enlazar una skill en un
proyecto:

```bash
tabernaculo link --cli opencode --project /ruta/al/proyecto --skill <nombre>
```

## Convenciones

- Las instrucciones del proyecto están en [`AGENTS.md`](AGENTS.md).
- Las skills importadas desde un origen externo quedan registradas en
  [`skills-lock.json`](skills-lock.json) con su hash.
- Preferir `references/` y `scripts/` para no saturar el contexto del modelo.

## Recursos

- Tabernáculo: <https://github.com/wcervini/tabernaculo>
- Agent Skills: <https://agentskills.io>
- Este repositorio está pensado para usarse desde cualquier proyecto.
