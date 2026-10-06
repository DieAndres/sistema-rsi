# COBIT 2019 — Alineación y evaluación de procesos

Decisión del proyecto: plantilla propia para el requisito de la consigna de alinear procesos con EDM/APO/BAI/DSS/MEA y registrar indicadores. No hay una planilla específica COBIT entregada en `plantilla/`.

| Campo | Origen | Validación / transformación |
|---|---|---|
| Área COBIT | Combo manual fijo: EDM/APO/BAI/DSS/MEA | Selección explícita; no se seleccionan objetivos numerados |
| Proceso | `procesos` | Debe pertenecer a la organización seleccionada |
| Responsable | Responsable del proceso | Pendiente si no está asignado |
| Evaluación, evidencia, indicador y resultado | `evaluaciones_cobit` | Texto registrado por el RSI; campos vacíos pendientes |

La relación es única por organización, proceso y área. Elegir de nuevo la misma relación permite editarla; un proceso admite varias áreas. Guardado permitido para RSI y administrador; lectura y exportación utilizan la autorización existente. Se auditan guardado y exportación.

## Acceso y generación del informe

Desde **Exportaciones → COBIT 2019 → Alineación y evaluación de procesos** se consulta el informe de la organización seleccionada. **Completar evaluación COBIT**, junto a las descargas, abre el formulario. Primero se selecciona el proceso y después el área del combo fijo; no se asigna automáticamente un área a partir del nombre del proceso.

Guardar actualiza o crea la relación seleccionada y vuelve a generar la vista del informe con los datos persistidos. El responsable mostrado se obtiene del proceso y no se duplica en la evaluación. Las descargas disponibles son Markdown, CSV e impresión del navegador para guardar como PDF.

## Persistencia y API

La tabla `evaluaciones_cobit` contiene `id`, `organizacionId`, `procesoId`, `controlId`, `evaluacion`, `evidencia` e `indicador`. La combinación de organización, proceso y área es única. Los campos de texto admiten hasta 10000 caracteres.

- `GET /api/v1/exportaciones/organizaciones/{id}/cobit-procesos`: consulta procesos, áreas y evaluaciones de la organización.
- `PUT /api/v1/exportaciones/organizaciones/{id}/cobit-procesos/{controlId}`: guarda la relación; `controlId` debe ser EDM, APO, BAI, DSS o MEA y el cuerpo incluye el proceso y los textos de evaluación.
- `GET /api/v1/exportaciones/organizaciones/{id}/cobit`: genera el informe Markdown.

La evaluación es descriptiva. No se calcula un nivel formal de capacidad o madurez COBIT ni se infiere cumplimiento. El alcance formal queda pendiente. Los procesos sin áreas vinculadas se muestran por separado.

Referencia del marco: [ISACA — COBIT 2019 Framework: Governance and Management Objectives](https://www.isaca.org/store2/product/CB19FGM). La aplicación no reproduce las prácticas ni constituye una plantilla oficial de ISACA.

Comprobación: abrir Exportaciones → COBIT 2019 → Alineación y evaluación de procesos → Completar evaluación COBIT. Elegir proceso y área, guardar y comprobar el informe. La prueba `cobit.spec.ts` verifica persistencia, datos exportados y rechazo de procesos de otra organización.

El campo interno `controlId` guarda la sigla del área. Los registros anteriores con códigos numerados se conservan y se identifican como registros anteriores en el informe; no se fusionan ni se sobrescriben automáticamente.
