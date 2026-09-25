# Backend del sistema RSI

API REST del Sistema de Gestión Integrada para el RSI, construida con NestJS, TypeScript, Prisma y PostgreSQL.

## Preparación

Desde la raíz del proyecto, iniciá PostgreSQL:

```powershell
docker compose up -d postgres
```

Desde esta carpeta, instalá las dependencias y prepará Prisma:

```powershell
npm.cmd install
npx.cmd prisma generate
npx.cmd prisma migrate deploy
```

La variable `DATABASE_URL` debe estar definida en `backend/.env`.

## Ejecución

```powershell
npm.cmd run start:dev
```

La API utiliza el prefijo `/api/v1`.

## Organización, activos y riesgos

- `POST /organizaciones/{id}/procesos` crea un proceso dentro de la organización.
  Acepta `version`, `estado`, `responsableId` y `fechaRevision`; la matriz RACI
  se administra con `/organizaciones/asignaciones-raci`.
- `GET /organizaciones/{id}/mapa` devuelve unidades con responsable y procesos
  con sus asignaciones RACI para presentar la vista integrada.
- Los activos nuevos requieren `clasificacion`: `PUBLICO`, `INTERNO`,
  `CONFIDENCIAL` o `SECRETO`. `GET /seguridad/activos?unidadId={id}` incluye
  activos de esa unidad y sus descendientes jerárquicos.
- Riesgos reciben `probabilidad` e `impacto` como enteros de 1 a 5. Las
  respuestas incluyen `puntajeInherente`, calculado como su producto.

## Procesos de cumplimiento y búsqueda

Los procedimientos incluyen `fechaRevision`. Los planes exponen hitos mediante:

```text
POST   /api/v1/cumplimiento/planes/{planId}/hitos
GET    /api/v1/cumplimiento/planes/{planId}/hitos
PATCH  /api/v1/cumplimiento/hitos/{id}
DELETE /api/v1/cumplimiento/hitos/{id}
```

La búsqueda global agrupa resultados por tipo de entidad:

```text
GET /api/v1/busqueda?q=texto&unidadId={id}&estado=ABIERTO&severidad=ALTA
```

Los parámetros son opcionales. `unidadId` incluye descendientes; estado se aplica
a entidades con estado y severidad a incidentes.

## KPI

El resumen de indicadores se obtiene con:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/kpis/resumen"
```

La respuesta incluye activos totales y con responsable, riesgos abiertos,
vulnerabilidades abiertas y críticas, e incidentes agrupados por estado.

## Exportación del inventario de activos

`GET /api/v1/exportaciones/organizaciones/{id}/inventario-activos` descarga un
Markdown con los activos de esa organización. Es un borrador basado en
`plantilla/isaca/02-registro-activos.md`: ubicación, versión de software y
matriz crítica quedan pendientes porque aún no tienen datos de origen. Ver
`docs/exportaciones/mapeo-inventario-activos.md`. La ruta aún no cuenta con
autorización ni auditoría; usarla solo con datos sintéticos hasta integrarlas.

## Declaración de Aplicabilidad (SoA)

El catálogo expone los 93 identificadores del Anexo A de ISO/IEC 27001:2022
con temas orientativos. Las evaluaciones se registran para cada organización.
El alcance de evaluación se guarda en `Organizacion.alcanceSgsi` y se puede
definir o actualizar con el endpoint de organización usando ese campo.
Las rutas son:

```text
GET /api/v1/exportaciones/organizaciones/{id}/soa/controles
PUT /api/v1/exportaciones/organizaciones/{id}/soa/controles/{controlId}
PUT /api/v1/exportaciones/organizaciones/{id}/soa/brechas/{funcion}
GET /api/v1/exportaciones/organizaciones/{id}/soa
```

Para una evaluación se envían `aplica` (`true`, `false` o `null`),
`justificacion`, `insumos`, `estado`, `evidenciaId` y `planId`. La evidencia y
el plan deben pertenecer a la misma organización. Para una brecha se envían
`perfilObjetivo` (`Básico`, `Estándar` o `Avanzado`), `evidencia`, `madurez`
(0 a 4) y `acciones`. Los campos pendientes pueden ser `null`.

La descarga es un **borrador Markdown** basado en
`plantilla/isaca/11-soa-plan-tratamiento.md`, con totales corregidos a
37/8/14/34 según ISO/IEC 27001:2022. El informe identifica la organización,
resume los registros disponibles como insumos y no evalúa la aplicación RSI.
Los conteos no determinan aplicabilidad ni cumplimiento; el alcance formal,
las justificaciones y las evidencias requieren revisión para esa organización.
La ruta aún no cuenta con autorización ni auditoría; usar solo datos sintéticos
hasta integrarlas. Ver `docs/exportaciones/mapeo-soa.md`.

La organización DEMO local usa datos sintéticos y una delimitación preliminar.
Los controles con aplicabilidad afirmativa siguen sin evidencia vinculada;
otros quedan pendientes cuando faltan datos de la organización. No se declara
implementación ni madurez basándose en funcionalidades de la aplicación.

## Comprobaciones

```powershell
npm.cmd run build
npm.cmd test -- --runInBand
npm.cmd run test:e2e -- --runInBand
```

## Módulos actuales

- Organización: organizaciones, unidades, trabajadores, procesos y RACI.
- Seguridad: activos, riesgos, vulnerabilidades e incidentes.
- Cumplimiento: políticas, procedimientos, planes y evidencias.
- KPI: resumen de indicadores operativos.

Las credenciales y archivos `.env` son locales y no deben subirse al repositorio.
