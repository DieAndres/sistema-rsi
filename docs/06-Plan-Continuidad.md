# Plan de Continuidad y Recuperación del Sistema RSI

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-BCP-06 |
| Versión | 1.0 |
| Responsable | Responsable de Seguridad de la Información |
| Fecha | 24/09/2026 |
| Estado | Plan inicial; recuperación no probada |

## 1. Objetivo y alcance

Este plan describe cómo recuperar el Sistema de Gestión Integrada para el RSI si deja de funcionar o se pierden sus datos. Comprende el backend NestJS, la base PostgreSQL ejecutada mediante Docker Compose, el volumen `postgres_data`, la configuración necesaria y las migraciones de Prisma.

El volumen de Docker conserva los datos cuando el contenedor se reinicia, pero no constituye por sí solo una copia de seguridad: una falla del disco o la pérdida del volumen también puede destruir los datos.

## 2. Objetivos de recuperación

Los valores siguientes son objetivos iniciales propuestos para el entorno académico. Deben aprobarse y confirmarse mediante ejercicios de recuperación; no representan resultados ya medidos.

| Métrica | Objetivo inicial |
|---|---|
| RTO de PostgreSQL | 4 horas, objetivo propuesto |
| RTO del backend | 2 horas después de recuperar PostgreSQL, objetivo propuesto |
| RPO de PostgreSQL | 24 horas como máximo, objetivo propuesto condicionado a disponer de respaldo diario |
| Disponibilidad objetivo | 99 %, según la consigna |

Actualmente no se encuentra configurado un proceso automático de respaldo diario ni se ha documentado una restauración probada. Por eso estos objetivos no se consideran verificados.

## 3. Inventario de componentes y respaldos

| Componente | Información que debe protegerse | Estado actual del respaldo |
|---|---|---|
| PostgreSQL | Base de datos del sistema | Pendiente de configurar respaldo automático |
| Volumen `postgres_data` | Archivos de datos de PostgreSQL | Persistente en Docker; no reemplaza un respaldo independiente |
| Backend | Código y dependencias | Código versionado en Git; dependencias reconstruibles desde `package-lock.json` |
| Configuración | `docker-compose.yml`, esquema y migraciones | Versionados; secretos locales en archivos `.env` excluidos de Git |
| Archivos `.env` | Credenciales y cadenas de conexión | Deben conservarse de forma segura fuera del repositorio; no se respaldan en Git |

La copia de PostgreSQL debe guardarse fuera del volumen y del equipo que aloja Docker, en una ubicación con acceso restringido. La frecuencia diaria, la retención y la copia fuera del sitio siguen pendientes de implementación.

## 4. Procedimiento de recuperación

### 4.1 Caída del backend

1. Confirmar que el contenedor PostgreSQL está disponible y saludable con `docker compose ps`.
2. Revisar los registros del backend y corregir la causa identificada.
3. Iniciar el backend desde `backend/` con `npm.cmd run start:dev`.
4. Comprobar el servicio con `GET /api/v1/` y una consulta de lectura, por ejemplo `GET /api/v1/kpis/resumen`.

### 4.2 Caída del contenedor PostgreSQL sin pérdida del volumen

1. Desde la raíz del repositorio, revisar el estado con `docker compose ps`.
2. Iniciar PostgreSQL con `docker compose up -d postgres`.
3. Esperar a que el healthcheck indique estado saludable.
4. Desde `backend/`, verificar la conexión y aplicar migraciones pendientes con `npx.cmd prisma migrate deploy`.
5. Iniciar el backend y comprobar las rutas de lectura.

### 4.3 Pérdida o corrupción de la base de datos

1. Detener el uso de la aplicación para evitar escrituras adicionales.
2. Identificar la última copia de seguridad válida y su fecha.
3. Restaurar la copia en una instancia PostgreSQL controlada siguiendo el procedimiento asociado a la herramienta de respaldo elegida.
4. Verificar la integridad y consistencia de los datos restaurados.
5. Aplicar las migraciones necesarias desde `backend/`.
6. Iniciar el backend y comprobar consultas, relaciones y operaciones básicas.
7. Registrar el resultado, el punto de recuperación alcanzado y las acciones de seguimiento.

El mecanismo y los comandos concretos de restauración se completarán cuando se implemente el respaldo automatizado.

## 5. Prueba de restauración

La restauración debe probarse periódicamente en un entorno aislado, sin sobrescribir la base de datos de desarrollo. La prueba debe verificar:

- que la copia se puede leer y restaurar;
- que las tablas y relaciones están presentes;
- que las migraciones se pueden aplicar;
- que el backend conecta a la base restaurada;
- que una consulta de lectura devuelve una respuesta válida.

Fecha, responsable, copia utilizada, resultado y fallos deben registrarse en `docs/evidencias/`. A la fecha de esta versión, no hay una prueba de restauración documentada.

## 6. Comunicación y responsabilidades operativas

Ante una interrupción, informar al responsable de seguridad y a las personas que dependen del sistema. La comunicación debe indicar el servicio afectado, el impacto conocido, las medidas tomadas y la estimación de recuperación. Los contactos y canales se completarán para el entorno de despliegue definitivo.

## 7. Revisión

Este plan debe revisarse al menos una vez al año, después de cambios relevantes de infraestructura o cuando una prueba de recuperación identifique mejoras.

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 24/09/2026 | Creación del plan inicial para el entorno Docker y PostgreSQL. |
