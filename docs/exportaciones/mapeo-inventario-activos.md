# Mapeo del inventario de activos (SI-ACT-02)

Fuente: `plantilla/isaca/02-registro-activos.md`, sección 4. El archivo descargado es un **borrador**, no un documento de cumplimiento aprobado.

| Columna de la plantilla | Origen | Transformación o validación |
|---|---|---|
| ID | `Activo.id` | UUID del registro, sin renumerar. |
| Nombre del activo | `Activo.nombre` | Texto escapado para Markdown. |
| Tipo | `Activo.tipo` | Se conserva tal como está registrado; revisar que corresponda a HW, SW, Dato o Servicio. |
| Ubicación | Sin campo en la base | Vacío; completar cuando exista un origen verificable. La unidad organizativa no es una ubicación física. |
| Dueño | `Activo.responsable.nombre` | Vacío si no se asignó responsable; revisar antes de aprobar. |
| Clasificación | `Activo.clasificacion` | Vacío si falta; revisar antes de aprobar. |
| Crítico (S/N) | `Activo.criticidad` | `ALTA` o `CRITICA` → `S`; otras → `N`. Regla de este exportador, sujeta a revisión. |
| Software/versión | Sin campo en la base | Vacío; no se infiere del nombre o descripción. |

La consulta se limita a los activos de la organización indicada y se ordena por nombre e ID. Si la organización no existe, responde 404. La plantilla también pide una matriz proceso-activo con RTO: no se genera porque el modelo actual no contiene esas relaciones ni el RTO. Antes de usar el documento como evidencia, revisar cobertura de infraestructura, responsable, clasificación y campos vacíos contra el despliegue real.

Ruta: `GET /api/v1/exportaciones/organizaciones/{id}/inventario-activos`. Descarga Markdown `inventario-activos-borrador.md`. Esta ruta todavía debe integrarse con autorización y auditoría antes de usar datos no sintéticos.
