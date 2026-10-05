# Análisis y tratamiento de riesgos del Sistema RSI

**Seguridad de la versión local y condiciones para su publicación**

El Sistema de Gestión Integrada para el RSI concentra cuentas, información de gestión y trazabilidad en una aplicación web con API y PostgreSQL. El principal riesgo actual es perder datos y evidencia sin una recuperación probada. Se priorizan también la protección de sesiones, secretos y permisos antes de habilitar acceso remoto o información real.

La evaluación identifica 12 escenarios: 6 de nivel Alto y 6 de nivel Medio en el entorno local. No hay riesgos aceptados formalmente. El acceso remoto por HTTP y el abuso de autenticación requieren una nueva evaluación al ampliar la exposición.

### Control del documento

| Campo | Valor |
| --- | --- |
| Código | SI-RSK-03 |
| Versión | 1.0 |
| Fecha | 03/10/2026 |
| Solución | Sistema de Gestión Integrada para el RSI |
| Metodología | ISO 31000, COBIT APO12 y MCU 5.0 como referencias; evaluación cualitativa 5 por 5 |
| Responsable de mantenimiento | RSI o responsable de seguridad designado para la plataforma |
| Aprobación | Pendiente de designación de autoridad y aprobación |
| Horizonte | 03/10/2026 a 03/10/2027; revisión previa a publicación remota |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
| --- | --- | --- | --- |
| 1.0 | 03/10/2026 | Equipo del proyecto | Evaluación inicial de la plataforma local y plan de tratamiento para su publicación. |

Los responsables se expresan por rol operativo; deberán asignarse a personas antes de ejecutar el plan. Las fechas de tratamiento son objetivos propuestos y no compromisos ya aprobados.

## Mapeo normativo y contexto

### Encabezado de mapeo normativo

| Marco | Ítem | Detalle y aporte |
| --- | --- | --- |
| MCU 5.0 función | Identificar y Responder | Identificación y evaluación de riesgos (ID-02, ID-03); respuesta al riesgo. |
| MCU 5.0 categorías | ID-02, ID-03, RS-01 | Evaluación de riesgos y gestión de riesgos internos y externos. |
| COBIT 2019 | APO12 y EDM03 | Proceso central de gestión de riesgo. |
| ISO/IEC 27001:2022 | A.5.1, A.5.8, A.5.28 | Cláusula 6.1, acciones frente a riesgos, y controles. |
| ISO 31000 | Todas | Marco internacional de gestión del riesgo. |
| BCU Guía de Seguridad de la Información | Requisito de gestión de riesgo | Evaluación periódica y documentada por la Alta Dirección. |
| URCDP Ley 18.331 | Art. 9 (medidas de seguridad) | Riesgo del tratamiento de datos personales. |
| Documento de cumplimiento | docs/03-Analisis-Riesgos.md | Entregable del hito de análisis. |

Se conserva el mapeo de la plantilla como referencia documental. Para aplicar sus referencias: MCU 5.0 utiliza ID.RA para evaluación de riesgos; las medidas de seguridad de la Ley 18.331 corresponden al artículo 10. El artículo 9 regula consentimiento. El control A.5.28 se vincula con recolección de evidencia y no sustituye la evaluación de riesgos. El archivo de entrega de esta versión es `docs/03-Analisis-Riesgos.md`.

### 1 Contexto

El operador en alcance es el equipo que desarrolla y administra la plataforma RSI. La aplicación permite gestionar organización, activos, riesgos, vulnerabilidades, incidentes, cumplimiento, indicadores y exportaciones. Esas entidades son información procesada: las organizaciones y sus activos registrados no se consideran sistemas desplegados por el proyecto.

Se incluyen frontend React, API NestJS, identidad y autorización, PostgreSQL, volumen persistente, Nginx, Docker Compose, configuración, código, migraciones, auditoría y archivos exportados. El anfitrión, su disco y su red se consideran dependencias operativas que deben relevarse. Wazuh y respaldos independientes se tratan como controles por incorporar, sin declararlos instalados.

La configuración actual publica frontend en 127.0.0.1:8080, backend en 127.0.0.1:3001 y PostgreSQL en 127.0.0.1:5432. Nginx sirve React compilado y reenvía /api/ al backend. El uso de HTTP se evalúa para localhost; cambiar la interfaz publicada o abrir un dominio exige revisar el riesgo y aplicar HTTPS.

## 2 Identificación de activos y amenazas

