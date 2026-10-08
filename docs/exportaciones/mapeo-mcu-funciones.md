# Reporte MCU 5.0 por funciones

## Fuente oficial y criterio

Se utilizan las planillas de perfiles comunitarios publicadas por [AGESIC, MCU 5.0](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/marco-ciberseguridad-50), descargadas el 2026-10-08:

| Perfil | Archivo oficial | Controles únicos de la línea base |
|---|---|---|
| Básico | Planilla MCU 5.0 Básico.xlsx | 165 |
| Estándar | Planilla MCU 5.0 Estándar.xlsx | 234 |
| Avanzado | Planilla MCU 5.0 Avanzado.xlsx | 309 |

El criterio de inclusión es la columna **Línea Base = Si** de la hoja **Cumplimiento**. Estos números representan controles de la línea base, no el total del marco ni subcategorías. Se conservan los identificadores y textos oficiales. Las funciones asociadas se extraen de los controles de niveles 1 a 4 de **Madurez Subcategoría**. Un control puede aparecer en varias funciones; las cantidades por función no deben sumarse para obtener el total único.

`backend/src/exportaciones/controles-mcu-agesic.ts` contiene el catálogo y los SHA-256 de las tres fuentes. `backend/scripts/extraer-mcu-agesic.py` permite reproducir la extracción con Python y openpyxl, pasando la carpeta con las planillas originales y el archivo de salida. No modifica los XLSX. La aplicación usa el catálogo local, sin descargar archivos durante las consultas.

## Perfil y evaluaciones

En **Organizaciones → Nueva / Editar**, `perfilMcu` selecciona Básico, Estándar o Avanzado. La API y la base de datos rechazan otros valores. El valor predeterminado es Avanzado; la entrega del curso continúa exigiendo ese perfil.

La selección filtra los controles tanto en `GET mcu-controles` como en `GET mcu-funciones`. `PUT mcu-controles/{controlId}` rechaza controles ajenos al perfil actual. Las rutas continúan bajo `/api/v1/exportaciones/organizaciones/{id}/`; conservan su autorización, ámbito organizativo y auditoría.

Las respuestas se almacenan por organización e identificador oficial. Un mismo control comparte su respuesta entre funciones y perfiles. Cambiar el perfil no borra evaluaciones: las de controles fuera de la nueva línea base quedan almacenadas y vuelven a aparecer al elegir un perfil que las incluya. No se calcula cumplimiento ni madurez automáticamente.

Los 47 controles internos del catálogo de apoyo anterior no se equiparan a los oficiales. Sus evaluaciones permanecen almacenadas y aparecen en un anexo **Antecedentes del catálogo de apoyo del curso**, separado de los resultados oficiales. No se cuentan en el total ni se trasladan automáticamente.

## Reporte y validación

El informe declara organización, perfil, cantidad única, fuente y criterio. Se agrupa por GV/ID/PR/DE/RS/RC. Una respuesta vacía es Pendiente; N.A. requiere justificación; Sí requiere evidencia y demostración. Las sugerencias genéricas orientan al usuario, no demuestran cumplimiento. Las brechas por función de la SoA mantienen sus propios registros.

Las descargas siguen usando Markdown, CSV y PDF mediante impresión. No se genera el XLSX oficial rellenado.

Pruebas: `npm test -- --runInBand src/exportaciones/mcu.spec.ts src/organizacion/perfil-mcu.spec.ts` desde backend. Verifican cantidades oficiales, IDs únicos, cambio de perfil, conservación de respuestas, rechazo de controles fuera del perfil, conservación de antecedentes y autorización organizativa.
