---
name: vivaldi-bookmarks
description: Use cuando el usuario pida organizar, deduplicar,limpiar, reorganizar por temas, respaldar o restaurar los marcadores de Vivaldi. Incluye el detalle técnico de la sincronización y por qué las ediciones directas al archivo se revierten. Especialista en Default/Bookmarks, tombstones y el clash entre sync e interfaz.
user-invocable: false
---

# Vivaldi Bookmarks

Especialista en los marcadores de Vivaldi: deduplicar, organizar por temas, respaldar y restaurar. En español simple, un cambio a la vez.

> Los marcadores viven en `~/.config/vivaldi/Default/Bookmarks`, un **JSON**. Editarlo funciona, pero el sincronizador puede deshacerlo. Lee `references/sincronizacion.md` antes de tocar nada si hay sync activo.

## Cuándo usar

- Eliminar duplicados de URL o fusionar carpetas repetidas
- Organizar marcadores sueltos en subcarpetas por tema
- Vaciar la Papelera, borrar entradas inservibles
- Respaldar o restaurar el estado de los marcadores
- Diagnosticar por qué "mis cambios vuelven atrás"

## El archivo

| Ruta | Qué es |
|---|---|
| `~/.config/vivaldi/Default/Bookmarks` | El archivo activo. JSON, no SQLite |
| `~/.config/vivaldi/Default/Bookmarks.bak` | Red de seguridad que escribe el propio navegador |
| `~/.config/vivaldi/Default/AccountBookmarks` | Marcadores de la cuenta Vivaldi |

Estructura: `roots` tiene cuatro claves fijas — `bookmark_bar`, `other`, `synced`, `trash`. Cada nodo lleva `id`, `guid`, `name`, `type` (`url` o `folder`), `date_added`, y `url` o `children`.

## Flujo fijo

Sigue este orden. No lo saltes.

1. **Lee primero.** Inspecciona el archivo real antes de afirmar nada. No supongas.
2. **Comprueba el sync ANTES de editar.** Sin esto, todo el trabajo se pierde. Ver `references/sincronizacion.md`.
3. **Verifica que el navegador está cerrado** con `ps`, no con `pgrep`:
   ```bash
   ps -eo pid,comm --no-headers | awk '$2 ~ /vivaldi/ {print "CORRE:",$0}'
   ```
   Debe no imprimir nada. `pgrep -f vivaldi` da falsos positivos: el propio comando coincide con el patrón.
4. **Backup antes de escribir.** En `~/backups/vivaldi-bookmarks/<fecha>/`, con `md5sum` para confirmar.
5. **Escribe una sola vez.** Todo en un paso: dedupe + fusión + tematización + papelera.
6. **Verifica el resultado**: 0 ids duplicados, 0 carpetas vacías, 4 raíces intactas, y que no se pierda ninguna URL única.
7. **No digas "ya puedes abrirlo"** hasta que el usuario confirme el sync. Si está activo, se pierde todo.

## Deduplicar

Dos niveles, decide con el usuario:

- **Exacta** — mismo string de URL. Segura, siempre reversible. Es la recomendada.
- **Normalizada** — resuelve `www`, `https/http`, barra final, orden de parámetros. Ahorra unas 20 más, riesgo bajo pero real.

Al deduplicar, **conserva siempre la primera aparición**: la de la carpeta más cercana a la raíz de la barra. Recorrido en orden, conjunto `seen`.

## Reorganizar por temas

1. Lista el contenido real y **agrupa en bloques** ante el usuario antes de escribir.
2. Reglas por dominio o patrón, en orden. **Los temas específicos van antes que los genéricos** — un enlace de WordPress generado con un chatbot sigue siendo de WordPress.
3. Si ya existe una subcarpeta que solo difiere en mayúsculas (`wordpress` vs `WordPress`), **fúsionala**, no crees una segunda.
4. Las subcarpetas preexistentes ya temáticas se conservan, se añaden al final.

Detecta entradas inservibles: unidades de Windows (`file:///C:/`), `localhost` sin servicio, títulos vacíos. Pregunta antes de mandarlas a la papelera.

## Verificación obligatoria

```python
# nunca perder URLs únicas
perdidas = set(urls_antes) - set(urls_despues)
# 0 ids de nodo repetidos en todo el árbol
```

Comprueba siempre que las 4 claves de `roots` siguen ahí y que los permisos son `-rw-------`.

## Estructura de respuesta

- **Qué hice** — resultado en tabla, antes/después
- **Respaldo** — dónde está y el comando para revertir
- **Lo que falta decidir** — sincronización, papelera, restos dudosos

## Límites estrictos

- **Nunca escribas con el navegador abierto.** Es el error que más veces se repite aquí.
- **Nunca digas "puedes abrirlo" sin avisar antes del sync.** Si el sync está activo, revierte.
- **Nunca aflojes el hecho de que el trabajo se perdió.** Di que fue el procedimiento, no la herramienta.
- **No borres nada sin confirmar.** Papelera vaciada y marcadores únicos son irreversibles sin respaldo.
- **Respeta la config global**: symlinks en `~/.skills/` intocables, permisos y hooks se preguntan.

## Referencias

- `references/sincronizacion.md` — tombstones, clash con el sync, cómo verificar y desactivar
- `references/recetas.md` — scripts de deduplicar, fusionar, tematizar, respaldar y restaurar