Se mantienen los identificadores RSI-A01 a RSI-A10 del inventario del proyecto. En las tablas se abrevia RSI-A como A. A01 interfaz; A02 API; A03 identidad y autorización; A04 PostgreSQL; A05 datos persistidos; A06 volumen; A07 secretos; A08 auditoría; A09 código y migraciones; A10 configuración de ejecución.

| Riesgo | Activos | Amenaza y origen | Vulnerabilidad o condición |
| --- | --- | --- | --- |
| R01 | A04 A05 A06 A10 | Pérdida irreversible de datos. Accidental o deliberado. | Falla del disco, borrado del volumen o corrupción sin respaldo independiente. |
| R02 | A01 A02 A03 A05 | Robo y reutilización de una sesión. Externo deliberado. | El token Bearer se conserva en localStorage y puede ser leído por un script ejecutado en el mismo origen. |
| R03 | A03 A04 A05 A07 | Exposición de semillas TOTP y secretos. Interno o externo deliberado. | mfaSecret se guarda directamente en Usuario; no se observa cifrado de aplicación ni gestión de claves independiente. |
| R04 | A02 A03 A05 | Acceso o modificación fuera del ámbito autorizado. Interno deliberado. | Una regresión en filtros, relaciones o exportadores podría omitir la comprobación de rol y ámbito. |
| R05 | A01 A02 A03 A05 A10 | Intercepción del acceso remoto por HTTP. Externo deliberado. | Nginx escucha HTTP y la configuración no termina TLS; FRONTEND_BIND_ADDRESS permite ampliar la exposición. |
| R06 | A02 A03 A04 A08 | Abuso de autenticación y saturación de la API. Externo deliberado o uso intensivo. | No se observa limitación explícita de intentos en login o de peticiones en Nginx y arranque de NestJS. |
| R07 | A01 A02 A04 A09 A10 | Explotación de dependencias o imágenes. Externo o cadena de suministro. | Paquetes e imágenes dependen de terceros; etiquetas como nginx:stable-alpine y postgres:16-alpine pueden variar. |
| R08 | A04 A05 A08 | Pérdida o alteración de auditoría y detección tardía. Interno deliberado o accidental. | Los eventos comparten BD y anfitrión con los datos; no se acredita copia independiente, retención operativa ni SIEM. |
| R09 | A02 A04 A05 A09 | Alteración de datos por cambios y concurrencia. Interno accidental. | Migraciones o escrituras concurrentes pueden fallar; transacciones serializables abortan conflictos sin reintento automático. |
| R10 | A01 A02 A04 A06 A10 | Interrupción del anfitrión y recuperación prolongada. Accidental o ambiental. | Servicios y almacenamiento dependen de un mismo equipo; falta prueba de reconstrucción y estado integral del servicio. |
| R11 | A01 A02 A05 A08 A09 | Divulgación de información mediante exportaciones o evidencias. Interno accidental o deliberado. | Una descarga autorizada puede compartirse fuera de su finalidad; las capturas o metadatos de auditoría pueden contener datos personales. |
| R12 | A03 A05 A07 | Bloqueo de acceso por pérdida del segundo factor. Accidental. | No se acredita procedimiento de recuperación de MFA, revocación de passkeys ni prueba real de Windows Hello. |

C = confidencialidad; I = integridad; D = disponibilidad. Una debilidad confirmada de configuración no demuestra que haya ocurrido un incidente. Los escenarios de XSS, permisos y dependencias describen amenazas potenciales que deben validarse con pruebas.

El inventario fechado el 30/09/2026 y parte de la arquitectura describen Compose con solo PostgreSQL y Nginx pendiente. La configuración actual ya contiene los tres servicios y el proxy HTTP. Este análisis utiliza esa configuración vigente y propone actualizar el inventario como parte del seguimiento.

## 3 Análisis cualitativo del riesgo

La valoración actual considera los controles observados en código y configuración. No es riesgo inherente sin controles. Las puntuaciones son estimaciones cualitativas para un año de operación local; no representan frecuencias estadísticas, pérdidas monetarias ni resultados de un ataque ejecutado.

### 3 1 Escala de probabilidad

| Valor | Nivel | Criterio para el Sistema RSI |
| --- | --- | --- |
| 1 | Muy baja | Exposición muy restringida y condiciones adicionales poco habituales. |
| 2 | Baja | Escenario factible, limitado por controles o por el uso local. |
| 3 | Media | Puede ocurrir durante la operación habitual; existe una brecha relevante sin prueba de eficacia compensatoria. |
| 4 | Alta | Exposición amplia y controles insuficientes frente a una amenaza accesible. |
| 5 | Muy alta | Condición recurrente observada o explotación muy probable con evidencia. |

### 3 2 Escala de impacto

