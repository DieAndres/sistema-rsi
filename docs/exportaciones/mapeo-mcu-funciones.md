# Reporte MCU 5.0 por funciones

Fuente: `plantilla/mcu5/excel/01-controles-mcu5-perfil-avanzado.xlsx`, planilla de apoyo del curso. No sustituye el catálogo oficial de AGESIC.

El catálogo conserva sus 47 resultados/controles: GV (8), ID (8), PR (12), DE (8), RS (6) y RC (5). Los códigos secuenciales son identificadores internos. El perfil objetivo de la tarea es Avanzado.

| Campo de la planilla | Fuente del reporte | Validación |
|---|---|---|
| Función | Catálogo de apoyo del curso | Agrupación GV/ID/PR/DE/RS/RC. |
| Resultado/control esperado | Catálogo | Solo lectura. |
| Aplica (Sí/No/N.A.) | `EvaluacionMcu.respuesta` | Sin respuesta = pendiente. |
| Justificación si N.A. | `EvaluacionMcu.justificacion` | Obligatoria para N.A.; registrar no implica aceptación formal. |
| Evidencia necesaria | Sugerencia de la planilla en la ficha; `EvaluacionMcu.evidencia` en el reporte | Sí requiere referencia registrada; el sistema no verifica el contenido de la evidencia. |
| Cómo se demuestra | Sugerencia de la planilla en la ficha; `EvaluacionMcu.demostracion` en el reporte | Sí requiere procedimiento de demostración. |

Las sugerencias no se copian automáticamente como evaluaciones. Se guardan respuestas por organización y control en `evaluaciones_mcu`. No se calcula madurez ni cumplimiento a partir de cantidades de registros.

En **Exportaciones → MCU 5.0 → Reporte por funciones — perfil Avanzado**, el botón **Completar evaluación MCU** permite editar los controles por función. Al guardar se actualiza el reporte. Las descargas usan Markdown, CSV y PDF mediante impresión del navegador; no se genera todavía el Excel original rellenado.

Rutas: `GET mcu-controles`, `PUT mcu-controles/{controlId}` y `GET mcu-funciones`, bajo `/api/v1/exportaciones/organizaciones/{id}/`. La escritura se limita a ADMINISTRADOR/RSI y se registra en auditoría; lectura y exportación respetan el ámbito organizativo.
