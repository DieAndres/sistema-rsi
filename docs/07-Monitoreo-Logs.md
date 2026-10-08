# Monitoreo, logs y registro de eventos del Sistema RSI

Este documento indica qué registros del propio Sistema RSI se revisan para identificar actividad sospechosa, diagnosticar errores y apoyar la respuesta a incidentes. Incluye aplicación, autenticación, PostgreSQL, Nginx y contenedores.

Los incidentes y activos de organizaciones cargados en la aplicación son datos gestionados por el RSI, no logs de los sistemas de esas organizaciones.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Detectar | Revisar eventos e identificar anomalías. |
| COBIT 2019 | DSS05 | Monitorear la seguridad. |
| ISO/IEC 27001:2022 | A.8.15 y A.8.16 | Registrar eventos y revisar actividades. |
| NIST SP 800-92 | Gestión de logs | Organizar la conservación y revisión de registros. |
| BCU | Monitoreo y registro | Referencia para el seguimiento de eventos. |
| Protección de datos personales | Ley 18.331 | Restringir acceso y evitar datos personales innecesarios. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-MON-07 |
| Versión | 1.1 |
| Responsable | RSI o responsable de seguridad designado |
| Fecha | 08/10/2026 |

## 1. Monitoreo actual

El sistema conserva eventos de auditoría en PostgreSQL mediante `AuditEvent`. Los logs técnicos de los servicios pueden consultarse con `docker compose logs`; el estado de los contenedores se consulta con `docker compose ps`.

Nginx ofrece HTTPS y reenvía las solicitudes al backend. Sus registros permiten revisar accesos, respuestas y errores del proxy. El healthcheck de Nginx no comprueba por sí solo que la API y la BD funcionen.

La revisión actual es manual. No hay un SIEM integrado ni alertas automáticas de seguridad. La integración con Wazuh queda como mejora futura y la parte de SIEM solicitada en la consigna sigue pendiente.

## 2. Fuentes de eventos

| Fuente | Qué permite revisar |
|---|---|
| Login y MFA | Accesos exitosos o fallidos registrados, fallos de TOTP durante el login y activación de MFA. |
| Usuarios y sesiones | Cambios de usuarios, cierre de sesión y revocación de sesiones. |
| Cambios de gestión | Altas, modificaciones y bajas cubiertas por el interceptor de auditoría, con actor, fecha y datos anteriores y nuevos cuando corresponda. |
| Exportaciones | Exportaciones auditadas, usuario que las realizó y ámbito del documento. |
| Nginx | Solicitudes HTTP, errores del proxy y rechazos por límites de solicitudes. |
| Backend y PostgreSQL | Arranque, errores y mensajes operativos emitidos por los servicios. |

No se registra automáticamente toda lectura, solicitud fallida o cambio directo en la BD. La auditoría de cambios de gestión comparte transacción con la operación: si falla su escritura, se revierte el cambio cubierto.

La consulta de auditoría está disponible para el rol `ADMINISTRADOR` en `GET /api/v1/auth/auditoria`, con filtros y paginación. El RSI coordina la revisión y recibe la información mediante un medio autorizado; su rol no tiene acceso directo a esa ruta.

## 3. Qué revisar

Durante la revisión manual se deben buscar situaciones como:

- Intentos fallidos repetidos de login o TOTP.
- Cambios de permisos o cuentas sin una justificación conocida.
- Exportaciones inusuales por cantidad o ámbito.
- Rechazos de acceso y respuestas 429 repetidos, cuando estén disponibles en los logs.
- Errores de API, BD o proxy y fallos al registrar auditoría.

Una anomalía no confirma por sí sola un incidente. Se debe revisar el contexto y seguir el procedimiento de [Gestión de incidentes](04-Gestion-Incidentes.md) cuando corresponda. Los límites de solicitudes de Nginx son un control preventivo y no sustituyen al monitoreo ni generan por sí solos alertas SIEM.

## 4. Conservación y protección

La consigna exige al menos un año de trazabilidad de cambios. Los eventos están persistidos, pero todavía se debe comprobar capacidad, respaldo y recuperación para asegurar ese período. La auditoría comparte BD y equipo con los datos de gestión; no hay una copia independiente de eventos implementada.

- Restringir el acceso a los registros y sus exportaciones.
- No registrar contraseñas, hashes de credenciales, cookies de sesión, semillas o códigos TOTP ni claves privadas.
- Evitar datos personales innecesarios y revisar los metadatos antes de compartir evidencias.
- Definir rotación de logs técnicos y controlar el espacio disponible.
- Conservar fechas consistentes y comprobar la sincronización del equipo.
- Proteger las copias y comprobar que los eventos puedan recuperarse, según el [Plan de continuidad](06-Plan-Continuidad.md).

La ausencia de una purga automática no garantiza conservación anual ni protección contra alteraciones por un administrador de BD.

## 5. Revisión y responsables

| Actividad | Responsable | Frecuencia propuesta |
|---|---|---|
| Revisar auditoría de accesos, usuarios y exportaciones | Administrador; RSI coordina el análisis. | Cada día de uso y antes de una entrega. |
| Revisar errores y disponibilidad | Administrador y responsable técnico. | Cada día de uso y ante una falla. |
| Investigar una anomalía | RSI y responsable técnico. | Al detectarla, según su gravedad. |
| Revisar conservación, copias y capacidad | Administrador. | Periódicamente y después de cambios importantes. |

Registrar fecha de revisión, eventos relevantes, decisiones y acciones. Las frecuencias son propuestas; no implican vigilancia continua ni atención permanente. Comunicar las anomalías al RSI por un canal acordado y conservar las evidencias con acceso restringido.

## 6. Wazuh como mejora futura

Se prevé integrar Wazuh para centralizar logs y eventos de auditoría en un destino independiente, configurar reglas de detección y generar alertas.

La integración requerirá seleccionar las fuentes, configurar su envío seguro y probar al menos un evento que genere una alerta. Hasta completar esas pruebas no se considera implementado el SIEM.

## 7. Evidencias

Las pruebas de [Auditoría de gestión](evidencias/auditoria-gestion.md) documentan registro transaccional, consulta, permisos y rollback. Son evidencia de auditoría de aplicación, no de detección SIEM ni de un año de retención comprobada.

No se dispone todavía de una prueba de alertas Wazuh. Cuando se implemente, se registrarán el evento de prueba, la regla, la alerta y el resultado, sin publicar secretos ni datos personales innecesarios.
