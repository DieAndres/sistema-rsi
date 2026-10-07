# Plan de Continuidad y Recuperación del Sistema RSI

Este plan establece cómo mantener y recuperar el **Sistema de Gestión Integrada para el RSI** ante una interrupción o pérdida de información. Cubre el frontend React servido por Nginx, la API NestJS, autenticación y autorización, PostgreSQL, el volumen `postgres_data`, código, migraciones, configuración, secretos y auditoría. Se aplica al entorno local actual y define condiciones que deben verificarse antes de habilitar acceso remoto.

Los registros de organizaciones, trabajadores, activos, riesgos, vulnerabilidades e incidentes son **datos almacenados por la plataforma**. Este documento trata la continuidad del propio RSI; no establece planes de recuperación para los sistemas de las organizaciones que los usuarios registran.

La prioridad es disponer de una copia independiente y demostrar que permite recuperar datos y servicio. El volumen Docker conserva datos entre reinicios, pero una falla del anfitrión, un borrado o un compromiso del equipo puede afectar tanto la aplicación como su única copia. No se acredita actualmente respaldo automático diario, copia externa ni restauración probada.

## Encabezado de mapeo normativo

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| MCU 5.0 (función) | Recuperar, con respaldo en Proteger | Recuperación de las operaciones y protección de la información necesaria para restablecer el RSI. |
| MCU 5.0 (categorías de referencia de la plantilla) | RC-01 Plan de recuperación, RC-02 Comunicación, RC-03 Pruebas | Organización de la recuperación, comunicación y comprobación de las copias y restauraciones. |
| COBIT 2019 | DSS04 (Continuidad), APO13 | Continuidad del servicio y disponibilidad de la plataforma. |
| ISO/IEC 27001:2022 | A.5.29, A.5.30, A.8.13, A.8.14 | Seguridad durante interrupciones, preparación tecnológica para la continuidad, respaldo y redundancia. |
| ISO 22301 | Sistema de gestión de continuidad | Referencia para responsabilidades, objetivos, procedimientos y ejercicios de recuperación. |
| BCU — Guía de Seguridad de la Información | Continuidad y respaldos | Referencia de la consigna para respaldos, copia independiente y restauración periódica; no se presume que el operador del RSI sea una entidad supervisada. |
| URCDP — Ley 18.331 y Decreto 414/009 | Protección de los datos personales almacenados por el RSI | Los respaldos y la recuperación deben conservar la confidencialidad e integridad de la información y restringir el acceso a las copias. |
| NIST SP 800-34 | Plan de contingencia y recuperación | Referencia técnica para organizar preparación, recuperación y pruebas. |

Las denominaciones RC-01, RC-02 y RC-03 se mantienen como referencias de la plantilla. El mapeo deberá contrastarse con las categorías vigentes del MCU al completar la evaluación de controles. La seguridad de los datos personales corresponde al artículo 10 de la Ley 18.331, corregido respecto del artículo 9 citado en el ejemplo. Este plan no demuestra cumplimiento del perfil MCU Avanzado ni certificación de continuidad.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-BCP-06 |
| Versión | 1.1 — propuesta |
| Responsable | RSI o responsable de seguridad designado para operar la plataforma |
| Ejecución técnica | Administrador de plataforma y responsable técnico; asignación nominal pendiente |
| Fecha | 03/10/2026 |
| Estado | Plan actualizado para el entorno local; respaldo independiente y recuperación completa pendientes de implementación y prueba |
| Aprobación | Pendiente de la autoridad operativa designada |
| Revisión | Antes de publicar el servicio, tras cambios relevantes o incidentes y, como mínimo, anualmente después de la aprobación |
| Documentos relacionados | `03-Analisis-Riesgos.md`, `02-registro-activos.md`, `04-Gestion-Incidentes.md` y `09-gestion-accesos.md` |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 24/09/2026 | Equipo del proyecto | Plan inicial para el backend y PostgreSQL. |
| 1.1 | 03/10/2026 | Equipo del proyecto | Actualización según la estructura de la plantilla ISACA, los tres servicios de Compose y el análisis de riesgos de la plataforma; inventario de respaldo, pruebas, escenarios y comunicación en tablas. |

