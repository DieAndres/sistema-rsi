# Gestión de Vulnerabilidades del Sistema RSI

Este procedimiento aplica a debilidades del **propio RSI**: frontend, API, identidad, datos, Docker, Nginx, dependencias, configuración y anfitrión. Las vulnerabilidades que las organizaciones cargan sobre sus activos son datos administrados por la herramienta, no hallazgos técnicos de esta plataforma.

## Encabezado de mapeo normativo

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| MCU 5.0 | Identificar y Proteger | Identificar debilidades y controlar su remediación; referencias actuales de evaluación ID.RA. |
| COBIT 2019 | APO12 y DSS05 | Vincular vulnerabilidades, riesgo y servicios de seguridad. |
| ISO/IEC 27001:2022 e ISO/IEC 27002:2022 | A.8.8 | Gestión de vulnerabilidades técnicas. |
| BCU — Guía de Seguridad de la Información | Vulnerabilidades y parches | Referencia de la consigna; no implica supervisión financiera del operador. |
| Ley 18.331 | Art. 10 | Proteger datos personales frente a acceso, alteración o pérdida por debilidades técnicas. |
| OWASP y MITRE ATT&CK | Referencias técnicas | Orientar pruebas y análisis de escenarios; no atribuir hallazgos sin evidencia. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-VUL-10 |
| Versión | 1.1 — propuesta |
| Responsable | RSI coordina; responsable técnico y administrador ejecutan, por designar |
| Fecha | 03/10/2026 |
| Estado | Debilidades observadas mediante revisión de código/configuración; escaneos y validación de explotación pendientes |
| Aprobación | Pendiente |
| Revisión | Antes de cada entrega, ante hallazgo grave o cambios y anualmente tras aprobación |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 24/09/2026 | Equipo del proyecto | Procedimiento inicial de registro y remediación. |
| 1.1 | 03/10/2026 | Equipo del proyecto | Adaptación a la plantilla, alcance de la plataforma, registro de debilidades observadas, herramientas, prioridades y falsos positivos. |

## 1. Herramientas utilizadas

| Herramienta | Rol | Alcance | Estado |
|---|---|---|---|
| Revisión de código y configuración del repositorio | Identificar controles ausentes o limitaciones verificables | Autenticación, frontend, Compose, Nginx y auditoría | Aplicada para este documento; no equivale a pentest ni escaneo del entorno. |
| Jest y pruebas de API existentes | Validar controles funcionales y casos negativos | Backend, roles, relaciones, hashes, desafíos y auditoría | Evidencias históricas en `docs/evidencias/`; no ejecutadas de nuevo para este documento. |
| Análisis de dependencias con npm audit o equivalente | Detectar avisos que afecten versiones del lockfile | Paquetes frontend/backend | Propuesto; guardar fecha, versión y aplicabilidad antes de declarar hallazgos. |
| Trivy o equivalente open source | Analizar imágenes y configuración | Imágenes efectivas de frontend, backend y PostgreSQL | Propuesto en PT07; no hay resultado de escaneo acreditado. |
| Gitleaks y Semgrep o equivalentes | Buscar secretos y patrones de código inseguros | Código e historial con acceso autorizado | Propuestos; los reportes deben ocultar valores de secretos. |
| Nmap y pruebas web autorizadas | Comprobar exposición y controles de API | Solo el entorno RSI acordado, con cuentas de prueba | Propuestos; no asumir servicios externos abiertos ni escanear sistemas registrados por los usuarios. |

Antes de una prueba activa, acordar alcance, entorno aislado, ventana y respaldo. Registrar versión evaluada y evidencia. No instalar ni declarar herramientas como operativas solo por estar nombradas en este plan.

## 2. Registro de vulnerabilidades

Estas filas documentan **debilidades observadas**, no CVE confirmadas ni ataques demostrados. El CVSS queda sin asignar hasta evaluar un escenario concreto con versión y vector reproducibles. Los IDs V-RSI distinguen este expediente del contenido demo del módulo de vulnerabilidades.

| ID | CVSS y versión | Activo afectado | Herramienta o evidencia | Descripción | Estado | Fecha detect | Fecha rem | Responsable |
|---|---|---|---|---|---|---|---|---|
| V-RSI-01 | No asignado; requiere evaluación del vector | RSI-A03/A04/A05/A07 | `auth.service.ts`, escritura de `mfaSecret` | Semillas TOTP anteriormente sin cifrado de aplicación. Ahora se almacenan con AES-256-GCM y clave externa a la BD. | Corregida en código y BD local; custodiar clave y proteger copias anteriores, PT03/R03 | Verificada 07/10/2026 | docs/evidencias/cifrado-totp.md | Responsable técnico y administrador |
| V-RSI-02 | No asignado; no se ha demostrado una XSS | RSI-A01/A03 | `frontend/src/shared/api/apiGet.ts` | Token Bearer en localStorage accesible a JavaScript del mismo origen. Es exposición de diseño ante ejecución de scripts, no prueba de robo de sesión. | Abierta; tratamiento PT02/R02 | Documentada 03/10/2026 | Pendiente | Responsable técnico |
| V-RSI-03 | No asignado; debilidad operativa | RSI-A04/A05/A06 | Compose y plan de continuidad | No se acredita respaldo automático independiente ni restauración completa. El volumen persistente no cubre pérdida del anfitrión. | Abierta; tratamiento PT01/R01 | Documentada 03/10/2026 | Pendiente | Administrador de plataforma |
| V-RSI-04 | No asignado; cobertura de trazabilidad | RSI-A03/A08 | `auth.service.ts`, `passkey.service.ts` e interceptor | Altas de usuario y algunos rechazos tempranos de autenticación sin evento explícito; cambio de rol sin valores previos/nuevos. | Abierta; ampliar cobertura y verificar PT08/R08 | Documentada 03/10/2026 | Pendiente | Responsable técnico y RSI |

