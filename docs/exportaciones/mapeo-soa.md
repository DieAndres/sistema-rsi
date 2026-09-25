# Mapeo previo del exportador SoA

## Origen de los datos

Los registros utilizados para las demostraciones corresponden a escenarios simulados del proyecto. Se usan para probar los flujos y generar los informes; no representan datos de una organización real.

### Escenario simulado usado en DEMO

Se supone una organización de 30 personas y cuatro unidades, con una sede de acceso controlado, vigilancia de espacios comunes y un espacio técnico restringido; trabajo híbrido; red cableada y Wi-Fi; dispositivos de usuario y medios de almacenamiento; servicios de correo, almacenamiento y gestión en la nube; tratamiento de datos personales del personal; y proveedores externos de soporte de TI y alojamiento. Se supone que realiza proyectos de cambio tecnológico y pruebas periódicas de auditoría, pero que no desarrolla ni contrata desarrollo de software. Estos supuestos justifican la aplicabilidad preliminar; no demuestran que los controles estén implementados.

La estructura del documento proviene de `plantilla/isaca/11-soa-plan-tratamiento.md`. Para el catálogo se usará **ISO/IEC 27001:2022, Anexo A: 93 controles**. La plantilla indica 79 y sus subtotales (37 + 4 + 5 + 33) no corresponden a la edición 2022. Se conservan sus secciones, pero se corregirán los totales de la sección 2 a **37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos**. Este archivo es un mapeo de implementación, no una SoA generada ni una declaración de cumplimiento.

Fuentes de verificación: [ISO/IEC SC 27, relación entre ISO/IEC 27001 e ISO/IEC 27002](https://committee.iso.org/files/live/sites/jtc1sc27/files/resources/Journal%202025.pdf) y [ISO/IEC SC 27, distribución de los 93 controles](https://committee.iso.org/files/live/sites/jtc1sc27/files/resources/ISO-IECJTC1-SC27_N22394_SC%2027%20Journal%20Volume%202%2C%20Issue%202%20-%20Special%20issue%20on%20ISO-IEC%2027002.pdf). Estos artículos verifican cantidad y categorías; no sustituyen el texto completo del Anexo A.

| Campo de la plantilla | Origen previsto | Validación pendiente |
|---|---|---|
| Organización y alcance de evaluación | `Organizacion.nombre` y `Organizacion.alcanceSgsi` | El alcance se define para la organización; no se infiere de la arquitectura del software RSI. |
| ID ISO y tema del control | Catálogo fijo de 93 ID y denominaciones orientativas en `SoaService` | Las denominaciones son propias y no sustituyen los títulos ni el texto oficial de ISO/IEC 27001:2022. No se duplican por organización en la base. |
| ¿Aplica? | `EvaluacionSoa.aplica` por organización y control | `null` significa pendiente; verdadero/falso exige justificación. No inferir aplicabilidad a partir de la existencia de un módulo. |
| Justificación | `EvaluacionSoa.justificacion` | Obligatoria para controles evaluados, incluso cuando no aplican. |
| Insumos organizacionales | Registros de activos, riesgos, vulnerabilidades, incidentes, políticas, procesos, procedimientos, planes y evidencias asociados a la organización | El reporte presenta cantidades disponibles. Hoy no existe una relación directa entre cada control y esos registros: se describen en `EvaluacionSoa.insumos` y se puede asociar una evidencia o un plan. La cantidad no demuestra implementación. |
| Plan de tratamiento / Estado | `EvaluacionSoa.estado` o plan vinculado de la misma organización | El estado `IMPLEMENTADO` requiere evidencia vinculada. La revisión de esa evidencia sigue siendo humana. |
| Resumen por categoría | Evaluaciones de controles A.5–A.8 | Usar 37, 8, 14 y 34; aplicables y N/A se calculan de los registros evaluados. |
| Brecha MCU 5.0 | `BrechaMcu` por organización y función | Los datos se cargan manualmente; no se infiere madurez de la existencia de módulos. |
| Plan de tratamiento | `Plan` vinculado desde `EvaluacionSoa.planId` | Fecha límite y responsable salen del plan; el puntaje mostrado se deriva de probabilidad × impacto del riesgo asociado. |

La API lista los 93 ID con su tema orientativo, guarda evaluaciones y brechas MCU por organización y descarga el SoA. El informe identifica a la organización y resume sus registros disponibles como fuentes para evaluar los controles. No evalúa la aplicación RSI ni convierte automáticamente esos registros en decisiones de aplicabilidad o cumplimiento. El alcance se registra en `Organizacion.alcanceSgsi`; la delimitación debe describir a la organización y no a la herramienta. El campo `EvaluacionSoa.titulo` se conserva por compatibilidad con datos previos, pero el reporte usa el catálogo fijo. En el estado local de DEMO, los 93 controles tienen aplicabilidad y justificación simuladas: 84 aplicables y 9 no aplicables. Se asociaron 13 referencias sintéticas a los aplicables; no tienen archivos adjuntos y no prueban implementación. Las seis funciones MCU tienen datos ilustrativos y hay tres planes de tratamiento vinculados, todos pendientes.

La plantilla de origen incluye campos titulados “Sistema” y “Componentes en alcance”. Para evitar confundir la herramienta RSI con la organización evaluada, la exportación adaptada presenta la organización y sus registros como base de revisión; el alcance formal registrado corresponde al escenario de la organización, no a la herramienta RSI. Las denominaciones de los controles son orientativas; para usar títulos oficiales deben contrastarse con una copia autorizada de la norma. Como referencia de temas se consultó el [índice público de ISMS Copilot](https://www.ismscopilot.com/resources/iso-27001-annex-a-finder), que aclara que sus resúmenes no son títulos oficiales.

Las evaluaciones, referencias y supuestos de DEMO se guardan en la base PostgreSQL local para la demostración y no se suben a Git. Las referencias no adjuntan documentos ni son evidencia verificable. El catálogo mantiene temas orientativos; para una entrega que requiera títulos oficiales del Anexo A deben cotejarse con una copia autorizada de ISO/IEC 27001:2022.
