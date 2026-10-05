# Monitoreo Logs y Registro de Eventos del Sistema RSI

Este documento define el monitoreo del **Sistema de Gestión Integrada para el RSI**: su frontend con Nginx, API NestJS, autenticación, autorización, PostgreSQL, auditoría y entorno de ejecución con Docker Compose. Su objetivo es detectar actividad anómala, conservar trazabilidad y apoyar la respuesta a incidentes de la propia plataforma.

Los activos, riesgos, vulnerabilidades e incidentes que las organizaciones registran son **datos de la aplicación**. Consultarlos o modificarlos puede producir eventos de auditoría del RSI, pero esos registros no son fuentes de log de los sistemas de las organizaciones ni demuestran incidentes de la plataforma.

El estado actual combina auditoría persistida en PostgreSQL y logs técnicos consultables en los contenedores. No se acredita centralización SIEM, reglas de correlación desplegadas, alertas automáticas ni respuesta SOAR. Las medidas pendientes se indican como propuestas.

## Encabezado de mapeo normativo

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| MCU 5.0 (función) | Detectar | Identificar eventos de la plataforma, revisar anomalías y preparar detección continua. |
| MCU 5.0 (categorías de referencia de la plantilla) | DE-01 Anomalías y eventos, DE-02 Monitoreo continuo, DE-03 Análisis de detección | Organizar fuentes, revisión y análisis; las denominaciones de la plantilla deben contrastarse con el MCU vigente al evaluar los controles. |
| COBIT 2019 | DSS04 y DSS05 | Conectar disponibilidad, operación de seguridad y revisión de eventos. |
| ISO/IEC 27001:2022 | A.8.15 y A.8.16 | Registro de eventos y actividades de monitoreo. |
| NIST SP 800-92 | Gestión de logs | Referencia para recolección, protección, revisión y conservación. |
| BCU — Guía de Seguridad de la Información | Monitoreo y registro | Referencia de la consigna; no se presume que el operador del RSI sea una entidad financiera supervisada. |
| URCDP — Ley 18.331 | Protección de datos personales presentes en eventos y metadatos | Aplicar controles de acceso, minimización y protección de las copias de auditoría. |
| MCU 5.0 y referencias BCU de la consigna | Evidencia de madurez en Detectar | Los indicadores y resultados de pruebas permiten documentar el avance; este documento no acredita un nivel de madurez alcanzado ni un reporte regulatorio presentado. |

La seguridad de los datos personales corresponde al artículo 10 de la Ley 18.331, corregido respecto de las referencias del ejemplo. Los artículos 9 y 12 no se presentan como controles específicos de logging. La existencia de auditoría en la aplicación no equivale a disponer de SIEM ni a cumplir el perfil MCU Avanzado.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-MON-07 |
| Versión | 1.0 — propuesta |
| Responsable | RSI o responsable de seguridad designado para la plataforma |
| Operación técnica | Administrador de plataforma y responsable técnico; asignación nominal pendiente |
| Fecha | 03/10/2026 |
| Estado | Auditoría de aplicación implementada; centralización, reglas y alertas pendientes de implementación y validación |
| Aprobación | Pendiente de la autoridad operativa designada |
| Revisión | Antes de publicación remota, ante incidentes o cambios de fuentes y, como mínimo, anualmente tras aprobación |
| Documentos relacionados | `03-Analisis-Riesgos.md`, `04-Gestion-Incidentes.md`, `06-Plan-Continuidad.md`, `09-gestion-accesos.md` y `evidencias/auditoria-gestion.md` |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 03/10/2026 | Equipo del proyecto | Documento inicial basado en la plantilla ISACA y los registros reales del RSI; fuentes, casos de detección, retención, operación e indicadores. |

## 1. Arquitectura de monitoreo

