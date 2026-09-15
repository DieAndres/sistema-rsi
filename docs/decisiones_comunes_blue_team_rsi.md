# Decisiones comunes iniciales — Blue Team

## Sistema de Gestión Integrada para el RSI

> Documento de acuerdo entre Persona 1 —Gestión y Cumplimiento— y Persona 2 —Plataforma y Seguridad—.

**Objetivo:** fijar una base técnica simple, coherente y modificable para que ambas personas puedan trabajar en paralelo sin bloquearse.

Estas decisiones son iniciales y pueden cambiarse de común acuerdo cuando aparezca una necesidad real.

## 1. Principios de decisión

- Priorizar la simplicidad: evitar microservicios, Kubernetes y componentes innecesarios.
- Usar un solo sistema, un solo repositorio y una sola base PostgreSQL.
- Separar responsabilidades por módulos, manteniendo contratos claros.
- Usar tecnologías open source fáciles de ejecutar con Docker.
- Diseñar primero lo mínimo necesario para llegar al H1 —modelo de datos y arquitectura— y ampliar después.
- No duplicar responsabilidades: Persona 1 consume usuarios, permisos y auditoría; Persona 2 no reimplementa los CRUD de gestión.

## 2. Stack tecnológico acordado

| Componente | Decisión inicial | Motivo |
|---|---|---|
| Frontend | React + Vite + TypeScript | Suficiente para CRUD, formularios y dashboard; más simple que Next.js para una aplicación interna. |
| Backend | NestJS + TypeScript | Estructura modular, API REST clara y mismo lenguaje que el frontend. |
| Base de datos | PostgreSQL | Open source, robusta y adecuada para las relaciones del sistema. |
| ORM | Prisma | Simplifica el modelo, las migraciones y las relaciones. |
| Autenticación | Backend implementado por Persona 2 | Evita introducir Keycloak al inicio; debe soportar MFA/WebAuthn según la consigna. |
| Reverse proxy | Nginx | Simple para TLS y publicación del frontend/backend. |
| SIEM | Wazuh | Open source y previsto para recibir eventos y logs. |
| Dashboard | Frontend propio inicialmente; Grafana solo si aporta valor | Evita añadir complejidad antes de tener datos y KPIs. |
| Exportaciones | Servicio dentro del backend | Mantiene una única aplicación y genera los formatos requeridos. |
| Despliegue | Docker Compose | Permite levantar los servicios de forma reproducible. |

### Decisión importante: monolito modular

En esta primera versión no se utilizarán microservicios. NestJS será un único backend modular. Esto reduce la integración, el despliegue y la depuración, manteniendo separados internamente los dominios.

## 3. Arquitectura general

La aplicación será una web cliente-servidor:

```text
Usuario
  ↓
Nginx → Frontend React → API REST NestJS → PostgreSQL mediante Prisma
                                      ├→ Exportador de documentos
                                      └→ Auditoría/logs → Wazuh

Frontend/Dashboard → API NestJS → datos y KPIs
```

El backend concentra la lógica de negocio, accede a PostgreSQL, genera exportaciones y emite eventos de auditoría. Persona 2 conecta esos eventos con el mecanismo de logs/SIEM.

La arquitectura se documentará usando **C4** como metodología única para la versión 1. Se elige por su claridad, bajo costo documental y correspondencia directa con la implementación.

## 4. Modelo de datos compartido

Persona 1 puede diseñar y desarrollar sus entidades sin esperar la implementación de autenticación.

| Entidad | Uso |
|---|---|
| `organization` | Organización principal. |
| `organizational_unit` | Unidad jerárquica. `type`: `AREA`, `DIVISION`, `DEPARTMENT` o `SECTOR`; `parent_id` forma el árbol. |
| `worker` | Trabajador de la organización; pertenece a una unidad. |
| `user` | Cuenta de acceso, responsabilidad de Persona 2. Puede vincularse con `worker`. |
| `role` / `permissions` | Roles y permisos de acceso, responsabilidad de Persona 2. |
| `process` | Proceso de seguridad utilizado por RACI. |
| `raci_assignment` | Relaciona proceso, trabajador y tipo R/A/C/I. |
| `asset` | Activo con dueño persona/unidad, clasificación y criticidad. |
| `vulnerability` | Vulnerabilidad, CVSS, estado, SLA y responsable. |
| `risk` | Riesgo, probabilidad, impacto, tratamiento, residual, aceptación y responsable. |
| `incident` | Incidente, ciclo de vida, responsable y activos relacionados. |
| `policy` / `procedure` | Documentos versionados con estado, responsable y revisión. |
| `plan` | Plan anual o de acción, con responsables, fechas, hitos y estado. |
| `evidence` | Referencia a evidencia asociable a controles, riesgos o incidentes. |
| `audit_event` | Evento de trazabilidad producido por acciones del sistema. Persona 2 define su almacenamiento y seguridad. |

### Regla de identificadores

- Usar UUID como identificador principal.
- Relacionar módulos por ID, sin duplicar datos.
- Ejemplo: `risk.responsible_user_id` referencia un usuario; el módulo de riesgos no guarda su nombre, contraseña ni rol.

## 5. Usuarios, roles y permisos

| Rol | Permiso inicial |
|---|---|
| Administrador | Configuración completa, usuarios, roles, seguridad y acceso total a los módulos. |
| RSI | CRUD completo de gestión y cumplimiento; consulta de auditoría, dashboard y exportaciones. |
| Dueño de unidad | Consulta y actualización de la información de su unidad; participa como responsable en activos, riesgos, incidentes y planes. |
| Lector | Solo lectura de la información autorizada; sin altas, modificaciones ni eliminaciones. |

