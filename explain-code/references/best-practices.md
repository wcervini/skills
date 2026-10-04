# Verificación al explicar código

Checklist antes de responder. Copia mental, no la muestres al usuario.

## Verificar

1. Leí el archivo completo o el snippet completo, no solo el nombre.
2. Confirmé orden de ejecución (qué corre primero).
3. Identifiqué tipos de parámetros y retorno.
4. Si hay imports de paquetes, explico qué hacen en 1 línea.
5. No mezclo Drizzle con Astro/endpoints en la misma explicación.

## Si algo falla o es ambiguo

- Dilo explícito: "No puedo confirmar X sin ver Y".
- No inventes URLs ni comportamiento.
- Ejecuta el código con `node` cuando sea posible para verificar salida.

## Flujo de calidad

1. Explica
2. Verifica con ejecución (`node archivo.mjs`) si hay ejemplo
3. Solo entrega cuando la salida coincide con lo explicado