## 1. Objetivos de recuperación

El RTO mide el tiempo objetivo para recuperar el servicio después de declarar la interrupción. El RPO expresa la antigüedad máxima admisible del último dato recuperable. Los valores siguientes son **objetivos propuestos**, coherentes con el análisis de riesgos del proyecto; deben aprobarse y comprobarse con ejercicios. No describen tiempos ya alcanzados.

| Métrica | Valor objetivo | Alcance y condición de verificación |
|---|---|---|
| RTO de PostgreSQL | 4 horas desde la declaración de la interrupción | Incluye disponer de una instancia utilizable, restaurar la copia y comprobar datos y relaciones. Depende de copia válida, capacidad del entorno alternativo y credenciales disponibles. |
| RTO de la API y autenticación | 2 horas después de recuperar PostgreSQL | Recuperar backend, conexión, esquema compatible, inicio de sesión, MFA y autorización. Se conserva el objetivo del plan anterior. |
| RTO del frontend y Nginx ante falla aislada | 1 hora desde la declaración de esa interrupción | Objetivo propuesto para reconstruir o sustituir el contenedor web si API y BD están disponibles. Verificar tanto interfaz como acceso a `/api/v1`. |
| RTO integral ante pérdida del anfitrión | 6 horas desde la declaración de la interrupción | Objetivo total que comprende las 4 horas de BD y las 2 horas adicionales de API. La recuperación del frontend se realiza en paralelo y debe completarse dentro de esas 6 horas. Incluye preparación del entorno alternativo; si el ejercicio no lo permite, revisar el objetivo. |
| RPO de la BD | Como máximo 24 horas | Requiere respaldo automático diario exitoso, copia externa utilizable y control de fallos. Si la última copia válida es más antigua, registrar el RPO real y escalar el incumplimiento. |
| RPO de los eventos `AuditEvent` | Como máximo 24 horas mientras formen parte del respaldo diario de BD | Los eventos comparten PostgreSQL con los datos de gestión. Este objetivo no acredita un envío independiente de logs ni protección frente a alteración de la BD. |
| RPO de configuración y código | Última versión aprobada para la entrega | Registrar el commit y la configuración de cada despliegue y conservar una copia externa accesible. Los secretos deben recuperarse desde su medio protegido, separado del Git público. |
| Disponibilidad de la plataforma | 99 %, requisito RNF-03 de la consigna | Medir el acceso funcional al servicio durante el período acordado. El estado saludable de Nginx o PostgreSQL, por sí solo, no demuestra disponibilidad integral ni cumplimiento. |

No hay recuperación automática en un equipo alternativo ni redundancia acreditada. Si no existe una copia válida, no puede garantizarse el RPO de 24 horas ni la recuperación de los datos. Se deberá informar la pérdida posible y recuperar únicamente lo que pueda verificarse.

## 2. Inventario de respaldo

Los identificadores corresponden al inventario del propio Sistema RSI. Las herramientas y políticas que aún no están configuradas se presentan como **propuestas**. Toda copia con datos o secretos debe cifrarse, tener acceso restringido y contar con verificación de integridad. Una copia en el mismo disco del anfitrión no cubre la pérdida de ese equipo.