HTTP local sin TLS y falta de límites de abuso se evalúan en R05/R06. No se declaran como exposición pública confirmada: los puertos se publican en loopback por defecto. Antes de acceso remoto requieren HTTPS y controles de abuso. No hay inventario de CVE de dependencias validado en esta evaluación.

Cada hallazgo nuevo deberá incorporar versión o commit, evidencia protegida, reproducción controlada, componente, escenario, impacto, CVSS con vector si corresponde, decisión de prioridad, responsable, plazo y verificación de cierre. El campo `cvss` del sistema es numérico y no conserva por sí solo versión/vector; esa información debe adjuntarse al expediente.

## 3. Priorización de remediación

Los rangos CVSS se usan cuando existe una puntuación técnica válida; no se convierten automáticamente en probabilidad de riesgo. Los plazos son **propuestas específicas para el proyecto**, sujetas a aprobación, contados desde la validación del hallazgo. Explotación activa o compromiso de datos exige contención inmediata aunque no exista CVSS.

| Gravedad | CVSS cuando corresponda | SLA de remediación propuesto | Criterio adicional |
|---|---|---|---|
| Crítica | 9.0 a 10.0 | Contener de inmediato; corrección o aislamiento efectivo en 48 horas | No publicar ni mantener acceso remoto a una vía crítica sin control verificado. |
| Alta | 7.0 a 8.9 | 10 días; antes de publicar si afecta acceso, secretos o separación de ámbitos | Priorizar por explotación y exposición real, no solo por score. |
| Media | 4.0 a 6.9 | 45 días | Aplicar control temporal si no puede corregirse en plazo. |
| Baja | 0.1 a 3.9 | 120 días | Programar con mantenimiento y reevaluar si cambia exposición. |
| Sin CVSS | No asignado | Definir plazo por riesgo y alcance; usar PT01/PT02/PT03/PT08 para las filas actuales | Registrar justificación. Falta de score no significa riesgo bajo ni falso positivo. |

Para las debilidades actuales se conservan los objetivos del análisis: PT01 10/10/2026, PT02/PT03 17/10/2026 y PT08 24/10/2026. El módulo permite guardar `sla` en horas y plan de remediación; no demuestra alertas automáticas de vencimiento ni cumplimiento real.

## 4. Ventana de parcheo

| Actividad | Ventana o momento | Responsable | Verificación |
|---|---|---|---|
| Cambios ordinarios | Acordar una ventana tras el uso del entorno local; no hay día/hora institucional aprobado | Responsable técnico y administrador | Probar versión candidata y dependencias, registrar commit e imágenes y preparar recuperación. |
| Cambio con migración | Ventana aprobada después de disponer de respaldo válido | Responsable técnico; RSI revisa riesgo | Probar en copia aislada y verificar compatibilidad; no revertir código ignorando el esquema. |
| Hallazgo crítico o explotación activa | Activación inmediata de respuesta y cambio urgente autorizado | RSI coordina | Contener, preservar evidencia, corregir y probar antes de reabrir. |
| Publicación remota | Después de verificar HTTPS, sesiones, secretos, permisos, dependencias y recuperación | Autoridad operativa con revisión RSI | Sin hallazgos graves explotables sin tratamiento verificado o excepción formal limitada. |
| Seguimiento de tendencias | Mensual durante puesta en marcha y tras incidente relevante | RSI | Revisar abiertos, vencidos, reincidencias y eficacia de correcciones. |

El ciclo es registrar, validar, priorizar, corregir, comprobar y cerrar con evidencia. Un cambio de estado en el módulo no sustituye una repetición de la prueba ni una aceptación formal del residual. Para riesgos retenidos registrar autoridad, motivo, control compensatorio y vencimiento.

## 5. Tratamiento de falsos positivos

No hay falsos positivos validados en este expediente. Las siguientes filas fijan qué debe verificarse antes de descartar una observación; no cierran los hallazgos.

| ID | Hallazgo | Justificación o comprobación requerida | Aprobado por | Fecha |
|---|---|---|---|---|
| V-RSI-01 | Semilla TOTP en BD | AES-256-GCM implementado y conversión transaccional probada; la clave se configura fuera de la BD. Recuperación operativa de claves pendiente. | Corregida en la aplicación; no es un falso positivo | docs/evidencias/cifrado-totp.md |
| V-RSI-02 | Token en localStorage | Confirmar mecanismo efectivo de sesión y controles frente a scripts. No demostrar XSS no elimina la exposición de diseño. | Pendiente; no descartado | Pendiente |
| V-RSI-03 | Falta de respaldo independiente | Presentar copia externa, ejecución automática y restauración comprobada. Persistencia Docker no es evidencia suficiente. | Pendiente; no descartado | Pendiente |
| V-RSI-04 | Cobertura incompleta de auditoría | Probar los flujos concretos y sus eventos sin confundir logs HTTP con auditabilidad del actor y acción. | Pendiente; no descartado | Pendiente |

Un hallazgo de herramienta podrá descartarse solo con evidencia de no aplicabilidad, versión no afectada, ruta no alcanzable u otro motivo técnico reproducible. El RSI revisa la decisión y fecha de reevaluación. No confundir falso positivo, remediación comprobada y aceptación temporal de un riesgo real.