El detalle fino podrá ajustarse. Persona 1 declara qué operaciones necesitan protección —crear, leer, actualizar, eliminar, exportar o aprobar— y Persona 2 aplica las reglas de autorización.

## 6. Contrato entre Persona 1 y Persona 2

| Tema | Responsable | Acuerdo |
|---|---|---|
| Identidad del usuario | Persona 2 | El backend entrega a Persona 1 `user_id`, `role` y, si corresponde, `worker_id` y `organizational_unit_id`. |
| Referencias a responsables | Compartido | Persona 1 guarda `responsible_user_id` o `responsible_worker_id`; no administra credenciales. |
| Autorización | Persona 2 | Los endpoints de Persona 1 declaran la operación requerida; Persona 2 protege el acceso. |
| Auditoría | Persona 2 define el mecanismo; Persona 1 genera eventos | Toda alta, modificación, baja lógica, aprobación y exportación relevante produce un evento. |
| KPIs | Persona 1 aporta datos; Persona 2 visualiza | Persona 1 expone consultas o endpoints agregados; Persona 2 construye el dashboard. |
| SIEM | Persona 2 | Persona 1 no se conecta directamente a Wazuh; genera eventos mediante el mecanismo común. |
| Exportaciones | Persona 1 | Persona 1 genera documentos; Persona 2 asegura permisos y auditoría. |

### Evento de auditoría mínimo

```json
{
  "event_type": "RISK_UPDATED",
  "entity_type": "risk",
  "entity_id": "uuid",
  "action": "UPDATE",
  "actor_user_id": "uuid",
  "timestamp": "2026-09-14T14:00:00Z",
  "result": "SUCCESS",
  "metadata": {"changed_fields": ["impact", "status"]}
}
```

## 7. Contrato mínimo de API

La API usará REST, JSON y el prefijo `/api/v1`.

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/api/v1/<recurso>` | Listar. |
| `GET` | `/api/v1/<recurso>/:id` | Consultar detalle. |
| `POST` | `/api/v1/<recurso>` | Crear. |
| `PATCH` | `/api/v1/<recurso>/:id` | Modificar parcialmente. |
| `DELETE` | `/api/v1/<recurso>/:id` | Eliminar o desactivar. |
| `POST` | `/api/v1/exports/<tipo>` | Generar una exportación. |
| `GET` | `/api/v1/kpis/...` | Entregar datos agregados para el dashboard. |

Formato de error común: `codigoEstado`, `codigo`, `mensaje` y `detalles` opcional. Las fechas usarán ISO 8601. Los nombres de entidades, campos, módulos y endpoints estarán en español para mantener una implementación coherente con la documentación y la interfaz.

## 8. Repositorio y Git

```text
/
├── frontend/
├── backend/
├── infrastructure/
│   ├── docker/
│   └── nginx/
├── docs/
│   ├── evidencias/
│   ├── arquitectura/
│   └── exportaciones/
├── plantilla/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

- `main`: versiones estables.
- `develop`: rama de integración.
- `feature/<nombre>`: tareas de desarrollo.
- No hacer push directo a `main`.
- Antes de fusionar, la otra persona revisa que no se rompa el contrato compartido.

## 9. Reglas de trabajo en paralelo

- Comunicar antes de fusionar migraciones que afecten entidades compartidas.
- No cambiar nombres de campos compartidos sin avisar.
- Mantener `.env.example` sin secretos reales; los `.env` reales no se suben a Git.
- Crear datos de prueba mediante seed, no únicamente de forma manual.
- Toda funcionalidad importante debe dejar evidencia en `docs/evidencias/` y registrarse en la bitácora.
- Registrar nuevas decisiones o cambios importantes en `docs/decisiones.md`.
- Antes de la pre-entrega, generar el tag `v1.0` sobre una versión probada por ambos.

## 10. Decisiones abiertas

- Si Grafana es necesario o alcanza el dashboard React.
- Si Redis aporta valor; inicialmente no es obligatorio.
- Formato técnico exacto de cada exportador, después de revisar las plantillas oficiales.
- Permisos más granulares que los cuatro roles iniciales.
- Borrado físico o lógico por entidad.
- Campos definitivos y tablas auxiliares.
- Uso de almacenamiento externo para evidencias; inicialmente se permiten archivos en volumen local y metadatos en PostgreSQL.

## 11. Orden inmediato de trabajo

1. Crear el repositorio y la estructura de carpetas.
2. Crear Docker Compose con PostgreSQL y esqueletos de frontend/backend.
3. Crear y aprobar el modelo ER compartido.
4. Definir roles, permisos iniciales y contrato de auditoría.
5. Documentar la arquitectura con la metodología C4.
6. Dividir el desarrollo: Persona 1 comienza con organigrama, trabajadores, RACI y activos; Persona 2 comienza con usuarios, login, roles y auditoría.
7. Integrar temprano una operación completa: crear un activo autenticado y registrar su evento de auditoría.

## 12. Resumen del acuerdo

> React + Vite + TypeScript, NestJS + TypeScript, PostgreSQL + Prisma, Docker Compose, Nginx, Wazuh y un monolito modular.

- **Persona 1:** módulos de gestión, cumplimiento y exportaciones.
- **Persona 2:** identidad, autorización, plataforma, auditoría, backups, SIEM y seguridad.
- **Compartido:** modelo de datos transversal, contrato REST y formato de eventos.

_Documento inicial, sujeto a cambios acordados por ambos integrantes._
