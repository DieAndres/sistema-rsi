# Evidencia: pruebas automatizadas del backend

## Fecha

22/09/2026

## Objetivo

Verificar que los endpoints principales respondan correctamente y rechacen datos inválidos o relaciones inexistentes.

## Comando ejecutado

```powershell
npm.cmd run test:e2e -- --runInBand
```

## Resultado

```text
Test Suites: 4 passed, 4 total
Tests:       8 passed, 8 total
Snapshots:   0 total
```

Resultado general: **Aprobado**.

## Estructura de las pruebas

```text
backend/test/
├── organizacion/organizaciones.e2e-spec.ts
├── seguridad/seguridad.e2e-spec.ts
├── cumplimiento/cumplimiento.e2e-spec.ts
├── helpers/crear-aplicacion-de-prueba.ts
└── app.e2e-spec.ts
```

## Casos cubiertos

### Organización

- Crear una organización correctamente.
- Rechazar una organización sin nombre.

### Seguridad

- Rechazar una vulnerabilidad cuyo activo no existe.

### Cumplimiento

- Crear una política y un procedimiento relacionado.
- Rechazar un procedimiento con una política inexistente.
- Rechazar un plan con un riesgo inexistente.
- Rechazar una evidencia con un incidente inexistente.

### Aplicación

- Verificar que la aplicación responda correctamente en `/api/v1`.

## Controles demostrados

- Validación de campos obligatorios.
- Validación de relaciones entre entidades.
- Rechazo de datos que podrían generar registros huérfanos.
- Funcionamiento del prefijo común `/api/v1`.

## Archivos relacionados

- Código de pruebas: `backend/test/`.
- Decisiones comunes: `docs/decisiones_comunes_blue_team_rsi.md`.
- Código del backend: `backend/src/`.
