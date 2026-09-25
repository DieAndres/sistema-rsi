# Evidencia: pruebas automatizadas del backend

## Fecha

24/09/2026

## Objetivo

Verificar flujos de organización, seguridad, cumplimiento y KPI, incluyendo
respuestas correctas y rechazo de datos o relaciones inválidas.

## Comando ejecutado

```powershell
npm.cmd run test:e2e -- --runInBand
```

Ejecutado desde `backend/`, con PostgreSQL disponible mediante Docker Compose.

## Resultado

```text
Test Suites: 11 passed, 11 total
Tests:       43 passed, 43 total
Snapshots:   0 total
Time:        10.245 s
```

Resultado general: **Aprobado**.

## Estructura de las pruebas

```text
backend/test/
├── app.e2e-spec.ts
├── busqueda.e2e-spec.ts
├── cumplimiento/
│   └── cumplimiento.e2e-spec.ts
├── helpers/
│   └── crear-aplicacion-de-prueba.ts
├── jest-e2e.json
├── kpi/
│   └── kpi.e2e-spec.ts
├── organizacion/
│   ├── organigrama.e2e-spec.ts
│   └── organizaciones.e2e-spec.ts
└── seguridad/
    ├── activos.e2e-spec.ts
    ├── incidentes.e2e-spec.ts
    ├── riesgos.e2e-spec.ts
    ├── seguridad.e2e-spec.ts
    └── vulnerabilidades.e2e-spec.ts
```

## Casos cubiertos

### Organización

- Crear una organización y rechazarla sin nombre.
- Crear unidades jerárquicas, trabajadores, procesos y asignaciones RACI.
- Asignar responsables de unidad y consultar la vista integrada de organigrama/RACI.
- Rechazar datos obligatorios o referencias inexistentes.

### Seguridad

- Crear activos, riesgos, vulnerabilidades e incidentes asociados.
- Clasificar activos, filtrar por unidad y calcular puntaje inherente del riesgo.
- Rechazar unidades, activos, trabajadores y responsables inexistentes o de otra unidad.
- Rechazar campos obligatorios ausentes y tratamientos/SLA inválidos.

### Cumplimiento

- Crear políticas y procedimientos relacionados.
- Rechazar relaciones inexistentes o pertenecientes a otra organización.
- Rechazar datos obligatorios y fechas inválidas en planes.
- Validar responsables en la misma organización.
- Crear planes y evidencias con relaciones válidas.
- Crear hitos de planes con fecha y estado.

### Búsqueda

- Buscar por texto y filtrar resultados por unidad organizativa, estado y severidad.

### Aplicación

- Verificar la ruta base `/api/v1`.
- Verificar la estructura y tipos numéricos del resumen KPI.

### KPI

- Consultar el catálogo de fórmulas disponibles y rechazar fórmulas desconocidas.
- Crear indicadores, cambiar metas y calcular mediciones para todas las fórmulas.
- Consultar el histórico y rechazar mediciones de indicadores inactivos.

## Controles demostrados

- Validación de campos obligatorios.
- Validación de relaciones entre entidades.
- Rechazo de datos que podrían generar registros huérfanos.
- Validación de pertenencia entre unidades, organizaciones y responsables.
- Validación de tratamiento de riesgos, SLA y lecciones aprendidas.
- Funcionamiento del prefijo común `/api/v1`.

## Observaciones de ejecución

La suite terminó correctamente. Node mostró una advertencia experimental de
VM Modules y el adaptador PostgreSQL mostró una advertencia de deprecación de
`client.query()`; ninguna impidió que las 41 pruebas pasaran.

## Archivos relacionados

- Código de pruebas: `backend/test/`.
- Decisiones comunes: `docs/decisiones_comunes_blue_team_rsi.md`.
- Código del backend: `backend/src/`.
