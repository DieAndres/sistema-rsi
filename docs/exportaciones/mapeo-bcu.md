# Exportación BCU (GSI)

Fuente: sección 3 de `plantilla/bcu/01-requerimientos-minimos-bcu.md`, síntesis educativa de 18 requerimientos. Los IDs BCU-01 a BCU-18 son internos; no se presenta el catálogo como GSI oficial completa.

| Campo | Fuente | Validación |
|---|---|---|
| Requerimiento y descripción de referencia | Catálogo de la plantilla | Solo lectura. |
| Cumple / parcial / no cumple / no aplica | `EvaluacionBcu.respuesta` | Sin evaluación = pendiente. |
| Justificación y aplicabilidad | `EvaluacionBcu.justificacion` | Obligatoria para cualquier evaluación, incluida no aplicabilidad a la entidad. |
| Evidencia | `EvaluacionBcu.evidencia` | Obligatoria para cumple o parcial; revisión humana de la referencia. |
| Acción pendiente | `EvaluacionBcu.demostracion` | Texto ingresado por el evaluador. |

Acceso: **Exportaciones → BCU (GSI) → Informe de requerimientos mínimos → Completar evaluación BCU**. Las evaluaciones se guardan por organización y requerimiento en `evaluaciones_bcu`. Al guardar se vuelve a generar el informe. Permite descargar Markdown, CSV de la tabla y PDF mediante impresión del navegador.

Rutas bajo `/api/v1/exportaciones/organizaciones/{id}/`: `GET bcu-controles`, `PUT bcu-controles/{controlId}` y `GET bcu-gsi`. Escritura limitada a ADMINISTRADOR/RSI; lectura por alcance y auditoría de cambios/exportaciones.

El resultado es un borrador de revisión, no acredita cumplimiento regulatorio. No calcula cumplimiento por tener activos, políticas o incidentes cargados. No incluye el XML ni el reporte trimestral Tipo 957 ni envía información al BCU; estos requieren un desarrollo y contraste normativo específicos.
