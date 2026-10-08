# Gestión de incidentes de seguridad del Sistema RSI

Este procedimiento define cómo responder a incidentes que afectan al propio Sistema RSI: aplicación, API, autenticación, base de datos, exportaciones o infraestructura. Los incidentes de una organización registrados en la aplicación son datos gestionados por el sistema y no implican un incidente de la plataforma.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Detectar, Responder y Recuperar | Organizar la detección, respuesta y recuperación. |
| COBIT 2019 | DSS02 y DSS04 | Gestionar incidentes y continuidad. |
| ISO/IEC 27001:2022 | Controles 5.24 a 5.28 | Preparar la respuesta y preservar evidencias. |
| ISO/IEC 27035-1:2023 | Gestión de incidentes | Ordenar las etapas del procedimiento. |
| BCU | Gestión de incidentes | Evaluar comunicaciones cuando corresponda a una entidad supervisada. |
| Protección de datos personales | Ley 19.670 y Decreto 64/020 | Evaluar las comunicaciones ante una vulneración de datos personales. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-INC-04 |
| Versión | 1.5 |
| Responsable | RSI o responsable de seguridad designado |
| Fecha | 08/10/2026 |

## 1. Definiciones y severidad

Un **evento** es un hecho que requiere evaluación, como un intento fallido de acceso. Un **incidente** es un evento confirmado o razonablemente sospechado que afecta la confidencialidad, integridad o disponibilidad del sistema.

La severidad determina la prioridad de respuesta y puede cambiar con la información obtenida.

| Severidad | Criterio | Ejemplo |
|---|---|---|
| Crítica | Afectación extensa de datos o del servicio. | Acceso no autorizado a toda la BD. |
| Alta | Compromiso de una cuenta privilegiada o de datos restringidos. | Uso de una sesión administrativa por un tercero. |
| Media | Afectación limitada que requiere intervención. | Alteración de una exportación. |
| Baja | Anomalía con impacto aún no confirmado. | Serie inusual de accesos fallidos. |

## 2. Registro y responsables

Quien detecte un evento debe informarlo al RSI o responsable de seguridad. Este evalúa el caso, asigna severidad y coordina la respuesta. El administrador o responsable técnico ejecuta las acciones técnicas.

| Campo | Qué registrar |
|---|---|
| Identificador | Referencia única del caso. |
| Fecha y hora | Detección, acciones, recuperación y cierre, indicando zona horaria. |
| Descripción y fuente | Qué ocurrió y cómo se detectó. |
| Severidad y estado | Clasificación y situación actual. |
| Alcance | Componentes y datos afectados. |
| Responsable | Persona que coordina la respuesta. |
| Evidencias | Referencias a logs o archivos preservados con acceso restringido. |
| Acciones | Medidas tomadas, resultados y comunicaciones. |

El módulo de incidentes registra casos asociados a activos de organizaciones y conserva acciones por etapa, autor y fecha. Su funcionamiento se describe en [Ciclo de incidentes](evidencias/incidentes-ciclo.md). Para un incidente del propio RSI se debe identificar el caso real o simulacro y conservar su registro y evidencias; la existencia del módulo no demuestra que haya ocurrido uno.

## 3. Procedimiento de respuesta

1. **Detección:** recibir un reporte o identificar una anomalía en los registros. Anotar fecha, hora y fuente.
2. **Evaluación:** determinar alcance, severidad y responsable. Preservar logs y archivos relevantes antes de modificarlos, cuando sea posible, sin guardar secretos en Git.
3. **Contención:** limitar el daño, por ejemplo revocando sesiones o restringiendo el acceso al componente afectado. Registrar las medidas.
4. **Corrección:** solucionar la causa identificada y comprobar que el problema no se repita.
5. **Recuperación:** restablecer el servicio y verificar los datos, autenticación, permisos y funciones afectadas. Aplicar el [Plan de continuidad](06-Plan-Continuidad.md) cuando corresponda.
6. **Cierre:** documentar resultados, comunicaciones y mejoras después de comprobar la recuperación.

La respuesta actual es manual y utiliza auditoría de aplicación y logs técnicos. La integración con Wazuh para detección y alertas queda como mejora futura. Los respaldos automatizados y las restauraciones probadas siguen pendientes.

## 4. Notificación y escalamiento

| Situación | A quién informar | Cuándo |
|---|---|---|
| Evento o incidente del RSI | RSI o responsable de seguridad y administrador. | Al detectarlo. |
| Incidente crítico o alto | Responsable de seguridad y autoridad operativa. | Inmediatamente después de la clasificación inicial. |
| Posible exposición de datos personales | Responsable del tratamiento para evaluar comunicaciones a URCDP y titulares. | Según el procedimiento y los plazos aplicables. |
| Incidente de una entidad supervisada por el BCU | Responsable institucional de cumplimiento. | Según las obligaciones de esa entidad. |

Registrar las comunicaciones en el caso. Los destinatarios, criterios y plazos externos se detallan en [Notificación de incidentes](12-Notificacion-Incidentes.md). El sistema no envía automáticamente estas notificaciones.

## 5. Lecciones aprendidas

| Tema | Qué documentar |
|---|---|
| Qué ocurrió | Hechos y secuencia del incidente. |
| Causa | Causa comprobada o hipótesis pendiente. |
| Respuesta | Qué funcionó y qué debe mejorarse. |
| Recuperación | Comprobaciones y resultados. |
| Mejoras | Acción concreta, responsable y fecha prevista. |
