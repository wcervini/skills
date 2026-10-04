# Tabernaculo — Memoria descriptiva

Gestor de **skills** (estándar Agent Skills: carpeta con `SKILL.md`) para
**agent-CLIs** (`opencode`, `codex`, `anthropic/claude`, `phi`, `gemini`,
`cursor`, `agents` genérico). Importa skills desde GitHub o local a un
**store local**, y las enlaza a proyectos mediante **symlinks** en la carpeta
que cada agent-CLI espera. CLI en **TypeScript sobre Bun** (solo necesita
`bun` y `git` del sistema; se compila a un **binario único** con
`bun build --compile`). GUI diferida a fase 2.

## Requisitos origen y estado

| Requisito | Estado |
|---|---|
| Importar skills desde GitHub o local | ✅ `import`, `scan` |
| Soportar varios CLI (opencode, codex, anthropic, phi) | ✅ + `agents`, `gemini`, `cursor` |
| Añadir skills a un proyecto con enlaces blandos (CLI; GUI en fase 2) | ✅ `link`/`unlink`, GUI pendiente |
| Selección por listado de skills del repo local | ✅ selector interactivo en `link`, `scan` |

Decisiones tomadas en marcha:

- La **skill es genérica**: el store es plano (`skills/<nombre>`), el
  agent-CLI solo decide la carpeta destino al enlazar. `import` no exige
  `--cli` (queda como hint opcional en el meta).
- Estándar: la carpeta debe llamarse igual que el campo `name` del
  frontmatter de `SKILL.md`. Al importar manda el frontmatter; si la carpeta
  origen trae sufijos (p. ej. hashes de otros instaladores) se avisa por
  stderr y se usa el `name` limpio. `scan` muestra el nombre del frontmatter.

## Estructura

```
tabernaculo/
  package.json              # proyecto Bun; scripts start/typecheck/build
  tsconfig.json             # strict, moduleResolution bundler, types node
  install.sh                # bun install + typecheck + compile + install -m755
  MEMORIA.md                # este documento
  .gitignore                # node_modules/, tabernaculo (binario)
  .github/workflows/release.yml  # cross-compile 6 binarios → GitHub Releases (tag v*)
  src/
    types.d.ts              # declara import de *.txt (scripts de completado)
    main.ts                 # entrypoint → dispatch
    cmd/
      root.ts               # dispatch, flag global --store, import/list/link/unlink/remove/clis/config/completion/help/__skills
      flags.ts              # parseCmd sobre node:util parseArgs (estilo Go flag) + FlagError
      pick.ts               # selector interactivo por listado (stdin)
      scan.ts               # scan + selección múltiple (1,3 / 1-3 / all)
      config.ts             # comando config: muestra/--set el store
      help.ts               # ayuda detallada por comando (help <cmd> / <cmd> --help)
      completion.ts         # elige script y lo imprime/instala + helper oculto __skills
      completions/          # bash.txt / zsh.txt / fish.txt (embebidos en el binario)
    internal/
      fsutil.ts             # pathExists/isDir/copyFile/copyDir/removeAll/rfc3339
      config/config.ts      # config.json (~/.config/tabernaculo) + resolución del store
      cliDefs/cli.ts        # mapa agent-CLI → subdirectorio destino (+ legacy codex)
      store/store.ts        # store plano + compat legacy, meta.json, list/resolveSkill/remove
      importer/importer.ts  # import local/GitHub, normalizeName, copia sin .git
      importer/scan.ts      # scanDir: candidatas en carpeta local
      importer/frontmatter.ts # frontmatterName: campo name de SKILL.md
      linker/linker.ts      # link/unlink/status con symlinks seguros
```

Equivalencias Go → TS: los paquetes `internal/*` se mantienen 1:1; la capa
`cmd` igual. Lo único idiomático nuevo es `flags.ts` (parser propio sobre
`util.parseArgs`) y que el diccionario de flags se declara con arrays de
nombres `string`/`boolean`.

## Agent-CLIs soportados (`--cli`)