| Activo | Datos a respaldar | Herramienta | Frecuencia | Ubicación dentro o fuera del sitio | Retención propuesta | Estado actual |
|---|---|---|---|---|---|---|
| RSI-A04 y RSI-A05 — PostgreSQL y datos persistidos | Esquema y datos de organizaciones, usuarios, sesiones, semillas TOTP, registros de gestión y auditoría | Propuesta: `pg_dump` en formato personalizado, restaurable con `pg_restore`; automatización, cifrado y comprobación de integridad por configurar | Diario y antes de migraciones o cambios de alto impacto; verificar el resultado de cada ejecución | Archivo temporal protegido durante la ejecución y copia en almacenamiento externo al anfitrión; proveedor y ubicación física por definir | 14 copias diarias y 8 semanales; política por aprobar según capacidad y necesidad | No se acredita respaldo automatizado, copia externa ni restauración |
| RSI-A08 — Eventos de auditoría | Tabla `AuditEvent` y metadatos necesarios para reconstruir cambios; no incluir secretos adicionales | Incluidos en el respaldo PostgreSQL. Propuesta adicional: extracción o envío a destino independiente con integridad y acceso restringido | Diario mediante BD; frecuencia del envío independiente por definir al implementar el control PT08 | Copia externa de BD y destino independiente de auditoría pendiente | Conservación de eventos durante al menos un año según RNF-05; definir el mecanismo específico, sin depender solo de 14 copias diarias | Auditoría persistida y consultable; retención operativa y destino independiente no demostrados |
| RSI-A09 — Código fuente y migraciones | Frontend, backend, esquema Prisma, migraciones, lockfiles y commit de la versión aprobada | Git y copia externa del repositorio; reconstrucción con versiones registradas y `npm ci` | En cada cambio aprobado y antes de desplegar | Repositorio local y copia remota o externa por verificar; excluir datos reales y secretos del repositorio público | Historial de versiones durante la vida del proyecto; conservar las releases utilizadas | Código y migraciones versionados; disponibilidad e integridad de una copia externa por verificar |
| RSI-A10 — Configuración de ejecución y proxy | `docker-compose.yml`, Dockerfiles, configuración Nginx y valores no secretos que identifiquen puertos, origen y versión | Git para archivos sin secretos; manifiesto de despliegue con commit e imágenes utilizadas | En cada cambio de configuración o entrega | Repositorio y copia externa; mantener coherencia con la versión recuperable de la BD | Conservar junto con cada release y mientras existan respaldos que la requieran | Configuración disponible en el proyecto; manifiesto de cada despliegue por completar |
| RSI-A07 — Secretos y configuración privada | `.env`, `backend/.env`, credenciales de BD y claves de protección que se incorporen | Propuesta: almacén de secretos o archivo cifrado con custodia de clave separada | En cada alta o cambio de secreto; comprobar la recuperación tras una rotación | Medio externo protegido; clave de descifrado en custodia separada de la copia | Versión vigente y versiones necesarias para copias aún retenidas, con acceso controlado | Archivos excluidos de Git; no se acredita respaldo seguro ni procedimiento de recuperación |
| Evidencias operativas externas a la BD | Archivos de evidencias, expedientes y exportaciones que deban conservarse y cuyo contenido no esté incluido en PostgreSQL | Propuesta: copia cifrada del almacenamiento efectivamente utilizado; las rutas o URL de `Evidencia` no respaldan el archivo referido | Diario si existen archivos operativos nuevos y antes de un cambio de almacenamiento | Destino externo protegido; ubicación real y custodio por relevar | Según finalidad y plazo aprobado de cada evidencia; no conservar indefinidamente por defecto | No se acredita almacenamiento externo de archivos ni copia automática; relevar antes de usar evidencias reales |

El volumen **RSI-A06 `postgres_data` es almacenamiento operativo**, no una copia de seguridad. Los binarios frontend y backend pueden reconstruirse desde una versión aprobada si están disponibles el código, los lockfiles y las dependencias; deben verificarse antes de depender de esa reconstrucción. Nginx y los servicios de la aplicación ya están definidos en Compose. Wazuh/SIEM no integra el despliegue actual, por lo que no se inventaria un respaldo de índices de SIEM inexistentes.

El administrador deberá registrar para cada copia fecha y hora, versión de PostgreSQL, versión de la aplicación, identificador del archivo, resultado, destino y comprobación de integridad. Si falla el respaldo o supera 24 horas de antigüedad, debe informar al RSI y corregirlo. Antes de ejecutar una migración debe existir una copia válida y un procedimiento de recuperación.

## 3. Procedimiento de prueba de restauración