| Capa | Herramienta utilizada o propuesta open source | Rol | Estado del RSI |
|---|---|---|---|
| Aplicación y auditoría | NestJS, Prisma y PostgreSQL; modelo `AuditEvent` | Registrar actor, entidad, acción, fecha, resultado y metadatos de operaciones cubiertas | Implementado en backend. La auditoría de cambios de gestión comparte transacción con la operación. |
| Web y proxy | Nginx del servicio `frontend` | Emitir logs de acceso y error y reenviar solicitudes a la API | Configuración de proxy implementada. Formato, salida y cobertura efectivos de los logs deben verificarse en la imagen ejecutada. `/healthz` tiene `access_log off`. |
| Contenedores | Docker Compose y `docker compose logs` | Consultar salida de servicios y diagnosticar fallos | Tres servicios definidos: frontend, backend y postgres. No hay política explícita de rotación de logs en Compose. |
| Host | Propuesta: agente Wazuh en el equipo operador | Observar cambios de configuración, recursos y actividad del anfitrión | No se acredita agente instalado ni host relevado. |
| Red | Proxy HTTP actual; NIDS adicional sujeto a evaluación | Observar tráfico hacia la plataforma y exposición de puertos | No se acredita Suricata, Zeek ni Security Onion. El acceso publicado es loopback por defecto. |
| SIEM | Propuesta: Wazuh independiente del RSI, conforme a la orientación de la consigna | Recibir eventos normalizados y logs técnicos, correlacionar y conservar una copia independiente | Pendiente. `AuditEvent` permanece en la misma BD que los datos; no se observa colector ni envío configurado. |
| Alertas | Propuesta: reglas del SIEM y canal externo acordado | Informar condiciones de detección al RSI y administrador | Pendiente; no hay correo, tickets o notificaciones automáticas demostrados. |
| SOAR y respuesta | Procedimiento manual de incidentes; automatización a evaluar posteriormente | Contener y registrar decisiones con autorización | Respuesta manual propuesta en `04-Gestion-Incidentes.md`. No se acredita bloqueo automático ni plataforma de casos desplegada. |

La centralización propuesta debe extraer eventos de manera incremental, con identidad de lectura restringida, control de duplicados, reintentos y alerta ante interrupciones. Debe conservar el ID y la fecha originales, registrar la hora de recepción y proteger el transporte cuando atraviese una red. Una consulta al panel de auditoría no sustituye ese colector.

## 2. Fuentes de log

| Fuente | Componente | Eventos a registrar o existentes | Relevancia y límites |
|---|---|---|---|
| Autenticación con contraseña | `backend/src/auth/auth.service.ts` | `LOGIN` exitoso o fallido; `MFA_FAILURE` por código faltante o inválido durante login con MFA confirmado | Alta. Un fallo de contraseña registra correo como `entityId` y actor nulo. Rechazos tempranos por formato o longitud no pasan por ese registro. |
| Alta de MFA y passkeys | `auth.service.ts` y `passkey.service.ts` | `MFA_ENABLED` al confirmar TOTP; `PASSKEY_REGISTER` exitoso; `PASSKEY_LOGIN` exitoso y fallos capturados durante la verificación | Alta. No todos los rechazos WebAuthn quedan auditados: desafío inválido o vencido y otras validaciones anteriores al bloque de captura requieren ampliar cobertura. No registrar semillas, códigos ni respuestas completas del autenticador. |
| Usuarios y sesiones | Módulo `auth` | `USER_UPDATE` y `LOGOUT` cuando existe una sesión que cerrar | Alta. `USER_UPDATE` conserva actor y cuenta afectada, pero no valores previos/nuevos del rol. El alta de usuarios no tiene un evento explícito en el flujo revisado. Estas brechas requieren instrumentación. |
| Cambios de gestión | `AuditoriaInterceptor` y tabla `audit_events` | Altas, cambios, bajas y determinadas aprobaciones en organización, seguridad, cumplimiento, KPI, SoA y brechas MCU; metadatos con campos anteriores y nuevos | Alta. Se auditan operaciones exitosas cubiertas. Si falla la auditoría, se revierte la operación de gestión. Consultas ordinarias y solicitudes fallidas no generan esos eventos de cambio. |
| Exportaciones | Rutas de inventario y SoA | `EXPORTACION_EXPORT`, actor, documento y organización | Alta. Permite investigar extracciones autorizadas; no demuestra exfiltración ni registra el uso posterior del archivo. |
| Solicitudes HTTP | Nginx | Accesos, rutas, respuestas 4xx/5xx y errores del proxy | Alta. Verificar formato y disponibilidad real. La IP de la conexión puede corresponder al proxy; no usar encabezados enviados por el cliente como identidad confiable sin configurar proxies de confianza. |
| Operación de API | Salida del contenedor `backend` | Arranque y errores emitidos por el proceso; proponer códigos de error, estado HTTP e identificador de correlación | Alta. No se observa un registro estructurado de cada petición en el arranque de NestJS. No asumir que todos los 401/403 o fallos transaccionales ya se exportan como eventos. |
| PostgreSQL | Salida del servicio `postgres` | Mensajes operativos y errores que emita la configuración efectiva | Alta. No se acredita auditoría completa de DDL/DML, conexiones o cambios directos de BD. Instrumentación adicional pendiente; evitar registrar SQL con secretos o datos personales innecesarios. |
| Host y ejecución | Equipo anfitrión y Docker | Fallas de servicios, recursos, cambios de archivos de configuración y eventos del sistema operativo | Alta para disponibilidad e integridad; relevar SO y configurar agente o recolección. No se presupone Linux, SSH, `auditd` ni acceso root externo. |
| Respaldos | Automatización prevista en el plan de continuidad | Inicio, fin, integridad, ubicación lógica y error de cada respaldo; fecha del último respaldo válido | Alta. Fuente pendiente porque no se acredita automatización de respaldo. No incluir secretos ni el contenido de la copia. |

