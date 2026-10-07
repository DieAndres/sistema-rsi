# Análisis y tratamiento de riesgos del Sistema RSI

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-RSK-03 |
| Versión | 1.1 |
| Fecha | 07/10/2026 |
| Responsable | RSI |
| Estado | Evaluación del entorno local; tratamientos propuestos |

## Encabezado de mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Identificar; ID.RA | Identificar y evaluar riesgos. |
| COBIT 2019 | APO12 y EDM03 | Gestionar y priorizar riesgos. |
| ISO/IEC 27001:2022 | Cláusula 6.1 | Evaluar riesgos y definir su tratamiento. |
| ISO 31000 | Gestión del riesgo | Orientar el análisis, tratamiento y revisión. |
| BCU — Guía de Seguridad de la Información | Gestión de riesgos | Mantener una evaluación documentada. |
| Ley 18.331 | Art. 10 | Considerar la seguridad de los datos personales. |

## 1. Alcance

Este análisis evalúa los riesgos del propio Sistema RSI: interfaz, API, autenticación, base de datos, auditoría, configuración, código e infraestructura local. Las organizaciones y activos cargados por los usuarios son información almacenada por la plataforma.

Docker Compose define frontend, backend y PostgreSQL. Nginx ofrece HTTPS local con certificado autofirmado y redirige HTTP a HTTPS. El backend se comunica por la red interna de Docker y PostgreSQL publica su puerto solo en loopback. Wazuh, respaldos independientes y restauraciones probadas siguen pendientes.

La evaluación identifica 12 escenarios: 6 de nivel Alto y 6 de nivel Medio. Las valoraciones son estimaciones del entorno local, no resultados de ataques ejecutados. Deben revisarse antes de publicar el sistema o ampliar su uso con datos reales.

## 2. Identificación de riesgos

Se utilizan los IDs del [inventario de activos](./02-registro-activos.md), abreviando RSI-A como A: A01 interfaz; A02 API; A03 autenticación y permisos; A04 PostgreSQL; A05 datos; A06 volumen; A07 secretos; A08 auditoría; A09 código y migraciones; A10 configuración; A11 Nginx/TLS.

| ID | Riesgo | Activos | Condición que lo origina |
|---|---|---|---|
| R01 | Pérdida irreversible de datos | A04 A05 A06 A10 | Falla, borrado o corrupción sin respaldo independiente y restauración probada. |
| R02 | Robo y reutilización de una sesión | A01 A02 A03 A05 | La sesión usa cookie HttpOnly y validación de origen; un XSS aún podría ejecutar acciones desde el navegador o una cookie robada por otros medios podría reutilizarse hasta su revocación o vencimiento. |
| R03 | Exposición de semillas TOTP y secretos | A03 A04 A05 A07 | Las semillas TOTP se guardan en la BD sin cifrado de aplicación. |
| R04 | Acceso o modificación fuera del ámbito autorizado | A02 A03 A05 | Una regresión en permisos, relaciones o exportadores podría permitir acceso a datos ajenos. |
| R05 | Exposición insegura al publicar el sistema | A01 A02 A03 A05 A10 A11 | HTTPS local está configurado; una publicación requiere certificado válido, configuración de red y revisión de puertos. |
| R06 | Abuso de autenticación y saturación de la API | A02 A03 A04 A08 A11 | No se observa limitación explícita de intentos de login ni de peticiones. |
| R07 | Explotación de dependencias o imágenes | A01 A02 A04 A09 A10 A11 | Dependencias de terceros e imágenes con etiquetas variables pueden incorporar vulnerabilidades. |
| R08 | Pérdida o alteración de auditoría y detección tardía | A04 A05 A08 | Auditoría y datos comparten BD y anfitrión; no hay copia independiente ni SIEM. |
| R09 | Fallos de integridad por cambios y concurrencia | A02 A04 A05 A09 | Migraciones o cambios concurrentes pueden causar errores; los conflictos requieren manejo y comprobación. |
| R10 | Interrupción del anfitrión y recuperación prolongada | A01 A02 A04 A06 A10 A11 | Servicios y datos dependen de un equipo; falta probar su reconstrucción en otro entorno. |
| R11 | Divulgación mediante exportaciones o evidencias | A01 A02 A05 A08 A09 | Archivos, capturas y metadatos pueden compartirse con datos personales innecesarios. |
| R12 | Bloqueo de acceso por pérdida de TOTP | A03 A05 A07 | Falta un procedimiento de recuperación de cuentas que compruebe identidad y registre las acciones. |

## 3. Criterios de evaluación

Los riesgos se priorizan considerando la posibilidad de que ocurran y sus consecuencias en el entorno local. Se clasifican como Altos cuando requieren atención prioritaria y Medios cuando necesitan tratamiento y seguimiento. La condición que origina cada riesgo y los controles actuales fundamentan esta valoración cualitativa.

