# Exportadores URCDP

## Alcance

Implementa RF-11 de la consigna: registro de bases de datos personales, informe de medidas de seguridad y notificación de brechas. Son borradores para revisión basados en información declarada de la organización; no se presentan automáticamente ante la autoridad y no constituyen formularios oficiales validados, certificados ni constancias de trámite.

Fuentes consultadas el 2026-10-08:
- [Inscripción de bases personales](https://www.gub.uy/tramites/inscripcion-bases-datos-personales).
- [Decreto 664/008, artículo 4](https://www.impo.com.uy/bases/decretos/664-2008/4).
- [Guía URCDP sobre vulneraciones y anexo de datos](https://www.gub.uy/unidad-reguladora-control-datos-personales/comunicacion/publicaciones/guia-para-gestion-documentacion-comunicacion-vulneraciones-seguridad).
- [Decreto 64/020, artículo 4](https://www.impo.com.uy/bases/decretos/64-2020/4).

## Uso

En Exportaciones, Administrador y RSI tienen tres tarjetas URCDP. Registro y medidas comparten la ficha de base personal, con nombre, responsables, ubicación, finalidad, categorías, cantidades, origen, conservación, cesiones, transferencias, ejercicio de derechos, descripción técnica y medidas con referencias de evidencia y mejoras pendientes. Una base no se considera inscripta por existir en RSI; el estado y número de inscripción son declarados.

La ficha de brecha vincula una base y un incidente de la misma organización. Guarda comunicante, cronología, afectación, medidas, comunicación a titulares, presentación y resolución. Permite comunicación inicial e informe posterior. El reporte incorpora descripción, activo, estado, acciones, referencias de evidencia y lecciones del incidente. No se exportan datos identificatorios de los afectados ni adjuntos automáticamente.

Se pueden guardar borradores incompletos. El informe identifica campos pendientes. El plazo orientativo de 72 horas se calcula desde la fecha de conocimiento declarada por el responsable, sin inferirla de la creación del registro. Si falta esa fecha no se calcula el vencimiento. Las fechas se almacenan y exportan en UTC; la interfaz admite hora local. La presentación exige una referencia de constancia y, si supera el plazo conocido, motivos de demora. Registrar la presentación solo recoge la declaración del usuario, no verifica el envío externo.

Descargas: Markdown, PDF mediante impresión del navegador y CSV de las tablas. El CSV no representa el documento narrativo completo. PDF requiere seleccionar la opción en el diálogo de impresión.

## Datos y seguridad

Tablas `bases_personales` y `notificaciones_urcdp`, con relaciones restringidas, revisión incremental y fecha de actualización. Migración: `20261008210000_documentos_urcdp`; aplicar `prisma migrate deploy` y regenerar el cliente antes de arrancar.

Las rutas bajo `/api/v1/exportaciones/organizaciones/{id}/urcdp` requieren sesión y rol ADMINISTRADOR o RSI:
- GET raíz: fichas, incidentes y definición de campos.
- POST `bases-personales`, PUT `bases-personales/{fichaId}`.
- POST `notificaciones-urcdp`, PUT `notificaciones-urcdp/{fichaId}`.
- GET `registro-urcdp`, `medidas-urcdp`, `brecha-urcdp`, con `fichaId`; brecha admite `etapa=inicial|final`.

Cada acceso a una ficha y cada asociación se valida contra la organización de la ruta. La autenticación y protección de escrituras por origen reutilizan los controles globales. Audita creación, actualización y exportación dentro de la transacción existente. Los eventos excluyen el contenido JSON y el nombre de la base; conservan IDs, revisión y fecha. El contenido se escapa para las tablas. Rechaza campos desconocidos, texto excesivo, correos inválidos, cantidades no enteras y fechas inválidas/futuras o inconsistentes.

No se eliminan fichas desde esta interfaz. Los documentos usan los datos actuales, con su revisión, y no mantienen instantáneas de cada archivo exportado. Las medidas son declaradas y deben ser verificadas por la organización; ninguna funcionalidad de RSI se interpreta como evidencia automática.

## Verificación

`npm test -- --runInBand src/exportaciones/urcdp.spec.ts` comprueba borradores, validación, asociaciones entre organizaciones, tres documentos, plazos, escape, rutas HTTP permitidas/denegadas y auditoría sin contenido sensible. Se comprobó además creación y actualización contra PostgreSQL y generación de los tres documentos dentro de una transacción revertida. La revisión en navegador utilizó datos simulados en una API temporal separada del backend real.
