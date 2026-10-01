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

## Verificación de autenticación agregada el 30/09/2026

Se ejecutaron `backend/src/auth/password.spec.ts` y `passkey.service.spec.ts`:
2 suites y 2 pruebas aprobadas. Cubren Argon2id, bcrypt, compatibilidad con
`scrypt` y rechazo de un desafío WebAuthn vencido o reutilizado. También
compilaron backend y frontend. Estas pruebas no sustituyen el registro y login
manual con Windows Hello, que sigue pendiente de evidencia.

## Permisos de búsqueda y KPI — 01/10/2026

Comando: `npm.cmd run test:e2e -- --runInBand permisos-busqueda-kpi.e2e-spec.ts`.
Resultado: 1 suite y 3 pruebas aprobadas.

Se comprobaron las ocho rutas HTTP de búsqueda y KPI: acceso permitido a
Administrador/RSI; HTTP 403 para Dueño de unidad/Lector sin ejecutar el servicio;
HTTP 401 sin autenticación. La prueba usa los guards reales con identidad y
servicios sustituidos; no modifica PostgreSQL ni acredita cálculos KPI.

## Configuración e histórico KPI en web — 01/10/2026

El Dashboard incorpora la sección «Indicadores y metas»: alta y edición de
código/nombre/descripción/fórmula/meta, desactivación/reactivación, registro
manual de mediciones y tabla histórica con fecha y valor. El código no cambia
al editar. Se utiliza el catálogo del backend, sin fórmulas arbitrarias.
Administrador y RSI mantienen el acceso exclusivo.

Comando: `npm.cmd run test:e2e -- --runInBand kpi-web.e2e-spec.ts permisos-busqueda-kpi.e2e-spec.ts`.
Resultado: 2 suites y 4 pruebas aprobadas. La prueba KPI usa PostgreSQL y
solicitudes autenticadas: crea un indicador temporal, mide activos reales,
cambia fórmula/meta, comprueba bloqueo por desactivación, conservación del
histórico, reactivación y auditoría de mediciones. Elimina solo sus registros
de prueba al finalizar. Esto verifica el flujo de API utilizado por la web;
no es una prueba automatizada de interacción con el navegador.

Frontend: `npm.cmd run build` y ESLint de los dos componentes KPI aprobados.
El histórico existente guarda valor/fecha; no guarda versiones de fórmula ni
meta. La interfaz advierte que cambios de configuración no recalculan
mediciones anteriores. No hay captura automática programada.

## Ciclo de incidentes y panel de seguimiento — 01/10/2026

Comando: `npm.cmd run test:e2e -- --runInBand incidentes-ciclo.e2e-spec.ts` desde backend. Resultado: 1 suite y 1 prueba aprobadas con PostgreSQL y autenticación real. Recorre ABIERTO → CONTENIDO → ERRADICADO → RECUPERADO → CERRADO, registra varias acciones en una etapa y verifica autor, fecha y seis AuditEvent. Rechaza estado desconocido, saltos, retrocesos, avance sin acción y cierre sin lecciones; tampoco permite eliminar las lecciones de un incidente cerrado. El autor enviado por el cliente no sustituye al autenticado.

Backend y frontend compilaron; ESLint de los archivos modificados pasó. Se comprobó visualmente la separación Editar/Seguimiento, las opciones disponibles, el recorrido resaltado y el historial. Esa comprobación no constituye una prueba automatizada de interacción con la web ni un simulacro operativo. [Detalle y límites](incidentes-ciclo.md).
