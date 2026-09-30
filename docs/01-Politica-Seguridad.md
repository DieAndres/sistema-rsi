# Política de Seguridad de la Información del Sistema RSI

## Encabezado de mapeo normativo

La tabla adapta las referencias de la plantilla al **Sistema RSI**, que es el objeto de esta política. «Aporte» indica qué establece este documento; no certifica implementación ni cumplimiento.

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| **MCU 5.0 (función)** | Gobernar (GV) | Define responsables, principios y reglas de seguridad para el desarrollo y operación del RSI. |
| **MCU 5.0 (categoría)** | GV.PO — Política | Se relaciona con GV.PO-01 (establecer, comunicar y aplicar la política) y GV.PO-02 (revisarla y actualizarla). Este borrador cubre la redacción y prevé la revisión; faltan aprobación y comunicación. |
| **Perfil comunitario MCU 5.0** | Avanzado, objetivo de la consigna | Sirve para evaluar los controles del RSI con evidencias y prioridades de ese perfil. El perfil describe necesidades de organizaciones; no se asigna automáticamente al software ni se declara alcanzado. |
| **COBIT 2019** | APO13 — Gestionar seguridad; APO01 — Gestionar el marco de gestión de TI | La política define criterios de seguridad y responsabilidades para el RSI. Se usa como referencia de gestión, sin atribuir al proyecto un nivel de capacidad COBIT. |
| **ISO/IEC 27001:2022** | Anexo A, control 5.1 — Políticas de seguridad de la información | Este documento establece la política general del RSI y remite a documentos específicos de accesos, incidentes y continuidad. Debe aprobarse y comunicarse antes de presentarlo como control aplicado. |
| **ISO/IEC 27002:2022** | Control 5.1 — Políticas de seguridad de la información | Orienta la redacción, difusión y revisión de esta política y de reglas específicas; se usa como guía, no como declaración de conformidad. |
| **BCU — Guía de estándares mínimos de gestión** | PS.1 — Adoptar una Política de Seguridad de la Información | Se toma como referencia para documentar alcance, respaldo de la dirección, responsables y revisión. Es una guía para instituciones financieras; la política del RSI no supone que el proyecto sea una entidad supervisada. |
| **Ley 18.331 / URCDP** | Art. 10 — Principio de seguridad de los datos | Las reglas de acceso, integridad, respaldos y minimización buscan proteger los datos personales que procese el RSI. La responsabilidad legal y las medidas efectivas dependen del despliegue y de su operador. |
| **Documento del proyecto** | `docs/01-Politica-Seguridad.md` | Borrador de la política del Sistema RSI, versión 1.2; aprobación formal pendiente. |

Las referencias del MCU, BCU, ISO y la ley se verificaron en las fuentes oficiales indicadas al final. La instrucción de `plantilla/README.md` de conservar el encabezado se aplicó a su **función de mapeo**; el contenido de ejemplo se corrigió para este sistema.

## Control del documento

| Campo | Valor |
|---|---|
| Nombre del documento | Política de Seguridad de la Información del Sistema RSI |
| Código | SI-POL-01 |
| Versión | 1.2 — propuesta |
| Fecha de elaboración | 30/09/2026 |
| Fecha de aprobación | Pendiente |
| Aprobado por | Pendiente de designación y aprobación |
| Responsable de mantenimiento | Responsable de Seguridad de la Información del Sistema RSI |
| Autor | Equipo del proyecto |
| Próxima revisión | Un año después de la aprobación o ante cambios significativos |

### Historial de versiones

| Versión | Fecha | Autor | Descripción |
|---|---|---|---|
| 1.0 | 24/09/2026 | Equipo del proyecto | Borrador inicial. |
| 1.1 | 30/09/2026 | Equipo del proyecto | Reescritura centrada en el Sistema RSI y adaptación de la plantilla ISACA. |
| 1.2 | 30/09/2026 | Equipo del proyecto | Mapeo normativo verificado y adaptado al RSI; corrección de referencias MCU, BCU y Ley 18.331. |