Se propone una prueba completa inicial antes de usar datos reales o publicar el servicio, seguida de ejercicios trimestrales y tras cambios importantes de esquema, respaldo o infraestructura. Se ejecutará en un entorno aislado, sin sobrescribir la BD operativa ni usar sus puertos o credenciales de acceso como si fueran un entorno de prueba. El administrador ejecuta; el responsable técnico valida la aplicación; el RSI revisa el resultado.

| Paso | Descripción | Evidencia |
|---|---|---|
| 1 | Seleccionar una copia externa y registrar fecha, identificador, versión, integridad y último punto recuperable. Comprobar que existe autorización para usar los datos en la prueba. | Acta de selección, verificación de integridad y cálculo inicial de antigüedad de la copia. |
| 2 | Preparar otra instancia PostgreSQL y el entorno de aplicación, con recursos, puertos, nombre de proyecto Compose y volumen independientes. Anotar la hora de inicio del ejercicio. | Configuración del entorno aislado y comprobación de que no apunta a la BD operativa. |
| 3 | Recuperar el archivo cifrado utilizando la custodia autorizada. Restaurar con `pg_restore` el dump de formato personalizado sobre una BD nueva y detener la evaluación si se producen errores. No publicar archivos descifrados ni claves. | Log protegido de restauración, versión de la herramienta y resultado; sin contraseñas ni cadenas de conexión. |
| 4 | Comprobar tablas, cantidades de registros y relaciones frente al manifiesto o controles de la copia. Revisar usuarios, ámbitos y auditoría; confirmar que las evidencias referidas siguen disponibles cuando se hayan respaldado archivos. | Consultas y comparación de cantidades, comprobaciones de referencias y errores encontrados. |
| 5 | Recuperar la versión de código y configuración compatible con la copia. Verificar el estado de las migraciones y aplicar únicamente las necesarias para la versión objetivo, mediante el procedimiento de Prisma. | Commit recuperado, estado de migraciones y resultado de `prisma migrate deploy` cuando corresponda. |
| 6 | Iniciar backend y frontend con Nginx. Verificar BD saludable, conexión de API y acceso mediante la interfaz. `/healthz` comprueba Nginx, pero también debe realizarse una solicitud a la API. | Estado de contenedores, resultado del proxy y respuesta de una operación autenticada. |
| 7 | Probar inicio de sesión y MFA con una cuenta de prueba, rechazo de acceso no autorizado y consulta de datos por ámbito. Ejecutar una modificación controlada sobre registros de prueba, comprobar su evento de auditoría y verificar una exportación autorizada. | Resultados de los flujos y evento de auditoría; no guardar tokens, semillas, códigos TOTP ni datos personales innecesarios en capturas. |
| 8 | Si la copia proviene de un compromiso, revocar las sesiones restauradas antes de reabrir y rotar las credenciales afectadas. Si hay auditoría independiente, comprobar su recuperación; actualmente no se presume un SIEM operativo. | Registro de revocación y rotación y consulta de auditoría recuperada, según el escenario. |
| 9 | Medir el RTO de BD, API y servicio completo y calcular el RPO real. Comparar con los objetivos, registrar fallos y asignar correcciones. | Informe con horas de inicio y fin, pérdida de datos potencial, tiempos obtenidos y planes de mejora. |
| 10 | El RSI y la autoridad operativa revisan el resultado. Cerrar la prueba solo cuando los datos y el acceso funcionen o registrar expresamente que fue fallida. Eliminar las copias temporales de prueba conforme a la política aprobada. | Acta fechada con responsables, resultado, aprobación o acciones pendientes y constancia de disposición segura. |

A la fecha de esta versión, **no consta una restauración completa documentada**. Los registros de prueba se conservarán en `docs/evidencias/` cuando no contengan información sensible; logs, copias y resultados con datos personales permanecerán en un medio protegido, con referencias en la documentación.

## 4. Escenarios y procedimientos de recuperación

El administrador identifica la falla y el RSI coordina la activación del plan cuando la interrupción compromete una función esencial o hay riesgo de pérdida de datos. Ante indicios de ataque, se aplica también `04-Gestion-Incidentes.md`: contener, preservar evidencia y verificar la causa antes de restaurar. Los tiempos de esta tabla son objetivos, no garantías.