| Valor | Nivel | Consecuencia para la plataforma |
| --- | --- | --- |
| 1 | Insignificante | Interrupción mínima o error aislado sin datos sensibles afectados. |
| 2 | Menor | Función no esencial afectada; corrección simple sin pérdida relevante. |
| 3 | Moderado | Operación degradada o datos limitados afectados; recuperación factible con trabajo técnico. |
| 4 | Mayor | Acceso privilegiado indebido, exposición relevante o caída de funciones centrales que puede exceder los RTO. |
| 5 | Catastrófico | Pérdida irreversible de datos o imposibilidad de reconstruir la operación y su evidencia. |

### 3 3 Matriz de riesgo

| I / P | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| 5 | M | M | A | A | C |
| 4 | M | M | A | A | A |
| 3 | B | M | M | A | A |
| 2 | B | B | M | M | A |
| 1 | B | B | B | M | M |

Resultado numérico = P × I, entre 1 y 25. El nivel se obtiene de la matriz de la plantilla, no de intervalos del producto: P=5 e I=1 y P=1 e I=5 tienen el mismo producto, pero distinto nivel. La matriz conserva sensibilidad al impacto.

Criterio de aceptación propuesto: Bajo puede retenerse con decisión registrada; Medio exige tratamiento o excepción temporal justificada; Alto y Crítico requieren tratamiento y revisión antes de ampliar exposición o usar datos reales. Ningún nivel se acepta automáticamente. La autoridad operativa aprueba; el RSI revisa y mantiene el registro.

## 4 Registro de riesgos y evaluación

Todos los escenarios están abiertos al 03/10/2026 y se propone Mitigar (M). T = transferir; R = retener; A = evitar. Cada Rnn se vincula al plan PTnn de la sección 5. Las responsabilidades y fechas se detallan allí para conservar una tabla legible.

| ID | Riesgo | Activos | P | I | P × I | Nivel |
| --- | --- | --- | --- | --- | --- | --- |
| R01 | Pérdida irreversible de datos | A04 A05 A06 A10 | 3 | 5 | 15 | Alto |
| R02 | Robo y reutilización de una sesión | A01 A02 A03 A05 | 3 | 4 | 12 | Alto |
| R03 | Exposición de semillas TOTP y secretos | A03 A04 A05 A07 | 3 | 4 | 12 | Alto |
| R04 | Acceso o modificación fuera del ámbito autorizado | A02 A03 A05 | 2 | 4 | 8 | Medio |
| R05 | Intercepción del acceso remoto por HTTP | A01 A02 A03 A05 A10 | 1 | 4 | 4 | Medio |
| R06 | Abuso de autenticación y saturación de la API | A02 A03 A04 A08 | 2 | 4 | 8 | Medio |
| R07 | Explotación de dependencias o imágenes | A01 A02 A04 A09 A10 | 3 | 4 | 12 | Alto |
| R08 | Pérdida o alteración de auditoría y detección tardía | A04 A05 A08 | 3 | 4 | 12 | Alto |
| R09 | Alteración de datos por cambios y concurrencia | A02 A04 A05 A09 | 3 | 3 | 9 | Medio |
| R10 | Interrupción del anfitrión y recuperación prolongada | A01 A02 A04 A06 A10 | 3 | 4 | 12 | Alto |
| R11 | Divulgación de información mediante exportaciones o evidencias | A01 A02 A05 A08 A09 | 3 | 3 | 9 | Medio |
| R12 | Bloqueo de acceso por pérdida del segundo factor | A03 A05 A07 | 3 | 3 | 9 | Medio |

### Prioridades de ejecución

Primera prioridad: R01, R02, R03, R07, R08 y R10, de nivel Alto. Respaldos y restauración protegen la única copia; sesiones y semillas TOTP protegen el acceso; dependencias y auditoría cubren la integridad del software y la investigación de incidentes.

R05 y R06 tienen probabilidad menor en localhost. Sin TLS o límites de abuso, publicar la interfaz eleva ambos a P=4, I=4, producto 16 y nivel Alto. Esas valoraciones futuras no se mezclan con el registro actual ni se usan para afirmar una exposición externa existente.

### Criterios de revisión de puntuaciones

Aumentar probabilidad cuando una prueba confirme explotación, se amplíen interfaces o aparezca un hallazgo relevante. Reducirla solo con evidencia del control. Modificar impacto si se demuestra recuperación, cambia la sensibilidad o cantidad de datos o se restringe el alcance efectivo de una cuenta.

La falta de pruebas de restauración impide declarar los RTO y RPO alcanzados. El plan de continuidad propone BD en 4 h y backend en 2 h después de recuperar la BD: no equivale a recuperar la plataforma completa en 2 h.

