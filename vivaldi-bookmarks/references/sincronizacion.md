# Sincronización y marcas de defunción (tombstones)

La causa raíz de que "las ediciones directas al archivo se revierten".

## El mecanismo

Los marcadores no se borran. Cuando borras uno desde el Gestor, el navegador:

1. Le pone una **marca de defunción** (*tombstone*) al marcador — conserva su `id` y su `guid`, y registra que ya no existe.
2. Sube esa marca al servidor con la sincronización.
3. Otros perfiles que sincronicen ven la marca y borran el marcador también.

**Local gana, correctamente.** Eso es lo que el usuario espera, y es cierto.

## Por qué editar el archivo a mano rompe esto

Cuando borras una entrada editando el JSON directamente, **no se crea ninguna marca**. El marcador simplemente deja de estar. Para el sincronizador eso no significa "lo he borrado", significa "aquí nunca existió". Y como el servidor sí tiene ese `id`, lo descarga otra vez y lo restaura.

Resultado: **todo lo que borres por fuera vuelve. Todo lo que crees por fuera se queda.**

## La evidencia que lo confirma

Observado en un caso real, tras escribir el archivo limpio y abrir el navegador:

| | Antes de editar el archivo | Tras sincronizar |
|---|---|---|
| Marcadores duplicados | 1028 | **1028** — revueltos |
| Marcadores sueltos en una carpeta | 30 | **30** — revueltos |
| Subcarpetas creadas por el script | no existían | **siguen, vacías** |

Esa tercera fila es la clave. Una sobrescritura total habría borrado también las carpetas creadas. Que sobrevivan las creaciones y reviertan los borrados es el perfil exacto de un problema de tombstones.

## Verificar si el sync está activo

```bash
python3 -c "
import json
p=json.load(open('/home/underghround/.config/vivaldi/Default/Preferences'))
s=p.get('sync',{})
print('bookmarks           =',s.get('bookmarks'))
print('keep_everything_synced =',s.get('keep_everything_synced'))
print('tipos seleccionados =',p.get('dual_layer_user_pref_store',{}).get('user_selected_sync_types'))
t=s.get('transport_data_per_account',{})
for k,v in t.items():
    print('ultima sincronizacion =',v.get('sync.last_synced_time'))
"
```

Claves a mirar: `sync.bookmarks` y `keep_everything_synced` deben ser `false`.

Los tiempos están en formato WebKit (microsegundos desde 1601-01-01). Convertir:

```python
import datetime
datetime.datetime(1601,1,1) + datetime.timedelta(microseconds=int(t))
```

## Desactivar

Interfaz: **⋯ → Configuración → Sincronización** → desmarcar "Sincronizar marcadores" y "Mantener todo sincronizado".

## Cuándo usar cada vía

| Caso | Vía correcta | Motivo |
|---|---|---|
| Pocos cambios, pocos marcadores | **Interfaz** | Crea tombstones, se sincroniza, el usuario ve el resultado |
| Reorganizar 20-40 marcadores | **Interfaz** | Son arrastres, coste bajo y queda limpio |
| Miles de duplicados | **Archivo + sync OFF** | Inviable a mano; exige desactivar el sync |
| Reorganizar **y** mantener el sync | **Interfaz** | Único camino que produce tombstones |

## Recuperar el estado limpio con el sync activo

Si desactivaste el sync, hiciste la limpieza por archivo y ahora quieres volver a activarlo, la foto del servidor sigue siendo la antigua. El orden que funciona:

1. Activa el sync de marcadores.
2. Borra los duplicados **desde el Gestor**, para que las eliminaciones lleven tombstones.
3. Deja que se propague.

Cuando el servidor esté de acuerdo con la copia local, dejan de pelear.

Alternativa simple y sin mantenimiento: dejar el sync apagado y exportar HTML desde el Gestor como respaldo.

## Verificar que el navegador está cerrado

```bash
ps -eo pid,comm --no-headers | awk '$2 ~ /vivaldi/ {print "CORRE:",$0}'
```

Debe no imprimir nada.

**No uses `pgrep -f vivaldi`**: el propio comando coincide con el patrón y da falso positivo. `pgrep -x vivaldi-bin` es más preciso pero falla si el binario se llama distinto. `ps` con awk sobre `comm` es lo fiable.

Los ficheros `Singleton*` en `~/.config/vivaldi/` desaparecen al cerrar, pero no son prueba suficiente: se borran antes de que mueran los procesos hijos.

## Por qué una escritura se pierde aunque el navegador esté cerrado

Secuencia real observada:

1. Navegador abierto con la foto antigua en memoria.
2. Se escribe el archivo limpio por fuera.
3. El navegador **sigue vivo** y al cerrarse escribe su foto antigua encima.
4. Al reabrir, carga lo que hay en disco: lo antiguo otra vez.

Por eso la verificación con `ps` va **antes** del copiado, no después. Secuencia observada:

1. Navegador abierto con la foto antigua en memoria.
2. Se escribe el archivo limpio por fuera.
3. El navegador **sigue vivo** y al cerrarse escribe su foto antigua encima.
4. Al reabrir, carga lo que hay en disco: lo antiguo otra vez.