| Escenario | Procedimiento | RTO objetivo | Responsable |
|---|---|---|---|
| Caída de Nginx o frontend con API y BD disponibles | Revisar logs y configuración; ejecutar `nginx -t` dentro del contenedor cuando sea posible. Reiniciar el servicio `frontend` o reconstruirlo desde la versión aprobada. Comprobar carga de React, navegación y proxy a la API; no cerrar por un `/healthz` exitoso aislado. | 1 hora desde la declaración de la falla aislada | Administrador de plataforma; responsable técnico valida interfaz y API |
| Caída del backend sin pérdida de datos | Comprobar PostgreSQL, configuración y logs. Corregir la causa y reiniciar el servicio `backend`; si la versión está dañada, recuperar una imagen o reconstrucción aprobada. Comprobar conexión, login con MFA, permisos y una operación de gestión antes de reabrir. | 2 horas desde la declaración si la BD ya está disponible | Administrador de plataforma y responsable técnico |
| Caída del contenedor PostgreSQL con volumen intacto | Preservar el volumen. Revisar logs, disco y configuración; iniciar PostgreSQL y esperar su estado saludable. Verificar datos y compatibilidad de esquema y recuperar backend/frontend. No eliminar el volumen para resolver un fallo de arranque. | BD en 4 horas; servicio integral dentro de 6 horas | Administrador de plataforma; responsable técnico valida consistencia |
| Pérdida del anfitrión, disco o volumen | Preparar un equipo alternativo autorizado; recuperar código, configuración y secretos desde copias independientes. Crear almacenamiento nuevo y restaurar la última copia válida. Validar datos, migraciones, identidad, API y frontend; registrar qué información posterior a la copia se perdió. | Servicio integral en 6 horas, incluida la preparación del entorno alternativo; sujeto a prueba | Administrador de plataforma, responsable técnico y RSI |
| Corrupción de la BD o borrado accidental | Detener las escrituras y preservar la instancia afectada para evaluación. Identificar una copia anterior al daño, restaurarla en una BD separada y validar. Cambiar la conexión solo tras aprobación; conciliar las operaciones posteriores recuperables sin repetir registros indiscriminadamente. | BD en 4 horas; hasta 2 horas adicionales para recuperar y validar la aplicación | Administrador de plataforma; RSI autoriza la reapertura |
| Ransomware o compromiso del anfitrión | Aislar el equipo, preservar evidencia y detener el acceso. No restaurar sobre un entorno que siga comprometido. Reconstruir en un equipo limpio, usar una copia anterior al compromiso, corregir la causa y rotar secretos; revocar sesiones recuperadas y verificar la seguridad antes de reabrir. | Objetivo de 6 horas para recuperación técnica; aislamiento e investigación pueden extenderlo y deben informarse | RSI coordina; administrador y responsable técnico ejecutan |
| Migración o actualización fallida | Suspender nuevas escrituras y registrar el error. Verificar qué pasos se aplicaron y recuperar la versión compatible. Probar la reparación o restauración en una instancia separada; no revertir código sin comprobar su compatibilidad con el esquema ni improvisar una migración destructiva. | Hasta 6 horas si exige restaurar BD; 2 horas para una falla exclusiva de API con datos intactos | Responsable técnico y administrador de plataforma |
| Pérdida del factor de autenticación de una cuenta privilegiada | Activar recuperación de identidad con autorización y trazabilidad según el procedimiento de accesos. Revocar el factor o las sesiones afectados y comprobar el nuevo acceso. No desactivar MFA como sustituto de un procedimiento seguro. El flujo debe implementarse y probarse. | Objetivo de 2 horas para recuperar una cuenta operativa, condicionado a procedimiento y custodios disponibles | RSI y administrador autorizado |
| Indisponibilidad o pérdida de auditoría | Revisar almacenamiento y acceso a `AuditEvent`. Recuperar los eventos desde la copia de BD o destino independiente cuando exista. Si los datos operativos funcionan pero falta trazabilidad, restringir operaciones sensibles y registrar la incidencia hasta validarla. Una restauración total de BD requiere evaluar también su efecto sobre los datos de gestión. | 4 horas para recuperar auditoría desde BD; registrar brechas posteriores al último respaldo | Administrador de plataforma y RSI |
| Pérdida de red, energía o acceso al equipo local | Revisar primero las dependencias del anfitrión y evitar reinicios repetidos mientras exista riesgo de daño. Recuperar energía o conectividad; si el equipo no puede volver, activar el entorno alternativo. Comprobar funcionalmente el servicio y registrar duración. | Objetivo integral de 6 horas; dependencias físicas y alternativa deben relevarse | Administrador de plataforma; RSI comunica |

