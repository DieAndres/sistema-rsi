# Inventario y clasificación de activos del Sistema RSI

## Encabezado de mapeo normativo

| Marco | Ítem | Aporte |
|---|---|---|
| MCU 5.0 | Identificar; ID.AM-01, ID.AM-02 e ID.AM-05 | Inventariar componentes y priorizarlos por clasificación y criticidad. |
| COBIT 2019 | BAI09 y APO12 | Asignar responsables y apoyar el análisis de riesgos. |
| ISO/IEC 27001:2022 e ISO/IEC 27002:2022 | Control 5.9 | Mantener un inventario de información y activos asociados. |
| BCU — Guía de estándares mínimos de gestión | GA.1 y GA.2 | Identificar activos, responsables y clasificación de la información. |
| Ley 18.331 | Art. 10 | Identificar los datos personales que deben protegerse. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-ACT-02 |
| Versión | 1.1 |
| Fecha | 07/10/2026 |
| Responsable | RSI |
| Estado | Inventario del entorno local; equipo anfitrión pendiente de relevar |

## 1. Objetivo

Identificar los activos necesarios para desarrollar y operar el Sistema RSI, clasificarlos y usarlos como base del análisis de riesgos.

Este documento registra los activos de la plataforma. Los activos que las organizaciones cargan en la aplicación pertenecen a sus propios inventarios.

## 2. Metodología

Identificar los componentes en la arquitectura, código y configuración del proyecto; registrar su ubicación y responsable y clasificarlos según confidencialidad e impacto. Actualizar el inventario cuando cambie la arquitectura o el despliegue. Las ubicaciones son lógicas o del repositorio y los responsables se indican por rol, sin incluir secretos.

## 3. Clasificación

| Nivel | Regla de acceso | Ejemplo del RSI |
|---|---|---|
| Público | Distribución autorizada sin restricción | Código o documentación publicados. |
| Interno | Acceso del equipo desarrollador u operador | Configuración sin secretos y diagramas operativos. |
| Confidencial | Acceso limitado por función y ámbito | Datos de usuarios, registros de organizaciones y auditoría. |
| Secreto | Acceso estrictamente limitado | Contraseñas de servicio, semillas TOTP, tokens y claves privadas. |

La clasificación indica quién puede acceder a la información. La criticidad indica el impacto de perder un activo o interrumpir su funcionamiento: «Sí» identifica activos esenciales para la operación o seguridad del RSI. Ambas valoraciones deben revisarse según el uso y despliegue.

## 4. Inventario de activos

| ID | Activo | Tipo | Ubicación | Responsable | Clasificación | Crítico | Descripción |
|---|---|---|---|---|---|---|---|
| RSI-A01 | Interfaz web | Software | `frontend/src/`, `frontend/package.json` | Responsable técnico | Interno | Sí | React 19 y Vite 8; pantallas de gestión y consulta. |
| RSI-A02 | API y lógica de negocio | Software | `backend/src/`, `backend/package.json` | Responsable técnico | Interno | Sí | NestJS 12; API REST bajo `/api/v1`. |
| RSI-A03 | Identidad, sesiones y autorización | Software | `backend/src/auth/`, `backend/prisma/schema.prisma` | Responsable técnico | Confidencial | Sí | Autenticación, TOTP, sesiones y permisos por rol y ámbito. |
| RSI-A04 | Base de datos PostgreSQL | Servicio | `docker-compose.yml`, `backend/prisma/` | Administrador | Confidencial | Sí | PostgreSQL 16; almacenamiento y consulta de datos. |
| RSI-A05 | Datos de la aplicación | Datos | Tablas de `backend/prisma/schema.prisma` | RSI | Confidencial | Sí | Cuentas, sesiones y registros de gestión. |
| RSI-A06 | Volumen persistente de PostgreSQL | Almacenamiento | `postgres_data` en `docker-compose.yml` | Administrador | Confidencial | Sí | Conserva los datos entre reinicios; no es una copia de seguridad. |
| RSI-A07 | Secretos y credenciales | Datos | Variables de entorno y archivos locales excluidos de Git | Administrador | Secreto | Sí | Credenciales de BD, tokens, semillas TOTP y clave privada TLS. |
| RSI-A08 | Eventos de auditoría | Datos | Modelo `AuditEvent` y módulo `backend/src/auth/` | Administrador | Confidencial | Sí | Actor, fecha, resultado y cambios de las operaciones cubiertas. |
| RSI-A09 | Código, esquema y migraciones | Software / datos | `frontend/`, `backend/`, Git | Responsable técnico | Interno | Sí | Permiten mantener y reconstruir la aplicación. |
| RSI-A10 | Configuración de ejecución | Configuración | `docker-compose.yml`, Dockerfiles y variables de entorno | Administrador | Interno | Sí | Compose define frontend, backend y PostgreSQL. |
| RSI-A11 | Nginx y configuración TLS | Servicio / configuración | `infrastructure/nginx/`, `frontend/Dockerfile` | Administrador | Interno | Sí | Sirve el frontend, reenvía la API y ofrece HTTPS local con certificado autofirmado. |

El código publicado puede clasificarse como Público; los secretos y las configuraciones privadas conservan sus restricciones. Las versiones indicadas corresponden a las declaradas en el proyecto.

La configuración y las pruebas locales de Nginx/TLS se describen en [la guía de Nginx](../infrastructure/nginx/README.md) y [la evidencia TLS](./evidencias/tls-rnf04.md).

### Componentes pendientes

| Componente | Situación |
|---|---|
| Wazuh / SIEM | Integración pendiente para centralizar eventos y generar alertas. |
| Respaldo independiente | Automatización, copia externa y prueba de restauración pendientes. |
| Equipo anfitrión y red | Falta relevar equipo, sistema operativo, ubicación y responsable del entorno de entrega. |

## 5. Matriz crítica

Esta matriz relaciona las funciones del RSI con los activos que las sostienen. Los objetivos de recuperación se definen en el [plan de continuidad](./06-Plan-Continuidad.md).

| Función del RSI | Activos | Impacto de una interrupción |
|---|---|---|
| Consultar y modificar registros | RSI-A01 a RSI-A06, RSI-A10 y RSI-A11 | Alto: impide la gestión y consulta. |
| Iniciar sesión y aplicar permisos | RSI-A01 a RSI-A05, RSI-A07, RSI-A10 y RSI-A11 | Alto: bloquea el acceso autorizado. |
| Conservar trazabilidad | RSI-A02, RSI-A04, RSI-A05 y RSI-A08 | Alto: dificulta reconstruir cambios e investigar incidentes. |
| Recuperar datos y servicio | RSI-A04, RSI-A06, RSI-A07, RSI-A09 a RSI-A11 y respaldo independiente pendiente | Alto: puede causar pérdida prolongada o irreversible de datos. |

## 6. Responsabilidades

| Rol | Responsabilidad |
|---|---|
| RSI | Mantener y revisar el inventario, la clasificación y criticidad; utilizarlo para priorizar riesgos. |
| Administrador | Verificar componentes desplegados, versiones, configuración, almacenamiento y medios de respaldo. |
