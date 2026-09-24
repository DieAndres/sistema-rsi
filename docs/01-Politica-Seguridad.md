# Política de Seguridad de la Información

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-POL-01 |
| Versión | 1.0 |
| Fecha de aprobación | Pendiente de aprobación |
| Aprobado por | Pendiente de aprobación |
| Autor | Equipo del proyecto |
| Próxima revisión | Un año después de la aprobación o ante cambios significativos |

## 1. Objetivo

Establecer los principios de seguridad para la información gestionada por el
Sistema de Gestión Integrada para el RSI. Este documento es una propuesta
pendiente de aprobación formal y no acredita por sí solo que los controles
técnicos estén implementados.

La política orienta la gestión de organizaciones, trabajadores, activos,
riesgos, vulnerabilidades, incidentes, cumplimiento y evidencias.

## 2. Alcance

Esta política aplica a:

- la API backend y sus módulos funcionales;
- la base de datos PostgreSQL;
- los activos, riesgos, vulnerabilidades e incidentes registrados;
- las políticas, procedimientos, planes y evidencias gestionados;
- las personas que administren o consulten la información del sistema;
- el entorno local de ejecución mediante Docker Compose.

El frontend, la autenticación avanzada, la auditoría centralizada, los
exportadores y la integración con un SIEM forman parte del alcance previsto,
pero algunos todavía se encuentran pendientes de implementación.

## 3. Marco normativo

La política se relaciona con los siguientes marcos:

- **MCU 5.0:** función Gobernar y categorías relacionadas con la gestión de
  activos, riesgos y protección.
- **BCU:** política formal, gestión de riesgos, activos, vulnerabilidades,
  incidentes y continuidad.
- **ISO/IEC 27001:** políticas de seguridad, inventario de activos, gestión de
  riesgos y respuesta a incidentes.
- **Ley 18.331:** protección y seguridad de los datos personales cuando sean
  gestionados por la organización.

## 4. Principios de seguridad

| Principio | Aplicación |
|---|---|
| Confidencialidad | La información debe estar disponible únicamente para personas autorizadas. |
| Integridad | Los datos deben mantenerse completos, correctos y protegidos contra modificaciones no autorizadas. |
| Disponibilidad | Los servicios y datos necesarios para la gestión deben poder recuperarse cuando se necesiten. |
| Mínimo privilegio | Cada usuario debe acceder solamente a la información necesaria para su función. |
| Defensa en profundidad | La protección debe combinar controles de aplicación, base de datos, infraestructura y monitoreo. |
| Trazabilidad | Las operaciones relevantes deben poder relacionarse con su responsable y evidencia. |

## 5. Reglas de gestión

### 5.1 Activos

El sistema permite registrar activos con nombre, tipo, unidad, responsable y
criticidad. La clasificación y el inventario completo requerido por la letra
deben validarse como parte del modelo y de la carga de datos.

### 5.2 Riesgos

Los riesgos deben analizarse considerando probabilidad e impacto. Cada riesgo
debe indicar su estado, tratamiento, riesgo residual y aceptación cuando
corresponda. El tratamiento puede consistir en mitigar, transferir, evitar o
aceptar el riesgo.

### 5.3 Vulnerabilidades

Las vulnerabilidades deben registrarse con CVSS cuando corresponda, estado,
responsable, SLA y plan de remediación. Las vulnerabilidades críticas deben
priorizarse y revisarse dentro del plazo definido.

### 5.4 Incidentes

Los incidentes deben registrarse y seguir un ciclo de vida que contemple
detección, contención, erradicación, recuperación y lecciones aprendidas.
También deben registrar severidad, estado, activo afectado y responsable.

### 5.5 Documentos y evidencias

Las políticas, procedimientos, planes y evidencias deben mantener los
metadatos disponibles en el sistema. Los documentos formales deben tener
versión, responsable y fecha de revisión cuando corresponda. Las evidencias no
deben contener secretos ni datos personales innecesarios.

### 5.6 Secretos y configuración

Las cadenas de conexión y credenciales locales se configuran mediante archivos
`.env` excluidos del repositorio. Los secretos reales no deben subirse a Git.

## 6. Roles y responsabilidades

| Rol | Responsabilidades |
|---|---|
| RSI | Coordinar la gestión de seguridad, revisar riesgos, incidentes, cumplimiento y evidencias. |
| Administrador | Mantener la configuración técnica y controlar el funcionamiento del sistema. |
| Responsable de unidad | Mantener actualizados los activos, riesgos e incidentes de su unidad. |
| Usuario lector | Consultar la información autorizada y reportar inconsistencias. |
| Equipo de desarrollo | Implementar, probar y documentar las funcionalidades del sistema. |
| Equipo auditor | Revisar evidencias, controles y resultados sin modificar los registros evaluados. |

La aplicación de autenticación, autorización y auditoría detallada debe
completarse antes de declarar esos controles como implementados.

## 7. Concientización y cumplimiento

Las personas usuarias deben conocer esta política y los procedimientos
relacionados con el uso del sistema, el reporte de incidentes y la protección
de la información.

Las desviaciones deben registrarse, analizarse y tratarse mediante un riesgo,
un plan de acción o un incidente, según corresponda.

## 8. Vigencia y revisión

Esta política entra en vigencia luego de su aprobación formal. Debe revisarse
al menos una vez al año o cuando cambien significativamente la arquitectura,
los riesgos, la normativa o los procesos de la organización.

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 24/09/2026 | Creación de la política para el sistema RSI. |

## Estado de implementación

Actualmente están disponibles endpoints backend para gestionar activos,
riesgos, vulnerabilidades, incidentes, organización, cumplimiento, evidencias
y un resumen básico de KPI. La interfaz web, autenticación, autorización,
auditoría centralizada, respaldos probados, exportadores e integración SIEM
están pendientes de implementación y validación. La aprobación formal de esta
política también está pendiente.