Durante la interrupción se suspenden las operaciones que no puedan ejecutarse de forma segura. Si es necesario recibir solicitudes urgentes, se propone un registro temporal protegido fuera del RSI, con fecha, autor y contenido mínimo. Al recuperar el servicio, el responsable de los datos concilia e incorpora las solicitudes autorizadas evitando duplicados. Esta alternativa no sustituye a la aplicación ni crea un servicio manual para las organizaciones registradas.

El despliegue actual utiliza HTTP sobre loopback. La recuperación local debe mantener esa restricción. Si se habilita acceso remoto, el entorno recuperado deberá incluir HTTPS, certificado y origen autorizado correcto antes de reabrir; recuperar únicamente el contenedor HTTP no satisface esas condiciones.

## 5. Comunicación de crisis

Los canales y contactos deberán acordarse antes de operar con datos reales. No se acredita un servidor de correo de alertas, dashboard público de estado ni notificación automática. Los contactos son roles propuestos del equipo operador, no personas o trabajadores tomados de los registros de las organizaciones usuarias.

| Canal de comunicación | Herramienta | Contacto | Uso y condición |
|---|---|---|---|
| Aviso inicial al equipo operador | Canal habitual del equipo, por designar; comunicación manual | RSI y administrador de plataforma; datos de contacto pendientes | Informar al detectar la interrupción: hora, componente, síntomas, alcance conocido y responsable que evalúa. No incluir secretos ni copias de BD. |
| Escalamiento urgente | Teléfono o comunicación presencial, con números y alternativa por registrar | RSI y autoridad operativa designada | Utilizar ante pérdida de datos, compromiso, caída integral o imposibilidad de cumplir la recuperación; conservar la decisión de activar el plan. |
| Actualización durante la recuperación | Canal acordado accesible fuera de la propia plataforma | Equipo técnico y usuarios afectados, según alcance | Actualización propuesta cada hora y ante cambios relevantes. Informar acciones, avance y tiempo estimado; distinguir estimación de RTO objetivo. |
| Comunicación formal de impacto y decisiones | Correo externo al RSI, si el equipo dispone de él; cuenta y lista por definir | Autoridad operativa y RSI | Registrar pérdida de información conocida, RPO alcanzable, demoras y decisiones de reapertura. No se presupone correo automático ni servicio propio de mail. |
| Expediente y evidencias del incidente | Medio protegido accesible aunque el RSI esté caído; ubicación y custodio por definir | RSI y responsables autorizados de investigación | Conservar cronología, decisiones, copias referenciadas y resultados. El registro de incidentes de las organizaciones dentro del RSI no sustituye este expediente operativo. |
| Confirmación de restablecimiento | Mismo canal usado para la interrupción y acta de recuperación | RSI, autoridad operativa y usuarios afectados | Comunicar después de validar datos, autenticación, permisos, API y frontend. Informar restricciones, posible pérdida posterior al respaldo y acciones pendientes. |

El RSI coordina los mensajes; el administrador aporta el estado técnico; la autoridad operativa decide la reapertura y las excepciones. Si el incidente afecta datos personales, se coordina con el responsable del tratamiento conforme al procedimiento de incidentes. El sistema no envía automáticamente comunicaciones regulatorias.
