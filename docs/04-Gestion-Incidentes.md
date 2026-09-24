# Gestión de Incidentes de Seguridad

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-INC-04 |
| Versión | 1.0 |
| Responsable | Responsable de Seguridad de la Información |
| Fecha | 24/09/2026 |

## 1. Objetivo y alcance

Definir el procedimiento propuesto para detectar, registrar, contener,
erradicar, recuperar y analizar incidentes de seguridad relacionados con el
Sistema de Gestión Integrada para el RSI y los activos que administra. El
documento describe el proceso operativo; no implica que exista automatización
de respuesta o monitoreo centralizado.

El procedimiento aplica a incidentes que afecten la confidencialidad,
integridad o disponibilidad de la información, servicios, aplicaciones y base
de datos en alcance.

## 2. Definiciones y severidad

- **Evento de seguridad:** ocurrencia observable que puede requerir análisis.
- **Incidente de seguridad:** evento que compromete la confidencialidad,
  integridad o disponibilidad, o incumple una política de seguridad.

| Severidad | Criterio |
|---|---|
| Crítica | Compromiso masivo de información, indisponibilidad total o acceso no autorizado de alto impacto. |
| Alta | Compromiso de un activo crítico o posible exposición de datos sensibles. |
| Media | Afectación controlada de un activo o intento de intrusión confirmado. |
| Baja | Evento anómalo sin impacto confirmado. |

## 3. Registro y clasificación

El backend permite registrar incidentes asociados a un activo, con título,
descripción, severidad, estado, responsable opcional y lecciones aprendidas.
Para operar el proceso, también se deben conservar evidencias y tiempos de
respuesta por los medios disponibles. Todo registro debería incluir:

- título y descripción;
- activo afectado;
- severidad;
- estado;
- responsable;
- evidencia disponible, referenciada sin incluir secretos;
- lecciones aprendidas al cierre.

Los incidentes reales se registran en el sistema. El documento no contiene una
lista de incidentes ni sustituye los registros de la base de datos.

## 4. Procedimiento de respuesta

1. **Detección:** identificar una alerta, reporte o comportamiento anómalo.
2. **Registro:** crear el incidente, asociar el activo y asignar severidad.
3. **Análisis:** confirmar el alcance, impacto y causa probable.
4. **Contención:** limitar la propagación y preservar la evidencia disponible.
   Las acciones se ejecutan manualmente según el activo y el impacto.
5. **Erradicación:** eliminar la causa, aplicar correcciones o remediaciones.
6. **Recuperación:** restaurar la operación y comprobar el funcionamiento del
   activo afectado.
7. **Lecciones aprendidas:** documentar causa raíz, medidas que funcionaron,
   fallos y acciones de mejora.
8. **Cierre:** actualizar el estado del incidente únicamente cuando se hayan
   registrado las acciones y evidencias correspondientes.

## 5. Notificación y escalamiento

| Escenario | Destinatario | Acción |
|---|---|---|
| Incidente operativo | Responsable de Seguridad de la Información y dirección | Informar el impacto, estado y plan de respuesta. |
| Posible afectación de datos personales | Responsable de Seguridad de la Información | Evaluar la obligación de notificación ante la URCDP. |
| Incidente relevante para la organización | Dirección y responsables involucrados | Coordinar la respuesta y conservar evidencia. |

Los plazos y canales concretos de notificación externa deben validarse con los
requisitos legales y el contexto de la organización antes de operar este
procedimiento. La documentación de notificación se completará posteriormente.

## 6. Lecciones aprendidas

Al cerrar un incidente se debe registrar:

| Campo | Contenido |
|---|---|
| Qué ocurrió | Descripción verificable del incidente. |
| Causa raíz | Origen técnico, organizativo o procedimental identificado. |
| Qué funcionó | Controles o acciones efectivas. |
| Qué falló | Debilidades detectadas. |
| Acciones de mejora | Cambios en controles, procedimientos o planes. |
| Responsable y fecha | Persona responsable del seguimiento y fecha objetivo. |

## 7. Evidencias y revisión

Las evidencias pueden incluir registros del sistema, capturas, reportes,
configuraciones, resultados de pruebas o referencias a documentos. No deben
incluir contraseñas, tokens ni datos personales innecesarios.

Este procedimiento se revisará al menos una vez al año o después de un
incidente relevante.

## Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0 | 24/09/2026 | Creación del procedimiento de gestión de incidentes. |