## 4. Evaluación y prioridades

| ID | Riesgo | Nivel |
|---|---|---|
| R01 | Pérdida irreversible de datos | Alto |
| R02 | Robo y reutilización de una sesión | Alto |
| R03 | Exposición de semillas TOTP y secretos | Alto |
| R04 | Acceso fuera del ámbito autorizado | Medio |
| R05 | Exposición insegura al publicar el sistema | Medio |
| R06 | Abuso de autenticación y saturación | Medio |
| R07 | Explotación de dependencias o imágenes | Alto |
| R08 | Pérdida de auditoría y detección tardía | Alto |
| R09 | Fallos por cambios y concurrencia | Medio |
| R10 | Interrupción y recuperación prolongada | Alto |
| R11 | Divulgación mediante exportaciones o evidencias | Medio |
| R12 | Bloqueo de acceso por pérdida de TOTP | Medio |

Se priorizan R01, R02, R03, R07, R08 y R10 por su nivel Alto. R05 y R06 deben revisarse antes del acceso remoto. La evaluación también se actualiza cuando cambian los datos, la infraestructura o los controles, o aparecen nuevos hallazgos. Los tiempos de recuperación se definen y comprueban según el [plan de continuidad](./06-Plan-Continuidad.md).

## 5. Plan de tratamiento

Las siguientes medidas son propuestas para reducir los riesgos. Su cierre requiere la comprobación indicada. R02 ya cuenta con cookies protegidas, validación de origen, CSP y revocación comprobados; conserva su prioridad para revisar el riesgo residual y las dependencias.

| Riesgo | Medida propuesta | Responsable | Prioridad | Comprobación |
|---|---|---|---|---|
| R01 | Automatizar respaldos independientes, proteger las copias y probar su restauración. | Administrador | Alta | Recuperar datos y verificar relaciones, acceso y consultas. |
| R02 | Mantener cookies protegidas, validación de origen, CSP y revocación implementados; revisar dependencias y reforzar la protección frente a XSS. | Responsable técnico | Alta | Cookies, origen, vencimiento y revocación comprobados; seguimiento en la evidencia de sesiones. |
| R03 | Cifrar semillas TOTP con una clave externa a la BD y restringir acceso a secretos. | Responsable técnico y Administrador | Alta | Comprobar que una copia de la BD no revela semillas y probar recuperación de claves. |
| R04 | Mantener pruebas de permisos por rol, organización y unidad, incluyendo relaciones y exportaciones. | Responsable técnico | Media | Rechazar consultas y modificaciones sobre datos ajenos. |
| R05 | Mantener la exposición local; antes de publicar, configurar certificado válido, HTTPS y restricciones de puertos. | Administrador | Media; previa a publicación | Verificar certificado, redirección y ausencia de acceso externo directo a API y BD. |
| R06 | Limitar intentos de login y TOTP, controlar peticiones y comprobar el comportamiento ante carga. | Responsable técnico | Media; previa a publicación | Verificar límites o demoras sin impedir el acceso legítimo. |
| R07 | Revisar dependencias e imágenes, actualizar hallazgos relevantes y probar las versiones utilizadas. | Responsable técnico | Alta | Registrar revisión, correcciones y compilación de la versión evaluada. |
| R08 | Centralizar auditoría en un destino independiente, definir retención y alertas. | Administrador y RSI | Alta | Comprobar recepción de eventos, permisos y una alerta de prueba. |
| R09 | Probar migraciones y operaciones concurrentes; respaldar antes de cambios y manejar conflictos. | Responsable técnico | Media | Verificar ausencia de cambios parciales y documentar recuperación. |
| R10 | Relevar el anfitrión, monitorear recursos y reconstruir el servicio en otro entorno. | Administrador | Alta | Ejecutar un simulacro y registrar tiempos de recuperación. |
| R11 | Usar datos sintéticos en demostraciones y revisar exportaciones, capturas y campos de auditoría. | RSI y Responsable técnico | Media | Comprobar que las muestras no contienen secretos ni datos personales innecesarios. |
| R12 | Definir recuperación de cuentas con verificación de identidad, restablecimiento de TOTP y revocación de sesiones. | Responsable técnico y RSI | Media | Probar una recuperación autorizada y registrar quién la realizó y su resultado. |

## 6. Riesgo residual y aceptación

El riesgo residual es el que permanece después de aplicar un tratamiento. Se reevaluará el nivel de riesgo cuando cada medida esté implementada y probada; hasta entonces se mantiene la valoración actual.

No se registran riesgos aceptados formalmente. Cualquier aceptación debe indicar riesgo, justificación, responsable y fecha de revisión. Los riesgos Altos y Críticos requieren tratamiento y revisión antes de ampliar la exposición o incorporar datos reales.
