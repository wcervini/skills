# Monitores

Tu monitor (`hyprctl monitors`): **DVI-D-1, 1920x1080@60, escala 1, en 0x0**.

## Config actual (hyprland.lua:25-30)

```lua
hl.monitor({
    output   = "",
    mode     = "preferred",
    position = "auto",
    scale    = "auto",
})
```

`output = ""` = aplica a todos. Para reglas por monitor usa el nombre (`"DVI-D-1"`).

## Recetas

```lua
-- Fijar tu Acer a 1080p60 en 0x0, escala 1
hl.monitor({ output = "DVI-D-1", mode = "1920x1080@60", position = "0x0", scale = 1 })
-- Segundo monitor a la derecha
hl.monitor({ output = "HDMI-A-1", mode = "preferred", position = "auto-right", scale = "auto" })
-- Desactivar un monitor
hl.monitor({ output = "DP-1", disable = true })
-- Espejar
hl.monitor({ output = "HDMI-A-1", mirror = "DVI-D-1" })
```

Parámetros: `output` (string, nombre del conector), `mode` (string `"anchoxalto@hz"` o `"preferred"`), `position` (string `"XxY"`, `"auto"`, `"auto-right"`), `scale` (number o `"auto"`).

## Verificar

```bash
hyprctl monitors        # resolución, posición, escala reales
hyprctl reload
```

## Errores comunes

- Modo no soportado: consúltalo en `availableModes` de `hyprctl monitors` antes de fijarlo.
- `position = "auto"` con un solo monitor equivale a `0x0`; con dos, explicita `auto-right` o coordenadas.
