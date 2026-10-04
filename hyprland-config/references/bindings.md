# Bindings

Tu config usa `hl.bind` con variables locales (`hyprland.lua:257-260`):

```lua
local win = "SUPER"
local altkey = "SUPER + ALT"
local ctrlkey = "SUPER + CTRL"
local shiftkey = "SUPER + SHIFT"
```

## Patrones reales de tu config

```lua
-- Abrir terminal (hyprland.lua:263)
hl.bind(win .. " + T", hl.dsp.exec_cmd("kitty @ launch --type=tab --cwd=current"))
-- Cerrar ventana (hyprland.lua:268)
hl.bind(win .. " + C", hl.dsp.window.close())
-- Flotar / pseudo / fullscreen
hl.bind(win .. " + V", hl.dsp.window.float({ action = "toggle" }))
hl.bind(win .. " + P", hl.dsp.window.pseudo())
hl.bind(win .. " + F", hl.dsp.window.fullscreen(0))
-- Workspaces 1-10 con bucle (hyprland.lua:302-306)
for i = 1, 10 do
    local key = i % 10
    hl.bind(win .. " + " .. key, hl.dsp.focus({ workspace = i }))
    hl.bind(shiftkey .. " + " .. key, hl.dsp.window.move({ workspace = i }))
end
-- Scratchpad (hyprland.lua:309)
hl.bind(win .. " + S", hl.dsp.workspace.toggle_special("magic"))
-- Multimedia con flags (hyprland.lua:321)
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume -l 1 @DEFAULT_AUDIO_SINK@ 5%+"), { locked = true, repeating = true })
```

## Submaps (resize / move)

```lua
hl.bind(win .. " + R", hl.dsp.submap("resize"))
hl.define_submap("resize", function()
    hl.bind("l", hl.dsp.window.resize({ x = 20, y = 0, relative = true }), { repeating = true })
    hl.bind("escape", hl.dsp.submap("reset"))
    hl.bind("return", hl.dsp.submap("reset"))
end)
```

Todo submap necesita salida con `escape` y `return` hacia `reset`.

## Verificar

```bash
hyprctl binds   # lista binds activos
hyprctl reload  # recarga tras editar
```

## Errores comunes

- Olvidar `..` al concatenar (`win .. " + T"`, no `win + "T"`).
- Flag `{ mouse = true }` obligatorio en binds de ratón (`mouse:272/273`).
- `locked = true` en teclas multimedia para que funcionen en pantalla bloqueada.
