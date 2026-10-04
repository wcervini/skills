# Diagnóstico

## Comandos

```bash
hyprctl reload      # recarga hyprland.lua tras cada edición
hyprctl binds       # verifica atajos (tu salida usa dispatcher __lua)
hyprctl monitors    # resolución, posición, escala, availableModes
hyprctl clients     # ventanas: class, title, workspace, float/tiling
hyprctl workspaces  # workspaces activos, incluye special:magic
```

Retornan texto; si el comando falla o la salida no trae lo esperado, dilo y no inventes.

## hypridle (`~/.config/hypr/hypridle.conf`)

Bloqueo a los 600s (`loginctl lock-session`), DPMS off a los 20s. Si la pantalla se apaga muy rápido, ese `listener { timeout = 20 ... }` es el culpable.

## hyprpaper (`~/.config/hypr/hyprpaper.conf`)

```ini
preload = /usr/share/wallpapers/cachyos-wallpapers/Cachy_Topography.jpg
wallpaper = ,/usr/share/wallpapers/cachyos-wallpapers/Cachy_Topography.jpg
```

`wallpaper = ,ruta` (coma + vacío = todos los monitores). Para monitor concreto: `wallpaper = DVI-D-1,ruta`.

## Errores Lua típicos

- `..` olvidado al concatenar binds → error de sintaxis al recargar.
- Permisos (`hl.permission`): requieren **reinicio** de Hyprland, no basta `reload`.
- `hl.config` duplicado por sección está bien (tu config lo hace por bloques); no lo "limpies" uniendo todo.
- Tras editar y `reload`, confirma con el `hyprctl` que corresponda; si no refleja el cambio, muestra la salida real al usuario.
