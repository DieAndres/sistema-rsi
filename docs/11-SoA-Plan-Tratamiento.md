# Declaración de Aplicabilidad y Plan de Tratamiento del Sistema RSI

Esta declaración evalúa los controles para **desarrollar y operar la propia plataforma RSI** en su versión local y preparar su publicación. Incluye aplicación, identidad, PostgreSQL, datos, auditoría, código, configuración, anfitrión y equipo operador. Las organizaciones y evaluaciones SoA guardadas por usuarios son datos de negocio y no se utilizan como evidencia de cumplimiento de la plataforma. No se copian las evaluaciones del escenario demo.

## Encabezado de mapeo normativo

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| MCU 5.0 | Gobernar y Proteger; seis funciones para análisis de brechas | Perfil objetivo Avanzado de la consigna; adopción pendiente de evaluación por control. |
| COBIT 2019 | EDM01, EDM03, APO13 y MEA01 | Gobierno, riesgo, seguridad y revisión. |
| ISO/IEC 27001:2022 | Anexo A y cláusula 6.1.3 | Selección de controles y justificación de aplicabilidad. |
| ISO/IEC 27002:2022 | Guía de controles | Orientación; nombres temáticos propios del catálogo del proyecto. |
| BCU | Requerimientos de seguridad de la consigna | Referencia; no se presume entidad supervisada ni reporte regulatorio presentado. |
| Ley 18.331 | Art. 10 | Protección de datos personales tratados por la plataforma. |