| `--cli` | Destino en proyecto | Notas |
|---|---|---|
| `opencode` | `.opencode/skills/<skill>` | + lee compat `.claude/.agents` |
| `anthropic` (`claude` alias) | `.claude/skills/<skill>` | Claude Code |
| `codex` | `.agents/skills/<skill>` | Canónico actual; `--legacy` → `.codex/skills` |
| `agents` | `.agents/skills/<skill>` | Genérico cross-CLI |
| `gemini` | `.gemini/skills/<skill>` | + alias `.agents/skills` |
| `cursor` | `.cursor/skills/<skill>` | + compat `.claude/.codex` |
| `phi` | `.phi/skills/<skill>` | Configurable, pendiente confirmar ruta real |

Rutas verificadas contra docs oficiales (2026) de opencode, Claude Code,
Codex, Gemini CLI y Cursor.

## Store local

Resolución: `--store` > `$TABERNACULO_HOME` > `$TABERNACULO_STORE` >
`~/.config/tabernaculo/config.json` (`store`) > `~/.local/tabernaculo`.

El archivo de config (JSON) guarda la **raíz** del store:
`{ "store": "/ruta/al/store" }`; `~` se expande. Si no es JSON válido se
avisa por stderr y se ignora (se usa el default). `tabernaculo config`
muestra la ruta efectiva, el origen y el archivo; `tabernaculo config --set
<ruta>` lo escribe. `$XDG_CONFIG_HOME` se respeta para la ubicación. Si no
existe, el archivo se **crea automáticamente** con `{ "store": <default> }`
al ejecutar cualquier comando (nunca sobrescribe uno existente).

```
<store>/skills/<nombre>/
  SKILL.md
  scripts/ references/ assets/   (opcionales, según skill)
  .tabernaculo.json              # Meta
```

La carpeta de skills (`skillsBase`) acepta **dos layouts**:
1. `<store>/skills` (layout actual, default `~/.local/tabernaculo`).
2. `<store>` directo si es un repo de skills (carpetas con `SKILL.md` en la
   raíz, p. ej. `~/.skills`). Se auto-detecta; el primero gana si ambos
   existen.

`Meta`: `name`, `cli` (hint opcional), `source` (`local|github`),
`url_or_path`, `ref`, `subpath`, `imported_at`.
Compatibilidad: el layout antiguo `skills/<cli>/<nombre>` se sigue listando
y enlazando (gana el plano si hay duplicado de nombre).

Normalización de nombre: minúsculas, espacios/`_` → `-`, solo `[a-z0-9-]`.

## Comandos

```
tabernaculo import --from <path|url|owner/repo> [--cli hint] [--path sub/dir]
                   [--ref rama] [--name override]
tabernaculo scan --dir <carpeta> [--cli hint] [--all]
tabernaculo list [--cli filtro-hint]
tabernaculo link --cli <agent> --project <path> [--skill n] [--force] [--legacy]
tabernaculo unlink --cli <agent> --project <path> --skill <n> [--legacy]
tabernaculo remove --skill <n>            (alias: rm)
tabernaculo clis                          (alias: supported-clis)
tabernaculo config [--set <ruta>]         (store por defecto en config.json)
tabernaculo completion <bash|zsh|fish> [--install]   (install solo fish)
tabernaculo help [comando]                (ayuda general o detallada)
```

- `import`: carpeta con `SKILL.md` se copia tal cual; `.md` suelto se envuelve
  como `SKILL.md`; GitHub vía `git clone --depth 1 [--branch]` + `--path`;
  se omite `.git`; colisión → error con sugerencia de `--name`.
  Si el origen trae **varias skills** (varias subcarpetas con `SKILL.md`), en
  terminal interactiva muestra un **menú numerado** y elige por número o
  nombre (`pickSkillFromNames`); sin TTY mantiene el error sugiriendo `--path`.
- `scan`: detecta subcarpetas con `SKILL.md` (o con `.md`) y `.md` sueltos;
  ignora ocultos/`.git`/`node_modules`; lista numerada y selección `1,3`,
  `1-3`, `all`; `--all` no pregunta; resumen `N ok, M fallos`. Si una carpeta
  candidata trae **varias skills**, en terminal interactiva abre el mismo
  menú numerado de `import` (`pickSkillFromNames`); sin TTY mantiene el error.
- `link`: `MkdirAll` del destino + `os.Symlink(storeAbs, target)`; idempotente
  si ya apunta igual; `--force` reemplaza symlink/fichero pero **nunca**
  directorios reales; sin `--skill` abre selector.
