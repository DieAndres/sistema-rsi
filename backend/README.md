# Backend del sistema RSI

API REST del Sistema de Gestión Integrada para el RSI, construida con NestJS, TypeScript, Prisma y PostgreSQL.

## Cómo leer el código

La entrada está en `src/main.ts`. `src/app.module.ts` reúne los módulos y registra los controles de acceso y la auditoría.

Para seguir una operación, empezá por el controlador de su módulo:

1. El archivo `*.controller.ts` define la ruta y recibe los datos de la petición.
2. El DTO de `dto/` describe los datos de entrada; las validaciones se realizan en el servicio.
3. El archivo `*.service.ts` comprueba las reglas y consulta la base con Prisma.

Por ejemplo, crear un activo sigue este recorrido: `seguridad.controller.ts → SeguridadService.crearActivo → prisma.activo.create`.

Organización, seguridad y cumplimiento tienen su lógica en sus propios servicios. Dentro de seguridad y cumplimiento, las operaciones están agrupadas por entidad y las validaciones privadas quedan al final.

Los tipos compartidos de las peticiones autenticadas están en `src/auth/usuario-autenticado.ts`. El guard de autenticación agrega el usuario a la petición. Para entender la auditoría, leé `auditoria.interceptor.ts` junto con `prisma.service.ts`: el interceptor abre la transacción y Prisma reutiliza esa transacción durante la petición.

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

Para iniciar el backend en Docker, desde la raíz del repositorio:

```powershell
docker compose up -d --build backend
docker compose logs --tail 50 backend
```

La API queda disponible en `http://localhost:3001/api/v1`, compatible con el
proxy del frontend. El contenedor usa `backend/.env` y cambia únicamente el host
y puerto de PostgreSQL a `postgres:5432`, manteniendo las credenciales y la base
configuradas. Reutiliza el volumen existente y no ejecuta migraciones al iniciar.
Los archivos `.env` y `node_modules` locales quedan fuera de la imagen.

Para detener solo el backend: `docker compose stop backend`.

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

### Auditoría de gestión

Las modificaciones de los módulos funcionales y las exportaciones se guardan
en `AuditEvent` mediante una transacción común con la operación. El historial
incluye campos anteriores y nuevos y es consultable solo por Administrador:

```text
GET /api/v1/auth/auditoria?entidad=ACTIVO&usuarioId={uuid}&pagina=1
```

Todos los filtros son opcionales. Devuelve `{ eventos, total, pagina, porPagina: 50 }`.
La pantalla Auditoría permite filtrar y desplegar los cambios. Ver
`docs/evidencias/auditoria-gestion.md` y `test/auditoria.e2e-spec.ts`.

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
## Inicialización del primer administrador

### Datos para una demostración

Con PostgreSQL iniciado, las migraciones aplicadas y las dependencias instaladas,
ejecutar desde `backend`:

```powershell
npm.cmd run seed
```

El script usa `DATABASE_URL` de `backend/.env` y también sirve cuando el backend
está ejecutándose en Docker; se ejecuta desde la computadora anfitriona.
Crea **Logística del Ceibo — Demo**, una empresa ficticia con 4 unidades,
6 trabajadores, 5 activos, 3 procesos y 12 asignaciones RACI, 3 riesgos,
3 vulnerabilidades, 3 incidentes con 8 acciones de historial, 2 políticas,
2 procedimientos, 2 planes con 3 hitos y 3 registros de evidencia simulada.
Los procesos se vinculan con sus activos y las unidades tienen responsables.

La carga es transaccional: si falla, se revierte completa. No modifica registros
previos ni crea usuarios de acceso. Si la organización de esta demo ya existe,
no hace cambios; por lo tanto, repetir el comando conserva las ediciones hechas
durante la presentación. Los trabajadores no son cuentas de inicio de sesión.
Las evidencias son descripciones simuladas, sin archivos adjuntos; el historial
de incidentes tampoco representa acciones de usuarios reales. La carga directa
no genera eventos de auditoría de la API. Los registros alimentan los resúmenes
del dashboard sin crear mediciones históricas artificiales.

### Crear la cuenta inicial

En una base nueva no se habilita un registro público. Crear el primer usuario
administrador mediante el comando de bootstrap:

```powershell
$env:BOOTSTRAP_ADMIN_EMAIL = 'admin@ejemplo.com'
$env:BOOTSTRAP_ADMIN_PASSWORD = 'Una-clave-temporal-de-12'
npm run crear-admin
```

El comando solo funciona cuando la tabla `Usuario` está vacía. La contraseña
se almacena siempre con Argon2id; no se guarda ni se imprime el valor original.
Después del primer acceso, eliminar las variables de entorno. El administrador
inicial puede crear las demás cuentas desde el sistema.

## Passkeys / Windows Hello

En `backend/.env`, configurar `WEBAUTHN_ORIGIN` con el origen del navegador
(`http://localhost:5173` en desarrollo). Aplicar las migraciones con
`npx prisma migrate deploy` antes de probar. El frontend registra passkeys desde
**Seguridad de cuenta** y permite usarlas para iniciar sesión. Windows Hello
puede ser el autenticador del navegador; el backend solo recibe y verifica la
respuesta WebAuthn, nunca el PIN. El flujo, las rutas y las pruebas manuales
están descritos en `docs/09-gestion-accesos.md`.

## Ciclo de incidentes

`POST /api/v1/seguridad/incidentes` crea en ABIERTO. `PATCH /api/v1/seguridad/incidentes/{id}` permite mantener la etapa o avanzar por CONTENIDO → ERRADICADO → RECUPERADO → CERRADO. Avanzar exige `accionRealizada`; cerrar exige `leccionesAprendidas`. Los GET incluyen `historial` con acciones, autor autenticado y fecha del servidor. La operación y AuditEvent comparten la transacción de la petición.

La migración `20261001190000_historial_incidentes` requiere `prisma migrate deploy` y `prisma generate`. [Uso, contrato, migración y límites](../docs/evidencias/incidentes-ciclo.md).
