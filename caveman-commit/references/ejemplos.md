# Ejemplos

## Feature con cuerpo
```
feat(api): add GET /users/:id/profile

El cliente móvil necesita el perfil sin la carga útil completa para reducir el
ancho de banda LTE en las pantallas de inicio en frío.

Closes #128
```

## Breaking change
```
feat(api)!: rename /v1/orders to /v1/checkout

BREAKING CHANGE: el cliente en /v1/orders debe migrar a /v1/checkout antes del
2026-06-01. La vieja ruta devolverá 410 después de esa fecha.
```

## Multi-scope (un commit por scope)
```
1. feat(auth): add JWT login
   git add src/auth/login.ts src/auth/jwt.ts

2. feat(api): add GET /users/:id/profile
   git add src/api/profile.ts

3. docs: update readme auth flow
   git add README.md
```

## Errores comunes
- ❌ `feat: added user profile endpoint from database` (pasado + relleno)
- ✅ `feat(api): add GET /users/:id/profile`
- ❌ Mezclar `auth` y `api` en un mismo commit
