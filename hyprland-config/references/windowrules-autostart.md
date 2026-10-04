# Windowrules y autostart

## Windowrules reales de tu config (hyprland.lua:340-390)

```lua
hl.window_rule({ name = "suppress-maximize-events", match = { class = ".*" }, suppress_event = "maximize" })
hl.window_rule({ name = "centrar-flotantes", match = { float = true }, center = true })
hl.window_rule({ name = "enviar-a-magic", match = { class = "org.telegram.desktop" }, workspace = "special:magic" })
hl.window_rule({ name = "forzar-tiling", match = { class = "code-oss" }, tile = true, workspace = 1 })
hl.window_rule({ name = "navegador-work", match = { class = "vivaldi-stable" }, tile = true, workspace = 2 })
```

Patrón: `name` (string único) + `match` (tabla: `class`, `title`, `float`, `xwayland`...) + acción (`float`, `tile`, `center`, `workspace`, `move`, `no_focus`, ...).

```lua
-- Nueva receta: flotar y centrar una app
hl.window_rule({ name = "flotar-app", match = { class = "pavucontrol" }, float = true, center = true, size = "800 600" })
```

Averigua `class` con `hyprctl clients | grep -i class`.

## Autostart (hyprland.lua:49-63)

```lua
hl.on("hyprland.start", function()
  hl.exec_cmd("waybar")
  hl.exec_cmd("hyprpaper")
  hl.exec_cmd("hypridle")
end)
```

`hl.exec_cmd` (string): ejecuta una vez al iniciar Hyprland. Para añadir un programa, una línea `hl.exec_cmd("tu-app")` dentro de esa función.

## Input y look-and-feel

```lua
hl.config({ input = { kb_layout = "es", numlock_by_default = true, follow_mouse = 1, sensitivity = 0 } })
hl.config({ general = { gaps_in = 5, gaps_out = 5, border_size = 2, layout = "dwindle" } })
```

## Verificar

```bash
hyprctl clients     # clases y workspaces reales
hyprctl reload
```