`AuditEvent` dispone de `id`, `eventType`, `entityType`, `entityId`, `action`, `actorUserId`, `timestamp`, `result` y `metadata`. No contiene campos dedicados de IP, agente de usuario o identificador de sesión. La API de consulta es `GET /api/v1/auth/auditoria`, exclusiva de Administrador, con filtros de entidad y usuario y páginas de 50 eventos. El RSI deberá recibir acceso a los eventos mediante un medio autorizado; su rol actual no permite consultar esa ruta.

La auditoría transaccional de gestión evita cambios sin evento cuando falla su escritura; no garantiza inmutabilidad frente a un administrador de BD ni cubre todas las operaciones de autenticación. Los metadatos anteriores y nuevos pueden conservar datos personales o contenido eliminado de los registros principales y requieren revisión de minimización y acceso.

## 3. Casos de uso y reglas de detección

Las siguientes son **reglas propuestas para la plataforma**, pendientes de configuración y prueba. Los umbrales iniciales deben ajustarse al uso local y revisarse antes del acceso remoto. La existencia de la fuente no significa que una alerta ya se genere.

| ID | Nombre | Fuente | Condición de alerta propuesta | Severidad | Respuesta |
|---|---|---|---|---|---|
| CU-01 | Intentos repetidos de login con contraseña | `LOGIN` con resultado `FALLIDO` | Al menos 6 fallos para el mismo correo normalizado en 10 minutos. Correlación por cuenta porque el evento actual no guarda IP. | Media; elevar si aparece acceso exitoso anómalo o cuenta privilegiada | Revisar secuencia y contexto, contactar por canal acordado y aplicar contención autorizada. No bloquear automáticamente antes de validar el caso. |
| CU-02 | Fallos repetidos de segundo factor | `MFA_FAILURE` y `PASSKEY_LOGIN` fallido | Al menos 4 fallos asociados a la misma cuenta en 10 minutos; separar métodos para no confundir errores habituales con ataque | Alta | Investigar acceso previo, posible pérdida del factor o compromiso; revocar sesiones si se confirma necesidad y seguir el procedimiento de incidentes. Ampliar primero la cobertura de rechazos WebAuthn. |
| CU-03 | Cambio sensible de cuenta | `USER_UPDATE`, cuentas y autorizaciones conservadas | Cualquier cambio registrado exige revisión; elevar si afecta rol privilegiado o no tiene autorización. Para detectar automáticamente qué rol cambió, añadir valores previos y nuevos sin secretos. | Alta | Comprobar actor, cuenta y solicitud aprobada; corregir acceso indebido y preservar el evento. El registro actual no permite reconstruir por sí solo el rol anterior. |
| CU-04 | Exportaciones repetidas | `EXPORTACION_EXPORT` | Al menos 8 exportaciones del mismo actor en 15 minutos o extracción no explicada por su función; correlacionar documento y organización | Media; Alta si se confirma extracción no autorizada | Revisar necesidad y ámbito, preservar evidencia y evaluar contención. Un volumen alto de exportaciones no confirma por sí mismo divulgación. |
| CU-05 | Rechazos de autorización repetidos | Logs HTTP y registro estructurado de API propuesto | Al menos 10 respuestas 403 en 10 minutos para el mismo actor, una vez que pueda correlacionarse de forma confiable; mientras tanto revisar por ruta sin atribuir usuario | Media | Revisar permisos y patrón de acceso; distinguir configuración incorrecta de intento de acceso fuera de ámbito. No afirmar que los guards generan `AuditEvent` de cada rechazo. |
| CU-06 | Caída de la API detrás de Nginx | Acceso/error de Nginx y prueba funcional propuesta | 3 comprobaciones consecutivas fallidas con intervalo de 1 minuto o serie de 502/503/504 durante 5 minutos | Alta | Verificar backend, PostgreSQL y recursos; activar continuidad si corresponde. Un `/healthz` exitoso solo confirma Nginx. |
| CU-07 | Fallo de auditoría o pérdida de recepción | Errores de API/BD y colector SIEM propuestos | Cualquier error confirmado al guardar auditoría o falta de señal de salud del colector durante 10 minutos | Alta | Investigar sin desactivar auditoría para permitir escrituras. Confirmar rollback de gestión y recuperar recolección. Ausencia de eventos de negocio puede significar inactividad; usar señal de salud del colector. |
| CU-08 | Respaldo fallido o vencido | Logs de automatización de respaldo propuesta | Cualquier ejecución fallida o última copia válida con más de 24 horas | Alta | Informar al administrador y RSI, recuperar el respaldo y verificar integridad según continuidad; registrar el RPO real. |
| CU-09 | Cambio no autorizado de configuración | Agente de host o verificación de integridad propuestos | Cambio de Compose, Nginx, esquema o configuración sensible sin ventana aprobada | Alta | Comparar versión aprobada, revisar actor y causa y preservar evidencia. Registrar ruta e integridad, sin copiar secretos de `.env` a los logs. |

