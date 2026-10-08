# Política de Seguridad de la Información del Sistema RSI

Esta política establece las reglas de seguridad del Sistema RSI. El estado de implementación de los controles se documenta en la arquitectura y las evidencias.

## Encabezado de mapeo normativo

| Marco | Ítem | Aporte |
|---|---|---|
| MCU 5.0 | Gobernar; GV.PO-01 y GV.PO-02; perfil Avanzado como objetivo | Establecer, comunicar y revisar la política de seguridad. |
| COBIT 2019 | APO13 y APO01 | Definir criterios y responsabilidades de gestión de seguridad. |
| ISO/IEC 27001:2022 e ISO/IEC 27002:2022 | Control 5.1 | Definir la política general y las reglas específicas de seguridad. |
| BCU — Guía de estándares mínimos de gestión | PS.1 | Documentar alcance, responsables y revisión de la política. |
| Ley 18.331 / URCDP | Art. 10 | Proteger los datos personales mediante reglas de acceso, integridad y recuperación. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-POL-01 |
| Versión | 1.3 |
| Fecha | 07/10/2026 |
| Responsable | Responsable de Seguridad de la Información del Sistema RSI |
| Estado | Propuesta |

## 1. Objetivo

Establecer las directrices para proteger la confidencialidad, integridad y disponibilidad del Sistema RSI y de la información que procesa. La política guía su desarrollo, administración, uso, monitoreo y recuperación.

## 2. Alcance

Aplica a la aplicación web, API, base de datos, configuración, cuentas, registros de auditoría, respaldos y documentos exportados, así como a quienes desarrollan, administran o utilizan el sistema.

Protege el propio Sistema RSI y los datos que almacena. No establece la política de seguridad de cada organización registrada en la aplicación.

## 3. Principios de seguridad

| Principio | Regla para el Sistema RSI |
|---|---|
| Confidencialidad | Solo las personas autorizadas pueden consultar, modificar o exportar información según su rol y ámbito. |
| Integridad | Validar los cambios e impedir alteraciones no autorizadas de registros y exportaciones. |
| Disponibilidad | Mantener respaldos y procedimientos de recuperación probados. |
| Mínimo privilegio | Asignar únicamente los permisos necesarios y revisarlos cuando cambie la función del usuario. |
| Defensa en profundidad | Combinar controles de identidad, aplicación, datos, infraestructura y monitoreo según los riesgos. |
| Trazabilidad | Asociar los accesos y cambios relevantes a un actor, fecha y resultado verificables. |
| Minimización | Evitar secretos y datos personales innecesarios en logs, evidencias y exportaciones. |

## 4. Directrices de seguridad

| Área | Directriz | Documento relacionado |
|---|---|---|
| Accesos y credenciales | Autenticar usuarios, aplicar permisos por rol y ámbito, exigir MFA para Administrador y RSI, proteger sesiones y custodiar secretos fuera del repositorio. | [Gestión de accesos](./09-gestion-accesos.md) |
| Desarrollo y configuración | Validar entradas, proteger endpoints y exportadores y revisar dependencias. | [Arquitectura](./00-arquitectura.md) |
| Activos y riesgos del sistema | Inventariar componentes, asignar responsables, analizar amenazas y registrar tratamientos y riesgo residual. | [Activos](./02-registro-activos.md) y [Riesgos](./03-Analisis-Riesgos.md) |
| Vulnerabilidades | Registrar, priorizar, remediar y comprobar los hallazgos técnicos del sistema. | [Gestión de vulnerabilidades](./10-Gestion-Vulnerabilidades.md) |
| Incidentes | Reportar, registrar, contener, recuperar y documentar lecciones aprendidas. | [Gestión de incidentes](./04-Gestion-Incidentes.md) |
| Auditoría y monitoreo | Registrar accesos y cambios relevantes, proteger los logs y revisar los eventos de seguridad. | [Monitoreo y logs](./07-Monitoreo-Logs.md) |
| Continuidad | Respaldar datos y configuración, definir tiempos de recuperación y probar restauraciones. | [Plan de continuidad](./06-Plan-Continuidad.md) |
| Exportaciones | Autorizar la generación, validar el contenido y evitar mezclar datos de distintas organizaciones. | [Exportaciones](./exportaciones/README.md) |

## 5. Roles y responsabilidades

| Rol | Responsabilidad respecto del Sistema RSI |
|---|---|
| RSI | Coordinar la seguridad, revisar riesgos, incidentes y evidencias y proponer mejoras. |
| Administrador | Mantener configuración, cuentas, respaldos y operación técnica. |
| Dueño de unidad | Mantener los registros de su ámbito y reportar errores o incidentes. |
| Lector | Consultar solo la información autorizada y reportar anomalías. |

## 6. Concientización y reporte

Toda persona con acceso debe conocer las reglas de uso y protección de credenciales. Quien detecte una anomalía debe comunicarla al RSI y dejar constancia según el procedimiento de gestión de incidentes.

## 7. Vigencia y revisión

Política propuesta, sujeta a aprobación y revisión anual o ante cambios importantes.