## 1. Objetivo

Establecer las directrices para proteger la confidencialidad, integridad y disponibilidad del **Sistema de Gestión Integrada para el RSI**, sus componentes y la información que procesa. La política guía su desarrollo, administración, uso, monitoreo y recuperación.

Esta política expresa reglas y responsabilidades. Su redacción no demuestra que los controles estén implementados ni que hayan sido probados; eso debe acreditarse con evidencias.

## 2. Alcance

Aplica al frontend web, la API backend, la base de datos PostgreSQL, los servicios y configuraciones necesarios para ejecutar el Sistema RSI, sus cuentas y sesiones, registros de auditoría, respaldos, documentos exportados y entornos donde se desarrolle, pruebe u opere. También aplica a quienes desarrollan, administran, prueban o utilizan el sistema.

Los registros de organizaciones, trabajadores, activos, riesgos, vulnerabilidades, incidentes y cumplimiento son **datos protegidos por esta política**. No constituyen el objeto de esta política: aquí se evalúa la seguridad del propio Sistema RSI, no la seguridad de cada organización que registre datos en él.

## 3. Marco de referencia

- **MCU 5.0:** marco de referencia del curso para gobernar, identificar, proteger, detectar, responder y recuperar. El perfil Avanzado es una meta de evaluación, no un estado alcanzado por este documento.
- **ISO/IEC 27001:2022 e ISO/IEC 27002:** referencias para políticas, activos, accesos, registro de eventos y respuesta a incidentes; no se declara certificación.
- **COBIT 2019:** referencia para responsabilidades de gobierno y gestión de seguridad.
- **BCU y Ley 18.331/URCDP:** referencias consideradas por la tarea para la protección de la información y las exportaciones. Su aplicabilidad jurídica depende del contexto real donde se despliegue el sistema.

## 4. Principios de seguridad

| Principio | Regla para el Sistema RSI |
|---|---|
| Confidencialidad | Solo las personas autorizadas pueden consultar, modificar o exportar información según su rol y ámbito. |
| Integridad | Los cambios deben validarse y ser trazables; se impiden alteraciones no autorizadas de registros y exportaciones. |
| Disponibilidad | Se deben mantener respaldos y procedimientos de recuperación probados según los objetivos acordados. |
| Mínimo privilegio | Cada cuenta recibe únicamente los permisos necesarios y se revisa cuando cambia su función. |
| Defensa en profundidad | Se combinan controles de identidad, aplicación, datos, infraestructura y monitoreo según los riesgos. |
| Trazabilidad | Los accesos y cambios relevantes deben asociarse a un actor, fecha y resultado verificables. |
| Minimización | Logs, evidencias y exportaciones no deben divulgar secretos ni datos personales innecesarios. |

## 5. Directrices de seguridad

La jerarquía documental es **política general → reglas específicas → procedimientos y planes → registros y evidencias**. Los procedimientos definen los pasos operativos; esta política fija los criterios que deben cumplir.

| Área | Directriz | Documento relacionado |
|---|---|---|
| Accesos y credenciales | Autenticar usuarios, aplicar autorización por rol y ámbito, MFA para roles administrativos y protección de sesiones; custodiar secretos fuera del repositorio. | `docs/09-gestion-accesos.md`; prueba manual de Windows Hello pendiente. |
| Desarrollo y configuración | Validar entradas, proteger los endpoints y exportadores, revisar dependencias y separar secretos de la configuración versionada. | `docs/00-arquitectura.md`. |
| Activos y riesgos del sistema | Inventariar componentes del RSI, asignar responsables, analizar amenazas y registrar tratamientos y riesgo residual. | `02-registro-activos` y `03-analisis-riesgos` — pendientes en `docs/`. |
| Vulnerabilidades | Registrar, priorizar, remediar y comprobar los hallazgos técnicos del sistema. | `docs/10-Gestion-Vulnerabilidades.md`. |
| Incidentes | Reportar, registrar, contener, recuperar y documentar lecciones aprendidas de incidentes que afecten al RSI. | `docs/04-Gestion-Incidentes.md`. |
| Auditoría y monitoreo | Registrar accesos y cambios relevantes, proteger los logs y revisar los eventos de seguridad. | `07-monitoreo-logs` — pendiente en `docs/`. |
| Continuidad | Respaldar datos y configuración, definir tiempos de recuperación y probar restauraciones. | `docs/06-Plan-Continuidad.md`. |
| Exportaciones | Autorizar la generación, validar el contenido y evitar que datos de distintas organizaciones se mezclen. | `docs/exportaciones/`. |