Los eventos que alcancen un umbral se investigan antes de clasificarlos como incidentes. La respuesta sigue `04-Gestion-Incidentes.md`; las fallas de recuperación se conectan con R01/R10 y el plan de continuidad, y las brechas de trazabilidad con R08/PT08 del análisis de riesgos.

## 4. Retención y almacenamiento

La consigna RNF-05 exige al menos un año de trazabilidad de cambios. No hay purga automática en el código revisado, pero la ausencia de borrado no demuestra conservación operativa: depende de capacidad, integridad, respaldo y restauración. Los plazos técnicos adicionales son propuestas por aprobar.

| Índice o log | Retención online propuesta | Retención fría propuesta | Formato | Estado y protección |
|---|---|---|---|---|
| Auditoría de gestión y exportaciones | Al menos 1 año consultable, conforme a RNF-05 | Copia independiente que permita conservar y recuperar el mismo período; no implica un año adicional por defecto | PostgreSQL y extracción JSON normalizada propuesta | Eventos persistidos. No se acredita capacidad, copia independiente ni garantía de conservación anual. |
| Auditoría de autenticación y usuarios | 1 año propuesto, sujeto a política de minimización y aprobación | Copia protegida del período aprobado | PostgreSQL y JSON normalizado propuesto | Comparte BD con la gestión; revisar correos y datos de identificación antes de exportar. |
| Logs técnicos de Nginx y API | 21 días para diagnóstico inmediato | Hasta 90 días totales desde el evento, según capacidad y necesidad aprobadas | Texto; JSON estructurado cuando se configure | Rotación y destino externo pendientes. Excluir Authorization, tokens, cuerpos sensibles y consultas con secretos. |
| Logs operativos de PostgreSQL y contenedores | 21 días | Hasta 90 días totales desde el evento | Texto y metadatos normalizados | Recolección y rotación por verificar; los logs locales de Docker no son un archivo independiente garantizado. |
| Alertas y expedientes del propio RSI | Mientras el caso permanezca abierto y durante el período de revisión aprobado | Propuesta de 1 año desde el cierre, revisable según finalidad y obligaciones del operador | Registro de caso y referencias a evidencia protegida | No hay sistema de alertas/casos desplegado; conservar manualmente en medio restringido cuando existan casos. |

La retención de eventos no se resuelve conservando solo 14 respaldos diarios de BD: esas copias pueden perder eventos antiguos si se eliminan de la instancia. Debe existir un mecanismo que mantenga el año de trazabilidad exigido y una restauración comprobada de los eventos. Coordinarlo con `06-Plan-Continuidad.md`.

Aplicar acceso mínimo, cifrado de copias, integridad verificable, registro de exportaciones administrativas y control de capacidad. El destino independiente debe limitar la modificación y el borrado de eventos por operadores del RSI. Conservar hora original en UTC y hora de recepción; verificar sincronización del anfitrión antes de comparar fuentes. No registrar contraseñas, hashes de credenciales, tokens Bearer, códigos o semillas TOTP ni claves privadas. No se establece conservación indefinida de datos personales.

## 5. Revisión y operación

La revisión actual puede realizarse manualmente sobre la auditoría y logs disponibles. El esquema siguiente es una propuesta operativa; todavía no demuestra vigilancia continua ni atención permanente.