La plantilla menciona 79 controles y atribuye criptografía a A.8.1. Se corrige a **93 controles**, distribuidos en 37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos; A.8.1 trata dispositivos de usuario y A.8.24 criptografía. Se utiliza el catálogo del backend en `backend/src/exportaciones/soa.service.ts`, sin modificarlo ni reproducir textos normativos. [Referencia ISO/IEC 27002:2022](https://www.iso.org/standard/75652.html).

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-SOA-11 |
| Versión | 1.0 — propuesta |
| Metodología | Revisión de 93 controles según riesgo, requisitos y alcance operativo del RSI |
| Fecha | 03/10/2026 |
| Responsable | RSI, autoridad operativa y custodios técnicos por designar |
| Estado | Aplicabilidad preliminar completa; aprobación y comprobaciones operativas pendientes |
| Aprobación | Pendiente, incluidas las dos exclusiones propuestas |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 03/10/2026 | Equipo del proyecto | Evaluación inicial de los 93 controles para el propio RSI, brechas y tratamientos vinculados al análisis de riesgos. |

## 1. Alcance de la declaración

La aplicabilidad se decide por riesgos y necesidades del operador, no por si la aplicación tiene una pantalla con ese nombre. Los controles organizacionales y físicos pueden aplicar aunque no se implementen como software. Cuando falta evidencia se marca pendiente o parcial, sin excluirlo por esa razón. Sí significa aplicable, no implementado. N/A expresa exclusión propuesta para el alcance actual, pendiente de aceptación y revisión si cambia el entorno.

Las evidencias de código y pruebas históricas acreditan mecanismos concretos, no ejecución sostenida de controles completos. Los tratamientos S01 a S12 corresponden a PT01 a PT12 del análisis; S13 a S15 cubren gobierno, equipo/entorno y ciclo de pruebas. Los documentos son propuestas donde su aprobación o ejercicio siguen pendientes.

## 2. Resumen de estado

| Categoría | Total controles | Aplicables | N/A con justificación propuesta |
|---|---:|---:|---:|
| A.5 Organizacionales | 37 | 36 | 1 |
| A.6 Personas | 8 | 8 | 0 |
| A.7 Físicos | 14 | 14 | 0 |
| A.8 Tecnológicos | 34 | 33 | 1 |
| **Total** | **93** | **91** | **2** |

No se declaran los 91 controles como cumplidos. A.5.23 y A.8.30 se excluyen preliminarmente por ausencia de nube y desarrollo tercerizado acreditados en el alcance local. La selección de un respaldo en nube o una contratación obliga a revisar esas decisiones.

## 3. Declaración de aplicabilidad

| ID ISO 27001 | Tema del control | ¿Aplica? | Justificación | Insumos de la solución | Plan de tratamiento / Estado |
|---|---|---|---|---|---|
| A.5.1 | Políticas de seguridad de la información | Sí | El operador necesita reglas para proteger la plataforma y sus datos. | 01-Politica-Seguridad.md | Parcial: texto propuesto; S13 aprobar y comunicar. |
| A.5.2 | Responsabilidades de seguridad | Sí | Los controles requieren custodios y una autoridad que acepte riesgos. | Roles operativos en docs/ | S13 asignar personas; no confundir rol de app con autoridad. |
| A.5.3 | Separación de funciones | Sí | Desarrollo, administración y aprobación pueden concentrarse en el equipo. | Roles y guards de backend | Parcial técnico; S13 revisión de cambios por otra persona. |
| A.5.4 | Responsabilidad de la dirección | Sí | La dirección del proyecto debe autorizar recursos y uso de datos. | Control de aprobación de políticas | S13 registrar decisiones y recursos. |
| A.5.5 | Contacto con autoridades | Sí | Una vulneración puede requerir comunicación por el operador. | 12-Notificacion-Incidentes.md | S13 identificar responsables y canales externos. |
| A.5.6 | Contacto con comunidades especializadas | Sí | El equipo necesita fuentes externas para avisos de seguridad. | 10-Gestion-Vulnerabilidades.md | S07 definir fuentes y revisión de avisos. |
| A.5.7 | Información sobre amenazas | Sí | Dependencias y autenticación pueden sufrir amenazas nuevas. | R07 y procedimiento de vulnerabilidades | S07 revisar avisos y ajustar riesgos. |
| A.5.8 | Seguridad en proyectos | Sí | El desarrollo del RSI debe incorporar requisitos de protección. | Consigna y arquitectura | Parcial documental; S15 verificar seguridad en entregas. |
| A.5.9 | Inventario de información y activos | Sí | Los componentes propios sostienen la operación. | 02-registro-activos.md | Parcial: inventario lógico; S14 relevar anfitrión y actualizar Compose. |
| A.5.10 | Uso aceptable de activos | Sí | El uso autorizado evita datos reales o secretos en demos. | 01-Politica-Seguridad.md | S13 comunicar uso y autorización de datos. |
| A.5.11 | Devolución de activos | Sí | Al retirar permisos deben recuperarse equipos o medios cedidos. | Procedimiento de baja propuesto | S14 relevar custodia; aplicar si existen activos cedidos. |
| A.5.12 | Clasificación de la información | Sí | Datos, auditoría y secretos tienen distinta sensibilidad. | Clasificación del inventario | Parcial propuesta; S13 aprobar clasificación. |
| A.5.13 | Etiquetado de información | Sí | Copias y exportaciones requieren identificar sensibilidad. | Inventario y documentos de exportación | S11 definir etiquetas de archivos y copias. |
| A.5.14 | Transferencia de información | Sí | Exportaciones, respaldos y logs salen de la aplicación. | Exportadores; planes de respaldo y logs | S11 y S01 autorizar destinatarios y proteger transferencia. |
| A.5.15 | Reglas de control de acceso | Sí | Los usuarios tienen funciones y ámbitos distintos. | Guards y 09-gestion-accesos.md | Parcial: controles técnicos; S04 probar matriz completa. |
| A.5.16 | Gestión de identidades | Sí | Cuentas nominales y vínculos determinan el acceso. | AuthService y modelo Usuario | Parcial: alta/baja; S13 conservar autorización y revisar cuentas. |
| A.5.17 | Protección de credenciales | Sí | Contraseñas, semillas y tokens permiten acceder al RSI. | password.ts y auth.service.ts | Parcial: hashes existentes; S02/S03 proteger token y semillas. |
| A.5.18 | Gestión de permisos de acceso | Sí | Roles y pertenencia deben mantenerse vigentes. | RolesGuard y UnitScopeGuard | Parcial; S04 y S13 revisión nominal y pruebas cruzadas. |
| A.5.19 | Seguridad en relaciones con proveedores | Sí | Paquetes e imágenes de terceros intervienen en el servicio. | Lockfiles y Dockerfiles | S07 identificar proveedores y riesgos de procedencia. |
| A.5.20 | Seguridad en acuerdos con proveedores | Sí | Servicios externos que se contraten deben proteger los datos. | No hay acuerdos operativos acreditados | S13 revisar condiciones de proveedores efectivos y futuros. |
| A.5.21 | Seguridad en la cadena de suministro TIC | Sí | Una dependencia alterada puede comprometer código o contenedores. | npm ci y etiquetas de imágenes | Parcial reproducibilidad; S07 digest, procedencia y escaneo. |
| A.5.22 | Revisión de servicios de proveedores | Sí | La operación depende de cambios y soporte de terceros. | Versiones declaradas y lockfiles | S07 seguimiento de soporte y cambios; no se acreditan SLA. |
| A.5.23 | Seguridad de servicios en la nube | N/A | No hay servicio de nube desplegado o contratado dentro del alcance local. | Compose local; destinos de respaldo aún por elegir | N/A actual propuesta; revisar antes de nube o respaldo contratado. |
| A.5.24 | Preparación para gestionar incidentes | Sí | La plataforma debe prepararse para sus propios incidentes. | 04-Gestion-Incidentes.md | Parcial: procedimiento; S13 contactos y simulacro. |
| A.5.25 | Evaluación de eventos de seguridad | Sí | Los eventos requieren evaluar si afectan a la plataforma. | 07-Monitoreo-Logs-SIEM.md | S08 reglas, clasificación y evidencia de detección. |
| A.5.26 | Respuesta a incidentes | Sí | Un compromiso requiere contención y recuperación coordinadas. | Procedimiento de incidentes | Parcial documental; S13 probar respuesta operativa. |
| A.5.27 | Aprendizaje de incidentes | Sí | Las pruebas e incidentes deben producir correcciones. | Sección de lecciones en procedimiento | S13 registrar aprendizaje tras simulacro o incidente real. |
| A.5.28 | Preservación de evidencias | Sí | Logs y artefactos sustentan investigación y notificación. | AuditEvent y expediente propuesto | Parcial registro; S08 custodia e integridad independiente. |
| A.5.29 | Seguridad durante interrupciones | Sí | Una caída no justifica omitir permisos o MFA. | 06-Plan-Continuidad.md | S10 validar seguridad al recuperar. |
| A.5.30 | Continuidad de servicios TIC | Sí | BD, API y frontend deben recuperarse juntos. | Objetivos de continuidad | S01/S10 restauración y prueba de RTO integral. |
| A.5.31 | Obligaciones legales y contractuales | Sí | El operador debe determinar obligaciones reales de datos y contratos. | 12-Notificacion-Incidentes.md | S13 identificar responsable del tratamiento y aplicabilidad. |
| A.5.32 | Protección de propiedad intelectual | Sí | La consigna exige open source sin desconocer licencias. | Consigna, paquetes y repositorio | S07/S13 revisar licencias de código y dependencias. |
| A.5.33 | Protección de registros | Sí | Auditoría, autorizaciones y evidencias deben conservarse. | AuditEvent y actas propuestas | S08 retención, copia e integridad; aprobación pendiente. |
| A.5.34 | Privacidad de datos personales | Sí | Cuentas y registros de personas pueden contener datos personales. | Schema Prisma y política | S11/S13 minimizar, restringir y definir conservación. |
| A.5.35 | Revisión independiente de seguridad | Sí | La revisión externa ayuda a detectar afirmaciones sin evidencia. | Consigna Blue Team y Red Team | S15 preparar evaluación independiente; no se acredita ejecución. |
| A.5.36 | Verificación de cumplimiento interno | Sí | La redacción de una política no demuestra su cumplimiento. | Documentos y pruebas históricas | S13 revisiones con evidencia y excepciones. |
| A.5.37 | Procedimientos operativos documentados | Sí | Operar y recuperar necesita pasos verificables. | Docs de Docker, continuidad, accesos y logs | Parcial: procedimientos; S10/S15 validar coherencia con despliegue. |
| A.6.1 | Verificación previa del personal | Sí | Quienes reciben privilegios necesitan idoneidad acorde a su función. | Roles operativos propuestos | S14 definir validación proporcional del equipo, sin inventar controles laborales. |
| A.6.2 | Condiciones de empleo sobre seguridad | Sí | Los participantes deben conocer obligaciones de acceso y datos. | Política propuesta | S13 documentar acuerdos de participación; no se presumen contratos laborales. |
| A.6.3 | Formación y concientización en seguridad | Sí | El equipo debe usar correctamente secretos, evidencias y recuperación. | Procedimientos de seguridad | S14 formación breve con constancia y ejercicio. |
| A.6.4 | Proceso disciplinario | Sí | El incumplimiento de reglas requiere tratamiento por autoridad competente. | Aprobación operativa pendiente | S13 definir medidas proporcionales del proyecto; no inventar sanciones laborales. |
| A.6.5 | Responsabilidades al cambiar o terminar el vínculo | Sí | Cambiar o terminar participación exige retirar acceso y custodia. | 09-gestion-accesos.md | S14 comprobar bajas, devolución y obligaciones remanentes. |
| A.6.6 | Acuerdos de confidencialidad | Sí | Operadores pueden acceder a datos personales y secretos. | Reglas de confidencialidad propuestas | S13 acuerdos y comunicación antes de acceso real. |
| A.6.7 | Seguridad del trabajo remoto | Sí | La preparación para acceso remoto debe proteger equipo y canal. | Loopback actual y R05 | S05/S14 definir trabajo remoto seguro antes de habilitarlo. |
| A.6.8 | Reporte de eventos de seguridad | Sí | Un reporte humano puede ser la primera señal del incidente. | 04-Gestion-Incidentes.md | S13 acordar canal y alternativa fuera del RSI. |
| A.7.1 | Perímetros físicos de seguridad | Sí | El anfitrión y medios de respaldo requieren protección física. | Inventario físico pendiente | S14 relevar ubicación y acceso autorizado. |
| A.7.2 | Control de ingreso físico | Sí | Acceso físico podría permitir leer datos o secretos. | Sin control físico acreditado | S14 definir acceso según entorno real. |
| A.7.3 | Seguridad de oficinas e instalaciones | Sí | El entorno de trabajo sostiene el equipo operador. | Ubicación no documentada | S14 comprobar seguridad del espacio; no asumir centro de datos. |
| A.7.4 | Vigilancia física | Sí | Debe detectarse acceso físico no autorizado según riesgo local. | Evaluación física pendiente | S14 elegir medida proporcional; no declarar cámaras instaladas. |
| A.7.5 | Protección frente a riesgos ambientales | Sí | Energía y condiciones ambientales pueden interrumpir el servicio. | R10 y continuidad | S10/S14 relevar corte eléctrico, protección y alternativa. |
| A.7.6 | Trabajo en áreas protegidas | Sí | Los espacios que alojen equipo o copias necesitan reglas de uso. | Áreas y custodia por relevar | S14 definir medidas proporcionales; no inventar sala técnica. |
| A.7.7 | Escritorio y pantalla despejados | Sí | Sesiones abiertas y documentos visibles exponen información. | Token de navegador y evidencias | S14 bloqueo de pantalla y resguardo de documentos. |
| A.7.8 | Ubicación y protección de equipos | Sí | La posición del equipo afecta disponibilidad y acceso. | Anfitrión aún no inventariado | S14 verificar ubicación, seguridad y recursos. |
| A.7.9 | Protección de activos fuera de las instalaciones | Sí | Copias externas o equipos fuera del entorno deben protegerse. | Respaldo externo propuesto | S01/S14 identificar traslado y custodia. |
| A.7.10 | Gestión de medios de almacenamiento | Sí | Medios con BD o secretos requieren inventario y eliminación segura. | postgres_data y copias propuestas | S01/S14 controlar medios, cifrado y disposición. |
| A.7.11 | Continuidad de servicios auxiliares | Sí | Electricidad y servicios del anfitrión son dependencias críticas. | Continuidad y R10 | S10 relevar servicios auxiliares y capacidad de alternativa. |
| A.7.12 | Protección del cableado | Sí | La conectividad y cableado sostienen el acceso y transferencias. | Red del anfitrión no relevada | S14 verificar conexiones y exposición física. |
| A.7.13 | Mantenimiento de equipos | Sí | Falla o mantenimiento del equipo puede detener el RSI. | R10 | S10/S14 identificar custodio, mantenimiento y recuperación. |
| A.7.14 | Eliminación o reutilización segura de equipos | Sí | Discos y medios pueden conservar datos al reutilizarse. | Política y medios por relevar | S14 disposición segura con constancia. |
| A.8.1 | Protección de dispositivos de usuario | Sí | El navegador y equipo del operador conservan sesión y acceso. | Frontend y localStorage | S02/S14 proteger endpoint y pantalla. |
| A.8.2 | Control de privilegios elevados | Sí | Administración y consultas de auditoría tienen alto alcance. | RolesGuard y AuthGuard | Parcial técnico; S04/S13 mínimo privilegio y revisión. |
| A.8.3 | Restricción de acceso a información | Sí | Los ámbitos deben evitar lectura o escritura entre unidades. | UnitScopeGuard y filtros | Parcial técnico; S04 probar relaciones y exportaciones. |
| A.8.4 | Control de acceso al código fuente | Sí | La publicación open source debe preservar integridad y secretos. | Git y archivos ignorados | S07/S13 permisos de escritura, revisión y escaneo de secretos. |
| A.8.5 | Autenticación segura | Sí | La plataforma necesita sesiones y factores robustos. | Argon2/bcrypt, TOTP, WebAuthn | Parcial: código; S02/S03/S12 validar dispositivo y recuperación. |
| A.8.6 | Gestión de capacidad | Sí | API, hashes y BD pueden saturar recursos compartidos. | R06 y R10 | S06/S10 límites, carga y monitoreo de capacidad. |
| A.8.7 | Protección contra programas maliciosos | Sí | Malware del anfitrión puede comprometer aplicación y copias. | Escenario de ransomware en continuidad | S14 relevar protecciones del host; no se acredita despliegue. |
| A.8.8 | Gestión de vulnerabilidades técnicas | Sí | Paquetes y configuración necesitan evaluación y corrección. | 10-Gestion-Vulnerabilidades.md | Parcial: registro de debilidades; S07 ejecutar análisis y remediar. |
| A.8.9 | Configuración segura de sistemas | Sí | Puertos, origen e imágenes influyen en seguridad. | Compose y Nginx | Parcial configuración local; S05/S07 versionar y verificar. |
| A.8.10 | Eliminación de información | Sí | Borrar un registro no elimina necesariamente sus metadatos auditados. | DELETE y metadata de AuditEvent | S11/S13 definir supresión y conservación de copias. |
| A.8.11 | Enmascaramiento de datos | Sí | Demos y evidencia no deben exponer datos reales. | Datos de ejemplo y política | S11/S15 usar datos sintéticos y revisar muestras. |
| A.8.12 | Prevención de fugas de información | Sí | Exportaciones y copias pueden salir del ámbito autorizado. | Eventos EXPORTACION_EXPORT | Parcial trazabilidad; S11 autorizar destino y contenido. |
| A.8.13 | Respaldo de información | Sí | El volumen único no permite recuperación ante pérdida del equipo. | 06-Plan-Continuidad.md | S01 implementar copia externa y restaurar. |
| A.8.14 | Redundancia de servicios | Sí | La concentración de servicios exige una decisión de resiliencia. | Tres servicios en un anfitrión | S10 justificar ausencia de redundancia y probar entorno alternativo. |
| A.8.15 | Registro de eventos | Sí | Cambios y autenticaciones necesitan trazabilidad. | AuditEvent e interceptor | Parcial: eventos implementados; S08 ampliar cobertura y proteger copia. |
| A.8.16 | Monitoreo de actividades | Sí | Los registros deben producir detección y respuesta. | 07-Monitoreo-Logs-SIEM.md | S08 SIEM, reglas y alertas; no desplegados. |
| A.8.17 | Sincronización de relojes | Sí | Correlacionar fuentes requiere horas comparables. | timestamp en BD y logs de contenedores | S08 verificar UTC y sincronización del anfitrión. |
| A.8.18 | Uso controlado de herramientas privilegiadas | Sí | Herramientas de BD y Docker pueden omitir controles de aplicación. | Acceso administrativo del entorno | S14 limitar y auditar utilidades privilegiadas. |
| A.8.19 | Instalación controlada de software | Sí | Instalaciones del anfitrión e imágenes afectan la operación. | Dockerfiles y npm ci | Parcial builds; S07/S14 autorizar y registrar instalaciones. |
| A.8.20 | Seguridad de redes | Sí | Acceso remoto y comunicación necesitan protección. | Loopback y red Compose | Parcial local; S05 HTTPS y comprobación de exposición. |
| A.8.21 | Seguridad de servicios de red | Sí | Servicios de conectividad y entrada deben tener requisitos claros. | Nginx y entorno por relevar | S05/S13 definir origen, TLS y responsabilidades del operador. |
| A.8.22 | Segmentación de redes | Sí | BD y API no deben exponerse directamente al exterior. | Puertos loopback y red interna | Parcial; S05 comprobar red del despliegue real. |
| A.8.23 | Filtrado de navegación web | Sí | La navegación del operador puede introducir amenazas. | Equipo anfitrión en alcance | S14 evaluar filtrado y medidas proporcionales, sin inventar gateway. |
| A.8.24 | Uso de criptografía y gestión de claves | Sí | Hashes, semillas, transporte y respaldos requieren criptografía adecuada. | password.ts y configuración HTTP local | Parcial: hashes; S03/S05/S01 proteger claves, TLS y copias. |
| A.8.25 | Seguridad en el ciclo de desarrollo | Sí | Cambios del software necesitan incorporar seguridad. | Repo, scripts de pruebas y consigna | Parcial; S15 ciclo con revisión y evidencias. |
| A.8.26 | Requisitos de seguridad de aplicaciones | Sí | Los RF/RNF deben traducirse a aceptación verificable. | Consigna RF-14/15/16 y RNF | S15 verificar requisitos; no atribuir cumplimiento por documentación. |
| A.8.27 | Diseño y arquitectura seguros | Sí | Arquitectura modular necesita límites y protección de datos. | 00-arquitectura.md, guards y Compose | Parcial; S04/S05/S10 actualizar y validar arquitectura. |
| A.8.28 | Prácticas de programación segura | Sí | Validar entradas y relaciones evita errores de integridad. | DTOs, servicios y pruebas backend | Parcial: casos existentes; S15 revisión y pruebas de seguridad. |
| A.8.29 | Pruebas de seguridad antes de aceptación | Sí | La entrega exige comprobar escenarios negativos. | backend/test y evidencias históricas | Parcial: pruebas; S15 casos faltantes y Red Team autorizado. |
| A.8.30 | Seguridad del desarrollo tercerizado | N/A | No se acredita desarrollo contratado a terceros en el proyecto. | Desarrollo del equipo en alcance | N/A actual propuesta; revisar si se terceriza. |
| A.8.31 | Separación de entornos | Sí | Pruebas y restauraciones no deben sobrescribir datos operativos. | Guías de pruebas y continuidad | S15/S01 separar puertos, volúmenes, cuentas y secretos. |
| A.8.32 | Gestión de cambios técnicos | Sí | Migraciones e imágenes pueden afectar disponibilidad e integridad. | Migraciones Git y auditoría | Parcial: versionado; S09 revisión, prueba y recuperación. |
| A.8.33 | Protección de datos de prueba | Sí | Los datos de prueba deben proteger personas y evitar mezcla. | Seed demo y pruebas existentes | S11/S15 revisar datos sintéticos y limpieza aislada. |
| A.8.34 | Protección durante pruebas de auditoría | Sí | La evaluación debe preservar operación y evidencia. | Consigna Red Team y procedimientos | S15 alcance, autorización, ventana y custodia antes de pruebas. |

## 4. Análisis de brecha MCU 5.0

No se asigna una madurez numérica por la sola existencia de documentos o funcionalidades. Debe evaluarse cada requisito del perfil y su evidencia conforme al método MCU. La escala almacenada por la aplicación permite 0 a 4, pero los valores de las organizaciones demo no representan al operador del RSI.

| Función MCU 5.0 | Perfil objetivo | Evidencia disponible y límite | Madurez actual 0 a 4 | Acciones |
|---|---|---|---|---|
| Gobernar | Avanzado | Política y responsabilidades propuestas, sin aprobación ni asignación nominal | No determinada | S13 aprobar gobierno, criterios, obligaciones y recursos. |
| Identificar | Avanzado | Inventario lógico y 12 riesgos; entorno físico y dependencia real por completar | No determinada | S14 relevar; S07 validar debilidades; revisar matriz. |
| Proteger | Avanzado | Hashes, MFA y guards; token, semillas, TLS y respaldos requieren tratamiento | No determinada | S01 a S07 y S12 implementar y comprobar. |
| Detectar | Avanzado | AuditEvent y pruebas; sin SIEM ni alertas acreditados | No determinada | S08 centralizar, ampliar cobertura y medir reglas. |
| Responder | Avanzado | Procedimiento y formularios; no hay simulacro completo documentado | No determinada | S13/S15 contactos, expediente y simulacro. |
| Recuperar | Avanzado | RTO/RPO y plan propuestos; restauración no demostrada | No determinada | S01/S10 respaldar, restaurar y medir. |

## 5. Plan de tratamiento resumen

| ID | Riesgo / Control | Acción | Prioridad | Responsable propuesto | Fecha límite propuesta |
|---|---|---|---|---|---|
| S01 | R01; A.8.13, A.5.30 | Respaldo diario cifrado externo y restauración aislada; PT01. | Alta | Administrador | 10/10/2026 |
| S02 | R02; A.8.1, A.8.5 | Revisar sesión y CSP, revocación y acciones sensibles; PT02. | Alta | Responsable técnico | 17/10/2026 |
| S03 | R03; A.5.17, A.8.24 | Proteger semillas y separar claves de BD y copias; PT03. | Alta | Responsable técnico y administrador | 17/10/2026 |
| S04 | R04; A.5.15/18, A.8.2/3 | Probar permisos por ruta, ámbito, relación y exportación; PT04. | Media | Responsable técnico | 17/10/2026 |
| S05 | R05; A.8.20/21/22/24 | HTTPS, origen WebAuthn y exposición verificada antes del acceso remoto; PT05. | Media local; alta antes de publicar | Administrador | Antes del primer acceso remoto |
| S06 | R06; A.8.6, A.8.5 | Límites de abuso y pruebas de capacidad; PT06. | Media local; alta antes de publicar | Responsable técnico | 17/10/2026 y antes de acceso remoto |
| S07 | R07; A.5.19/21, A.8.8/9 | Evaluar versiones, imágenes, procedencia y licencias, remediar con evidencia; PT07. | Alta | Responsable técnico | 24/10/2026 |
| S08 | R08; A.8.15/16/17, A.5.33 | Cobertura de eventos, copia independiente, retención y reglas probadas; PT08. | Alta | Administrador y RSI | 24/10/2026 |
| S09 | R09; A.8.32 | Migraciones y concurrencia con prueba, respaldo y recuperación; PT09. | Media | Responsable técnico | 24/10/2026 |
| S10 | R10; A.5.29/30, A.8.14 | Relevar dependencia del host, salud integral y reconstrucción alternativa; PT10. | Alta | Administrador | 24/10/2026 |
| S11 | R11; A.5.14/34, A.8.10/11/12 | Minimizar, autorizar exportaciones, conservar y eliminar datos con criterio; PT11. | Media | RSI y responsable técnico | 10/10/2026 |
| S12 | R12; A.8.5, A.5.17 | Recuperación autorizada, revocación y pruebas de factores reales; PT12. | Media | Responsable técnico y RSI | 24/10/2026 |
| S13 | Gobierno; A.5 y A.6 | Asignar autoridad/custodios, aprobar documentos, actas y obligaciones; probar comunicación de incidentes. | Alta | Autoridad operativa y RSI | 17/10/2026 y antes de datos reales |
| S14 | Equipo y entorno; A.6, A.7, A.8.1/18/23 | Relevar anfitrión, red, seguridad física, custodia y prácticas del equipo. | Media | Administrador y autoridad operativa | 24/10/2026 |
| S15 | Desarrollo; A.8.25 a A.8.34 | Separar pruebas, revisar cambios y validar seguridad con escenarios y evaluación independiente autorizada. | Alta antes de entrega | Responsable técnico y RSI | 24/10/2026 y antes de entregar/publicar |

Las fechas son objetivos, no compromisos aprobados. Cada cierre requiere evidencia técnica o acta de ejecución y reevaluación del riesgo residual. La aceptación sigue la sección 6 de `03-Analisis-Riesgos.md`; no hay firmas o aceptación formal incorporadas. Las exclusiones y la madurez deben revisarse antes de declarar cumplimiento.