Las tecnologías citadas en la arquitectura son componentes del proyecto; esta política no afirma que cada control esté terminado. La evidencia de implementación y prueba se registra por separado.

## 6. Roles y responsabilidades

| Rol | Responsabilidad respecto del Sistema RSI |
|---|---|
| Autoridad que aprueba la política | Aprobar la política, asignar recursos y aceptar formalmente los riesgos que correspondan. Su designación está pendiente. |
| RSI | Coordinar la gestión de seguridad del sistema, revisar riesgos, incidentes y evidencias, y proponer mejoras. |
| Administrador | Mantener configuración, cuentas, respaldos y operación técnica dentro de sus permisos. |
| Dueño de unidad | Mantener los registros de su ámbito y reportar errores o incidentes detectados. |
| Usuario lector | Consultar solo la información autorizada y reportar anomalías; no modificar registros. |
| Responsable de revisión | Contrastar las declaraciones de seguridad con pruebas y evidencias sin alterar los registros examinados. |

Los roles de acceso implementados en la aplicación deben corresponder a permisos verificables. La aprobación de esta política es una responsabilidad formal distinta de tener el rol técnico «Administrador».

## 7. Concientización, reporte y cumplimiento

Toda persona con acceso debe conocer las reglas de uso, protección de credenciales y reporte de incidentes. Quien detecte una anomalía debe comunicarla al RSI o responsable designado y dejar constancia conforme a `docs/04-Gestion-Incidentes.md`.

La frecuencia de capacitación, el canal institucional y las consecuencias por incumplimiento requieren una decisión de operación que aún no está documentada. Las desviaciones detectadas se registran y se tratan como incidente, vulnerabilidad, riesgo o plan de acción según corresponda.

## 8. Vigencia y revisión

Esta versión es una **propuesta**. Entra en vigencia tras la aprobación formal, con fecha y autoridad registradas en el control del documento. Se revisa como mínimo una vez al año o antes ante cambios relevantes en arquitectura, riesgos, operación o normativa aplicable.

Antes de entregar una versión como «aprobada», deben constar la aprobación real y las evidencias de los controles que se declaren implementados.

## Fuentes del mapeo

- [AGESIC — Marco de Ciberseguridad 5.0](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/marco-ciberseguridad-50) y [texto del marco, categoría GV.PO](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/book/9330/download).
- [ISACA — objetivos COBIT 2019 APO13 y APO01](https://www.isaca.org/resources/news-and-trends/newsletters/atisaca/2021/volume-19/achieving-application-rationalization-using-cobit-2019).
- [ISO/IEC JTC 1/SC 27 — referencia al control 5.1 de ISO/IEC 27002:2022](https://committee.iso.org/files/live/sites/jtc1sc27/files/resources/Journal%202025.pdf) y [familia ISO/IEC 27000](https://www.iso.org/standard/iso-iec-27000-family).
- [BCU — Guía de los estándares mínimos de gestión relativos a seguridad de la información, PS.1](https://www.bcu.gub.uy/Servicios-Financieros-SSF/Documents/guia%20emg%20seguridad%20de%20la%20informacion.pdf).
- [IMPO — Ley 18.331, artículo 10](https://www.impo.com.uy/bases/leyes/18331-2008/10).