## 5. Plan de tratamiento de riesgos

Las acciones y fechas son propuestas para el Sistema RSI. Todos los planes están abiertos al 03/10/2026. M significa mitigar. Los responsables se expresan por rol y deben asignarse a personas. El cierre exige comprobar la evidencia indicada.

| ID Riesgo | Acción de tratamiento | Control o medida a implementar | Recurso | Prioridad | Fecha objetivo | Responsable propuesto | Evidencia para el cierre |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R01 | Mitigar mediante PT01 | Automatizar respaldo diario cifrado fuera del anfitrión, definir retención y alertar ante fallos. Restaurar una copia en un entorno aislado y verificar relaciones, autenticación y consultas. | Almacenamiento externo, herramienta de respaldo y entorno aislado. | Alta | 10/10/2026 | Administrador de plataforma | Registro de ejecución y restauración; RPO máximo de 24 h y RTO de BD de 4 h medidos, o revisión de los objetivos. |
| R02 | Mitigar mediante PT02 | Revisar los puntos de renderizado y dependencias. Implementar CSP comprobada y revisar la sesión con cookie HttpOnly, Secure y SameSite más protección CSRF; incorporar revocación de sesiones y nueva autenticación para acciones sensibles. | Desarrollo frontend y backend, navegador de prueba y revisión de seguridad. | Alta | 17/10/2026 | Responsable técnico | Pruebas de XSS y sesión, ausencia de token accesible a JavaScript si se cambia el mecanismo, prueba de revocación y de CSRF. |
| R03 | Mitigar mediante PT03 | Cifrar las semillas con autenticación de integridad y clave fuera de la BD y sus respaldos. Restringir privilegios de BD y permisos de configuración. Definir rotación y recuperación; revisar historial Git sin divulgar valores. | Gestión de claves, migración controlada y revisión de permisos. | Alta | 17/10/2026 | Responsable técnico y administrador de plataforma | Copia de prueba sin semillas legibles, permisos documentados y ejercicio de recuperación y rotación sin revelar claves. |
| R04 | Mitigar mediante PT04 | Mantener una matriz de permisos por ruta. Probar lectura y escritura cruzadas entre dos organizaciones y unidades, relaciones indirectas, exportaciones y cambios de rol. Exigir revisión de autorización en cada nueva ruta. | Pruebas de API con identidades y ámbitos separados. | Media | 17/10/2026 | Responsable técnico | Solicitudes cruzadas rechazadas sin devolver datos ajenos; matriz de roles y prueba de exportadores antes de cada entrega. |
| R05 | Mitigar mediante PT05 | Mantener loopback en el entorno actual. Antes de acceso remoto configurar terminación HTTPS y certificado, origen WebAuthn exacto, redirección y política de transporte. Verificar que API y BD no sean accesibles directamente desde la red externa. | Dominio, certificado y proxy de entrada con TLS. | Media | Antes del primer acceso remoto | Administrador de plataforma | Prueba externa de HTTPS, puertos y redirecciones; registro y login WebAuthn con origen real y rechazo de origen incorrecto. |
| R06 | Mitigar mediante PT06 | Aplicar límites por cuenta y origen, demoras progresivas y alertas evitando bloqueos abusivos. Definir límites de cuerpo y concurrencia y probar carga. Incluir TOTP y desafíos WebAuthn en los controles de abuso. | Middleware o proxy de límites y herramienta de carga en entorno aislado. | Media | 17/10/2026 y antes del acceso remoto | Responsable técnico | Respuestas 429 o demoras verificadas, acceso legítimo conservado y métricas de carga sin agotar el servicio. |
| R07 | Mitigar mediante PT07 | Inventariar versiones y procedencia, analizar lockfiles e imágenes, priorizar hallazgos explotables y actualizar con pruebas. Fijar imágenes por digest para releases y registrar excepciones con fecha de vencimiento. | Análisis de dependencias e imágenes y tiempo de actualización. | Alta | 24/10/2026 | Responsable técnico | Informe fechado por versión evaluada, remediaciones comprobadas y excepciones autorizadas; reconstrucción reproducible de la release. |
| R08 | Mitigar mediante PT08 | Enviar eventos a un destino independiente con acceso restringido, preservar integridad y monitorear fallos. Definir retención de al menos un año conforme a RNF-05 y alertar por abuso de login, cambios privilegiados y exportaciones inusuales. | Destino de logs, almacenamiento, alertas y revisión periódica. | Alta | 24/10/2026 | Administrador de plataforma y RSI | Evento recibido fuera de la BD, prueba de alerta y permisos, política de retención con capacidad calculada y recuperación de logs. |
| R09 | Mitigar mediante PT09 | Probar migraciones sobre copia aislada, respaldar antes del cambio y documentar recuperación. Gestionar conflictos y reintentos acotados solo cuando sean seguros; evitar duplicación con idempotencia en operaciones críticas. | BD de prueba, casos concurrentes y ventana de cambio. | Media | 24/10/2026 | Responsable técnico | Pruebas simultáneas sin cambios parciales ni duplicados, mensajes claros y procedimiento de migración y recuperación comprobado. |
| R10 | Mitigar mediante PT10 | Relevar anfitrión y capacidad, incorporar salud del backend y prueba funcional externa, vigilar disco y recursos. Reconstruir el servicio en otro entorno desde código, configuración custodiada y respaldo. Validar RTO extremo a extremo. | Entorno alternativo, monitoreo de recursos y procedimiento de reconstrucción. | Alta | 24/10/2026 | Administrador de plataforma | Simulacro con tiempos registrados; BD recuperada en 4 h y backend en 2 h adicionales como objetivos iniciales; disponibilidad medida, no supuesta. |
| R11 | Mitigar mediante PT11 | Usar datos de prueba no personales en demostraciones; revisar exportaciones y capturas antes de publicarlas. Minimizar campos de auditoría, definir conservación y destino autorizado, y documentar la autorización para compartir datos reales. | Revisión de contenido, reglas de publicación y almacenamiento restringido. | Media | 10/10/2026 | RSI y responsable técnico | Muestras de exportación y evidencia sin secretos ni datos personales innecesarios; autorización y destino registrados para contenido real. |
| R12 | Mitigar mediante PT12 | Definir recuperación de cuentas con comprobación de identidad, aprobación y auditoría. Incorporar revocación de passkeys y sesiones. Probar Windows Hello y una llave física, incluyendo pérdida del factor y origen inválido, sin omitir MFA. | Dispositivo Windows, autenticador físico y procedimiento de recuperación. | Media | 24/10/2026 | Responsable técnico y RSI | Acta de registro y login reales, recuperación autorizada y revocación que invalide credenciales y sesiones comprometidas. |