| Actividad | Responsable propuesto | Frecuencia o plazo objetivo | Registro y criterio |
|---|---|---|---|
| Revisar autenticación, cambios de usuarios y exportaciones | Administrador con acceso a auditoría; RSI coordina la evaluación | Cada día de uso y antes de una entrega | Fecha, período revisado, eventos relevantes y decisiones; informar al RSI mediante un medio autorizado. |
| Revisar disponibilidad, errores y recursos | Administrador de plataforma | Cada día de uso y ante falla reportada | Revisar `docker compose ps` y logs de servicios; comprobar API además de Nginx. Registrar capacidad y errores sin divulgar secretos. |
| Evaluar una alerta Alta | RSI y administrador | Objetivo de 30 minutos desde recepción durante una ventana de atención acordada | Confirmar hechos, alcance y prioridad, abrir expediente si corresponde y preservar evidencia. Fuera de esa ventana se necesita un canal de escalamiento definido. |
| Evaluar una alerta Media | Responsable técnico con coordinación del RSI | Objetivo de 4 horas dentro de la ventana acordada | Clasificar como actividad legítima, falso positivo o incidente; justificar el resultado y seguimiento. |
| Comprobar recolección y retención | Administrador de plataforma | Diario después de implementar el colector; revisar capacidad semanalmente | Señal de salud del colector, último evento recibido, errores, duplicados, retraso y espacio libre. |
| Validar reglas | Responsable técnico y RSI | Antes de publicar y tras cambios de fuente, esquema o regla | Ejecutar simulaciones autorizadas con cuentas de prueba, medir detección y verificar que la evidencia no contiene secretos. |
| Revisar umbrales y cobertura | RSI y responsable técnico | Mensualmente durante la puesta en marcha y tras incidente relevante | Ajustar falsos positivos, fuentes faltantes, alcance y ventanas; conservar versión de reglas y motivo del cambio. |

Registrar eventos recibidos, alertas generadas, casos confirmados, falsos positivos, tiempo de detección y tiempo de evaluación. La fecha de ocurrencia, la de recepción, la de alerta y la de revisión deben distinguirse. El tiempo de detección se mide entre el evento simulado y la alerta; el tiempo de evaluación empieza cuando el responsable la recibe.

La evidencia `evidencias/auditoria-gestion.md` informa pruebas del 01/10/2026 sobre registro transaccional, exportaciones, filtros, paginación, acceso y rollback. Es evidencia de funcionamiento de auditoría de aplicación, no de reglas SIEM, alertas operativas ni un año de retención real. No se ejecutaron ataques o cambios de infraestructura para elaborar este documento.

## 6. Evidencias de detección KPIs

No se dispone de una prueba documentada de detección SIEM con alertas reales de la plataforma. Los valores pendientes no se sustituyen por cero: cero implicaría una medición realizada. Se proponen las siguientes mediciones para la validación.

| Indicador | Valor medido durante la prueba | Método y evidencia requerida |
|---|---|---|
| Eventos de anomalía detectados | No medido; reglas pendientes de implementación y prueba | Contar eventos de prueba que cumplan CU-01 a CU-09 y conservar ID, fuente, hora y regla aplicada. |
| Alertas Altas generadas | No medido; no hay alertas automáticas demostradas | Contar alertas resultantes de los escenarios simulados y vincularlas al evento original. |
| Tiempo de detección promedio | No medido | Promedio de hora de alerta menos hora del evento para casos detectados; informar cantidad de casos y sincronización de relojes. |
| Falsos positivos | No medido | Revisar cada alerta y contar las clasificadas como actividad legítima; documentar criterio y total de alertas evaluadas. |
| Cobertura de casos de uso | No se acredita implementación de las 9 reglas propuestas | Registrar por CU configuración, simulación, alerta obtenida y respuesta comprobada. La auditoría disponible no cuenta por sí sola como regla implementada. |
| Recepción independiente de auditoría | No verificada | Generar un evento con cuenta de prueba y comprobar su llegada al destino independiente con el mismo ID, sin duplicación y con retraso medido. |
| Recuperación de eventos retenidos | No verificada | Recuperar una muestra desde la copia independiente y contrastarla con el original; registrar integridad, fechas y permisos. Consultar eventos antiguos de prueba no acredita un año de operación. |

Los resultados de validación se registrarán con fecha, versión del código, fuente, regla, cuenta de prueba y responsable. Los reportes publicables en `docs/evidencias/` contendrán datos de prueba y resultados mínimos; los logs con datos personales o material sensible permanecerán en almacenamiento protegido.
