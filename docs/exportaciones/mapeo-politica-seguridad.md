# Mapeo de política de seguridad

Fuente: `plantilla/isaca/01-politica-seguridad.md` (SI-POL-01). Acceso: **Exportaciones → ISO 27001 → Política de seguridad**.

| Campo de salida | Dato del sistema | Transformación / validación |
|---|---|---|
| Organización | `Organizacion.nombre` | La organización debe existir. |
| Título, ID, versión y estado | `Politica` | Solo registros de la organización seleccionada; orden por título e ID. |
| Contenido registrado | `Politica.descripcion` | Conserva saltos de línea y escapa HTML y separadores de tabla. No distribuye el texto automáticamente entre apartados. |
| Responsable | `Politica.responsable.nombre` | Pendiente si no está asignado; no se interpreta como autor o aprobador. |
| Próxima revisión | `Politica.fechaRevision` | Fecha UTC; pendiente si falta. |
| Objetivo, alcance, marco, principios, estructura, roles, concientización y vigencia | Sin campos específicos | Se enumeran para revisión contra el contenido registrado; no se inventan. |
| Aprobación, firmas e historial | Sin campos específicos | Pendientes; el estado del registro no acredita aprobación formal. |

`GET /api/v1/exportaciones/organizaciones/{id}/politica-seguridad` genera un borrador Markdown con todas las políticas registradas de esa organización. La pantalla permite descargar Markdown, CSV de las tablas o guardar como PDF desde la impresión del navegador. Reutiliza autorización por organización y auditoría de exportaciones. Este borrador no completa automáticamente la plantilla ni declara cumplimiento ISO.