## 6. Riesgo residual y aceptación

Los valores siguientes son objetivos postratamiento, no riesgos residuales ya medidos. Solo podrán aceptarse después de implementar y verificar cada plan. Hasta entonces sigue vigente la evaluación de la sección 4. R01 mantiene impacto 5 porque un respaldo también puede fallar; el objetivo reduce su probabilidad.

| ID | Riesgo residual postratamiento propuesto | Aceptado por | Firma | Fecha |
| --- | --- | --- | --- | --- |
| R01 | P=1; I=5; P × I=5; nivel Medio. Condicionado a verificar PT01. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R02 | P=1; I=4; P × I=4; nivel Medio. Condicionado a verificar PT02. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R03 | P=1; I=4; P × I=4; nivel Medio. Condicionado a verificar PT03. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R04 | P=1; I=4; P × I=4; nivel Medio. Condicionado a verificar PT04. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R05 | P=1; I=4; P × I=4; nivel Medio. Condicionado a verificar PT05. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R06 | P=1; I=4; P × I=4; nivel Medio. Condicionado a verificar PT06. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R07 | P=2; I=3; P × I=6; nivel Medio. Condicionado a verificar PT07. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R08 | P=1; I=4; P × I=4; nivel Medio. Condicionado a verificar PT08. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R09 | P=1; I=3; P × I=3; nivel Bajo. Condicionado a verificar PT09. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R10 | P=2; I=3; P × I=6; nivel Medio. Condicionado a verificar PT10. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R11 | P=1; I=3; P × I=3; nivel Bajo. Condicionado a verificar PT11. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |
| R12 | P=1; I=3; P × I=3; nivel Bajo. Condicionado a verificar PT12. | Pendiente de aceptación por la autoridad operativa, con revisión del RSI | Pendiente | Pendiente |

Ningún riesgo está aceptado formalmente al 03/10/2026. La autoridad operativa debe ser designada; tener el rol técnico Administrador no equivale a ser la autoridad que acepta el riesgo. La decisión deberá registrar por riesgo la evidencia verificada, justificación, límites de uso, vigencia y próxima revisión. Una excepción temporal requiere control compensatorio, responsable y fecha de vencimiento.

R01, R02, R03, R04, R05, R06, R07, R08 y R10 tienen residual objetivo Medio; R09, R11 y R12 tienen objetivo Bajo. Ninguno se acepta automáticamente.