- `unlink`: solo borra si es symlink.
- `remove`: borra del store (plano o legacy).
- `config`: sin flags muestra store efectivo, origen (`flag`/`entorno`/
  `archivo`/`default`), archivo y ruta de skills; `--set <ruta>` escribe
  `config.json` con `{ "store": ... }`.
- `help`: `tabernaculo help` (general) o `tabernaculo help <comando>`;
  equivalente a `tabernaculo <comando> --help`. El texto detallado vive en
  `cmd/help.ts`.

## Autocompletado

`completion` genera scripts con subcomandos, flags por comando, valores de
`--cli` y `--skill` dinámico desde el store (`__skills`). También completa el
`help` con la lista de comandos.

```bash
eval "$(tabernaculo completion bash)" >> ~/.bashrc
mkdir -p ~/.zfunc && tabernaculo completion zsh > ~/.zfunc/_tabernaculo  # + fpath/compinit
tabernaculo completion fish --install   # → ~/.config/fish/completions/
```

`--skill` usa el store por defecto; con store custom usa `tabernaculo config
--set` o exporta `TABERNACULO_HOME`. El binario debe estar en PATH para los
valores dinámicos.

## Instalación

```bash
cd ~/project/tabernaculo && ./install.sh
# bun install + tsc --noEmit + bun build --compile + install -m755 a
# ~/.local/bin (+ aviso si no está en PATH). SKIP_DEPS=1 omite bun install.
```

Desarrollo: `bun run src/main.ts <comando>` (sin compilar). El binario se
genera con `bun build --compile --outfile tabernaculo src/main.ts`.

Distribución (ver README): 4 vías documentadas — `npm install -g tabernaculo`
(o `bun install -g`), `npx tabernaculo` (sin instalar), **binario compilado**
descargado de GitHub Releases (sin Bun, standalone), y fuente. `bun publish`
para npm (requiere Bun en runtime: el bin apunta a `src/main.ts` con shebang
`#!/usr/bin/env bun`). El workflow `.github/workflows/release.yml` cross-compila
los 6 binarios (`bun-linux/darwin/windows × x64/arm64`) al pushear un tag
`v*` y los adjunta al release.

## Verificación realizada (port TS)

- `tsc --noEmit` limpio (strict) + `bun build --compile` OK (16 módulos).
- E2E en `/tmp` (equivalente al del Go): import carpeta y `.md` suelto
  (con/sin `--cli`), `list` (con filtro), `link` a varios CLIs desde una sola
  skill, selector interactivo, `--legacy` codex, idempotencia, `unlink`,
  `remove`, reimport con `--name`, colisiones, CLI desconocido, `--legacy`
  inválido, comando desconocido/sin args (exit 2), `scan` con rangos/`all`/
  duplicados/serie inválida/`.md` suelto, import GitHub vía `file://`
  (`git clone`, `--path`, múltiples skills, `.git` omitido, meta.json),
  `completion` bash/zsh/fish **idénticos byte a byte** a los scripts fuente,
  `completion fish --install` en `XDG_CONFIG_HOME`, e `install.sh` completo
  hasta un `INSTALL_DIR` temporal + smoke test.
- Modo dev `bun run src/main.ts list` OK.

## Envoltura de carpetas con `.md` (corregido respecto a Go)

- Una carpeta local con `.md` pero **sin** `SKILL.md` se importa con el
  **nombre de la carpeta** (o el del repo si viene de GitHub) y su primer
  `.md` se copia como `SKILL.md` en el destino. `resolveSkillRoot` ya no crea
  un directorio temporal de envoltura: devuelve la carpeta original más el
  `.md` a envolver. En la versión Go esto producía el nombre `w` (basename
  del temporal); aquí está corregido.
- Si el `.md` envuelto trae frontmatter `name`, ese manda (como antes).
- El clon temporal de GitHub se nombra con el nombre real del repo
  (`repoNameFromURL`), no con `repo`.

## Pendiente

- Fase 2: GUI (fuera de alcance actual).
- Confirmar comando/ruta real del CLI `phi` (hoy `.phi/skills/`, cambio de 1
  línea en `src/internal/cliDefs/cli.ts`).
- Idea propuesta: `scan --fix` para renombrar en lote las skills que entraron
  con hash (hoy: `remove` + `scan` manual).
