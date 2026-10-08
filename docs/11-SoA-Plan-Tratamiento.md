# Declaración de aplicabilidad y plan de tratamiento del Sistema RSI

La SoA indica qué controles de seguridad aplican al desarrollo y operación del propio RSI, por qué se seleccionan y cuál es su situación. El plan de tratamiento resume las acciones pendientes. Las evaluaciones de organizaciones guardadas en la aplicación no demuestran cumplimiento de la plataforma.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Seis funciones; perfil objetivo Avanzado | Orientar la revisión de controles y brechas. |
| COBIT 2019 | EDM01, EDM03, APO13 y MEA01 | Gobierno, riesgo y revisión de seguridad. |
| ISO/IEC 27001:2022 | Anexo A y cláusula 6.1.3 | Seleccionar controles y justificar su aplicabilidad. |
| ISO/IEC 27002:2022 | Guía de controles | Orientar las medidas de seguridad. |
| BCU | Seguridad de la información | Referencia de la consigna, sin presumir supervisión del operador. |
| Protección de datos personales | Ley 18.331 | Proteger los datos tratados por el sistema. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-SOA-11 |
| Versión | 1.1 |
| Responsable | RSI y responsables técnicos de la plataforma |
| Fecha | 08/10/2026 |

## 1. Alcance y criterio

El alcance incluye aplicación, autenticación, PostgreSQL, datos, auditoría, código, configuración, equipo y operadores. Un control puede ser organizacional o físico; no necesita una pantalla en la aplicación para ser aplicable.

**Aplicable no significa implementado.** Los controles sin evidencia suficiente siguen pendientes o parciales. N/A identifica una exclusión propuesta para el alcance local, que debe revisarse si cambia el entorno. El documento no acredita certificación ni cumplimiento completo del perfil MCU.

## 2. Resumen de aplicabilidad

| Categoría | Controles | Aplicables | N/A |
|---|---:|---:|---:|
| A.5 Organizacionales | 37 | 36 | 1 |
| A.6 Personas | 8 | 8 | 0 |
| A.7 Físicos | 14 | 14 | 0 |
| A.8 Tecnológicos | 34 | 33 | 1 |
| **Total** | **93** | **91** | **2** |

Las exclusiones propuestas son servicios en la nube (A.5.23) y desarrollo tercerizado (A.8.30), no incorporados al alcance local. Integrar un gestor de secretos en la nube, contratar respaldos en nube o tercerizar desarrollo obliga a revisar estas decisiones.

## 3. Declaración de aplicabilidad

Los nombres de los controles son resúmenes temáticos del catálogo del proyecto. Su situación distingue mecanismos técnicos disponibles de medidas operativas todavía pendientes.

### A.5 — Organizacionales

| Control | ¿Aplica? | Justificación | Situación actual |
|---|---|---|---|
| A.5.1 — Políticas de seguridad de la información | Sí | El operador necesita reglas para proteger la plataforma y sus datos. | Parcial: texto propuesto; aprobar y comunicar. |
| A.5.2 — Responsabilidades de seguridad | Sí | Los controles requieren custodios y una autoridad que acepte riesgos. | Pendiente: asignar personas; no confundir rol de app con autoridad. |
| A.5.3 — Separación de funciones | Sí | Desarrollo, administración y aprobación pueden concentrarse en el equipo. | Parcial técnico; revisión de cambios por otra persona. |
| A.5.4 — Responsabilidad de la dirección | Sí | La dirección del proyecto debe autorizar recursos y uso de datos. | Pendiente: registrar decisiones y recursos. |
| A.5.5 — Contacto con autoridades | Sí | Una vulneración puede requerir comunicación por el operador. | Pendiente: identificar responsables y canales externos. |
| A.5.6 — Contacto con comunidades especializadas | Sí | El equipo necesita fuentes externas para avisos de seguridad. | Pendiente: definir fuentes y revisión de avisos. |
| A.5.7 — Información sobre amenazas | Sí | Dependencias y autenticación pueden sufrir amenazas nuevas. | Pendiente: revisar avisos y ajustar riesgos. |
| A.5.8 — Seguridad en proyectos | Sí | El desarrollo del RSI debe incorporar requisitos de protección. | Parcial documental; verificar seguridad en entregas. |
| A.5.9 — Inventario de información y activos | Sí | Los componentes propios sostienen la operación. | Inventario lógico documentado. Pendiente completar el relevamiento del equipo y su entorno. |
| A.5.10 — Uso aceptable de activos | Sí | El uso autorizado evita datos reales o secretos en demos. | Pendiente: comunicar uso y autorización de datos. |
| A.5.11 — Devolución de activos | Sí | Al retirar permisos deben recuperarse equipos o medios cedidos. | Pendiente: relevar custodia; aplicar si existen activos cedidos. |
| A.5.12 — Clasificación de la información | Sí | Datos, auditoría y secretos tienen distinta sensibilidad. | Parcial propuesta; aprobar clasificación. |
| A.5.13 — Etiquetado de información | Sí | Copias y exportaciones requieren identificar sensibilidad. | Pendiente: definir etiquetas de archivos y copias. |
| A.5.14 — Transferencia de información | Sí | Exportaciones, respaldos y logs salen de la aplicación. | Pendiente: autorizar destinatarios y proteger transferencia. |
| A.5.15 — Reglas de control de acceso | Sí | Los usuarios tienen funciones y ámbitos distintos. | Guards y filtros implementados. Mantener y completar pruebas de permisos por ruta y ámbito. |
| A.5.16 — Gestión de identidades | Sí | Cuentas nominales y vínculos determinan el acceso. | Alta, modificación y desactivación implementadas. Autorización y revisión de cuentas manuales. |
| A.5.17 — Protección de credenciales | Sí | Contraseñas, semillas y tokens permiten acceder al RSI. | Hashes de contraseña, cookies protegidas y semillas TOTP cifradas. Pendiente comprobar recuperación y custodia de secretos. |
| A.5.18 — Gestión de permisos de acceso | Sí | Roles y pertenencia deben mantenerse vigentes. | Roles y ámbito comprobados en backend; cambios sensibles revocan sesiones. Revisión de accesos manual. |
| A.5.19 — Seguridad en relaciones con proveedores | Sí | Paquetes e imágenes de terceros intervienen en el servicio. | Pendiente: identificar proveedores y riesgos de procedencia. |
| A.5.20 — Seguridad en acuerdos con proveedores | Sí | Servicios externos que se contraten deben proteger los datos. | Pendiente: revisar condiciones de proveedores efectivos y futuros. |
| A.5.21 — Seguridad en la cadena de suministro TIC | Sí | Una dependencia alterada puede comprometer código o contenedores. | Lockfiles y npm ci disponibles. Pendiente revisar procedencia, imágenes y versiones utilizadas. |
| A.5.22 — Revisión de servicios de proveedores | Sí | La operación depende de cambios y soporte de terceros. | Pendiente: seguimiento de soporte y cambios; no se acreditan SLA. |
| A.5.23 — Seguridad de servicios en la nube | N/A | No hay servicio de nube desplegado o contratado dentro del alcance local. | N/A actual propuesta; revisar antes de nube o respaldo contratado. |
| A.5.24 — Preparación para gestionar incidentes | Sí | La plataforma debe prepararse para sus propios incidentes. | Parcial: procedimiento; contactos y simulacro. |
| A.5.25 — Evaluación de eventos de seguridad | Sí | Los eventos requieren evaluar si afectan a la plataforma. | Revisión manual de auditoría y logs. Wazuh y alertas quedan como mejora futura. |
| A.5.26 — Respuesta a incidentes | Sí | Un compromiso requiere contención y recuperación coordinadas. | Parcial documental; probar respuesta operativa. |
| A.5.27 — Aprendizaje de incidentes | Sí | Las pruebas e incidentes deben producir correcciones. | Pendiente: registrar aprendizaje tras simulacro o incidente real. |
| A.5.28 — Preservación de evidencias | Sí | Logs y artefactos sustentan investigación y notificación. | Parcial registro; custodia e integridad independiente. |
| A.5.29 — Seguridad durante interrupciones | Sí | Una caída no justifica omitir permisos o MFA. | Plan de continuidad documentado. Pendiente comprobar seguridad durante una recuperación. |
| A.5.30 — Continuidad de servicios TIC | Sí | BD, API y frontend deben recuperarse juntos. | Objetivos RTO/RPO propuestos. Pendiente respaldo independiente y restauración completa. |
| A.5.31 — Obligaciones legales y contractuales | Sí | El operador debe determinar obligaciones reales de datos y contratos. | Pendiente: identificar responsable del tratamiento y aplicabilidad. |
| A.5.32 — Protección de propiedad intelectual | Sí | La consigna exige open source sin desconocer licencias. | Pendiente: revisar licencias de código y dependencias. |
| A.5.33 — Protección de registros | Sí | Auditoría, autorizaciones y evidencias deben conservarse. | Auditoría persistida. Pendiente copia independiente y recuperación que sostengan la retención requerida. |
| A.5.34 — Privacidad de datos personales | Sí | Cuentas y registros de personas pueden contener datos personales. | Pendiente: minimizar, restringir y definir conservación. |
| A.5.35 — Revisión independiente de seguridad | Sí | La revisión externa ayuda a detectar afirmaciones sin evidencia. | Pendiente: preparar evaluación independiente; no se acredita ejecución. |
| A.5.36 — Verificación de cumplimiento interno | Sí | La redacción de una política no demuestra su cumplimiento. | Pendiente: revisiones con evidencia y excepciones. |
| A.5.37 — Procedimientos operativos documentados | Sí | Operar y recuperar necesita pasos verificables. | Parcial: procedimientos; validar coherencia con despliegue. |

### A.6 — Personas

| Control | ¿Aplica? | Justificación | Situación actual |
|---|---|---|---|
| A.6.1 — Verificación previa del personal | Sí | Quienes reciben privilegios necesitan idoneidad acorde a su función. | Pendiente: definir validación proporcional del equipo, sin inventar controles laborales. |
| A.6.2 — Condiciones de empleo sobre seguridad | Sí | Los participantes deben conocer obligaciones de acceso y datos. | Pendiente: documentar acuerdos de participación; no se presumen contratos laborales. |
| A.6.3 — Formación y concientización en seguridad | Sí | El equipo debe usar correctamente secretos, evidencias y recuperación. | Pendiente: formación breve con constancia y ejercicio. |
| A.6.4 — Proceso disciplinario | Sí | El incumplimiento de reglas requiere tratamiento por autoridad competente. | Pendiente: definir medidas proporcionales del proyecto; no inventar sanciones laborales. |
| A.6.5 — Responsabilidades al cambiar o terminar el vínculo | Sí | Cambiar o terminar participación exige retirar acceso y custodia. | Pendiente: comprobar bajas, devolución y obligaciones remanentes. |
| A.6.6 — Acuerdos de confidencialidad | Sí | Operadores pueden acceder a datos personales y secretos. | Pendiente: acuerdos y comunicación antes de acceso real. |
| A.6.7 — Seguridad del trabajo remoto | Sí | La preparación para acceso remoto debe proteger equipo y canal. | HTTPS local configurado. Pendiente definir protección de equipos y condiciones del acceso remoto. |
| A.6.8 — Reporte de eventos de seguridad | Sí | Un reporte humano puede ser la primera señal del incidente. | Pendiente: acordar canal y alternativa fuera del RSI. |

### A.7 — Físicos

| Control | ¿Aplica? | Justificación | Situación actual |
|---|---|---|---|
| A.7.1 — Perímetros físicos de seguridad | Sí | El anfitrión y medios de respaldo requieren protección física. | Pendiente: relevar ubicación y acceso autorizado. |
| A.7.2 — Control de ingreso físico | Sí | Acceso físico podría permitir leer datos o secretos. | Pendiente: definir acceso según entorno real. |
| A.7.3 — Seguridad de oficinas e instalaciones | Sí | El entorno de trabajo sostiene el equipo operador. | Pendiente: comprobar seguridad del espacio; no asumir centro de datos. |
| A.7.4 — Vigilancia física | Sí | Debe detectarse acceso físico no autorizado según riesgo local. | Pendiente: elegir medida proporcional; no declarar cámaras instaladas. |
| A.7.5 — Protección frente a riesgos ambientales | Sí | Energía y condiciones ambientales pueden interrumpir el servicio. | Pendiente revisar riesgos ambientales y medidas de protección del equipo. |
| A.7.6 — Trabajo en áreas protegidas | Sí | Los espacios que alojen equipo o copias necesitan reglas de uso. | Pendiente: definir medidas proporcionales; no inventar sala técnica. |
| A.7.7 — Escritorio y pantalla despejados | Sí | Sesiones abiertas y documentos visibles exponen información. | Pendiente verificar bloqueo de pantalla y resguardo de documentos y sesiones. |
| A.7.8 — Ubicación y protección de equipos | Sí | La posición del equipo afecta disponibilidad y acceso. | Pendiente: verificar ubicación, seguridad y recursos. |
| A.7.9 — Protección de activos fuera de las instalaciones | Sí | Copias externas o equipos fuera del entorno deben protegerse. | Pendiente: identificar traslado y custodia. |
| A.7.10 — Gestión de medios de almacenamiento | Sí | Medios con BD o secretos requieren inventario y eliminación segura. | Pendiente: controlar medios, cifrado y disposición. |
| A.7.11 — Continuidad de servicios auxiliares | Sí | Electricidad y servicios del anfitrión son dependencias críticas. | Pendiente comprobar dependencias de energía y conectividad y alternativas de recuperación. |
| A.7.12 — Protección del cableado | Sí | La conectividad y cableado sostienen el acceso y transferencias. | Pendiente: verificar conexiones y exposición física. |
| A.7.13 — Mantenimiento de equipos | Sí | Falla o mantenimiento del equipo puede detener el RSI. | Pendiente definir responsable y mantenimiento del equipo. |
| A.7.14 — Eliminación o reutilización segura de equipos | Sí | Discos y medios pueden conservar datos al reutilizarse. | Pendiente: disposición segura con constancia. |

### A.8 — Tecnológicos

| Control | ¿Aplica? | Justificación | Situación actual |
|---|---|---|---|
| A.8.1 — Protección de dispositivos de usuario | Sí | El navegador y equipo del operador conservan sesión y acceso. | Sesión sin localStorage. Pendiente revisar protección del dispositivo y bloqueo de pantalla. |
| A.8.2 — Control de privilegios elevados | Sí | Administración y consultas de auditoría tienen alto alcance. | Parcial técnico; mínimo privilegio y revisión. |
| A.8.3 — Restricción de acceso a información | Sí | Los ámbitos deben evitar lectura o escritura entre unidades. | Parcial técnico; probar relaciones y exportaciones. |
| A.8.4 — Control de acceso al código fuente | Sí | La publicación open source debe preservar integridad y secretos. | Pendiente: permisos de escritura, revisión y escaneo de secretos. |
| A.8.5 — Autenticación segura | Sí | La plataforma necesita sesiones y factores robustos. | Contraseña y TOTP implementados; cookies protegidas y revocación. Recuperación de cuentas pendiente; passkeys como mejora futura. |
| A.8.6 — Gestión de capacidad | Sí | API, hashes y BD pueden saturar recursos compartidos. | Límites por IP configurados y probados en Nginx aislado. Aplicación al despliegue y pruebas de capacidad pendientes. |
| A.8.7 — Protección contra programas maliciosos | Sí | Malware del anfitrión puede comprometer aplicación y copias. | Pendiente: relevar protecciones del host; no se acredita despliegue. |
| A.8.8 — Gestión de vulnerabilidades técnicas | Sí | Paquetes y configuración necesitan evaluación y corrección. | Registro actualizado y npm audit en pre-push. Pendiente corregir avisos y analizar imágenes Docker. |
| A.8.9 — Configuración segura de sistemas | Sí | Puertos, origen e imágenes influyen en seguridad. | Configuración versionada, HTTPS, orígenes y límites. Pendiente validar el despliegue de cada entrega. |
| A.8.10 — Eliminación de información | Sí | Borrar un registro no elimina necesariamente sus metadatos auditados. | Pendiente: definir supresión y conservación de copias. |
| A.8.11 — Enmascaramiento de datos | Sí | Demos y evidencia no deben exponer datos reales. | Pendiente: usar datos sintéticos y revisar muestras. |
| A.8.12 — Prevención de fugas de información | Sí | Exportaciones y copias pueden salir del ámbito autorizado. | Parcial trazabilidad; autorizar destino y contenido. |
| A.8.13 — Respaldo de información | Sí | El volumen único no permite recuperación ante pérdida del equipo. | Copia manual local realizada. Respaldos automáticos independientes y restauración completa pendientes. |
| A.8.14 — Redundancia de servicios | Sí | La concentración de servicios exige una decisión de resiliencia. | Sin redundancia implementada. Pendiente comprobar recuperación en un entorno alternativo. |
| A.8.15 — Registro de eventos | Sí | Cambios y autenticaciones necesitan trazabilidad. | AuditEvent y auditoría transaccional implementados para operaciones cubiertas. Pendiente ampliar cobertura y proteger copias. |
| A.8.16 — Monitoreo de actividades | Sí | Los registros deben producir detección y respuesta. | Revisión manual de registros. Wazuh, centralización y alertas quedan como mejora futura. |
| A.8.17 — Sincronización de relojes | Sí | Correlacionar fuentes requiere horas comparables. | Pendiente: verificar UTC y sincronización del anfitrión. |
| A.8.18 — Uso controlado de herramientas privilegiadas | Sí | Herramientas de BD y Docker pueden omitir controles de aplicación. | Pendiente: limitar y auditar utilidades privilegiadas. |
| A.8.19 — Instalación controlada de software | Sí | Instalaciones del anfitrión e imágenes afectan la operación. | Parcial builds; autorizar y registrar instalaciones. |
| A.8.20 — Seguridad de redes | Sí | Acceso remoto y comunicación necesitan protección. | HTTPS en Nginx y red interna de Compose. Pendiente comprobar exposición antes del acceso remoto. |
| A.8.21 — Seguridad de servicios de red | Sí | Servicios de conectividad y entrada deben tener requisitos claros. | HTTPS y origen autorizado configurados. Definir responsabilidades y certificado válido para publicación. |
| A.8.22 — Segmentación de redes | Sí | BD y API no deben exponerse directamente al exterior. | Backend sin puerto público y BD en loopback. Comprobar segmentación del despliegue efectivo. |
| A.8.23 — Filtrado de navegación web | Sí | La navegación del operador puede introducir amenazas. | Pendiente: evaluar filtrado y medidas proporcionales, sin inventar gateway. |
| A.8.24 — Uso de criptografía y gestión de claves | Sí | Hashes, semillas, transporte y respaldos requieren criptografía adecuada. | Argon2id/bcrypt, AES-256-GCM para TOTP y HTTPS. Pendiente custodia y recuperación de claves y protección de copias. |
| A.8.25 — Seguridad en el ciclo de desarrollo | Sí | Cambios del software necesitan incorporar seguridad. | Parcial; ciclo con revisión y evidencias. |
| A.8.26 — Requisitos de seguridad de aplicaciones | Sí | Los RF/RNF deben traducirse a aceptación verificable. | Pendiente: verificar requisitos; no atribuir cumplimiento por documentación. |
| A.8.27 — Diseño y arquitectura seguros | Sí | Arquitectura modular necesita límites y protección de datos. | Arquitectura, guards y Compose documentados. Mantener su coherencia y validar cambios. |
| A.8.28 — Prácticas de programación segura | Sí | Validar entradas y relaciones evita errores de integridad. | Validaciones y pruebas existentes; CSP configurada. Pendiente revisión específica de XSS y validación de la política. |
| A.8.29 — Pruebas de seguridad antes de aceptación | Sí | La entrega exige comprobar escenarios negativos. | Parcial: pruebas; casos faltantes y Red Team autorizado. |
| A.8.30 — Seguridad del desarrollo tercerizado | N/A | No se acredita desarrollo contratado a terceros en el proyecto. | N/A actual propuesta; revisar si se terceriza. |
| A.8.31 — Separación de entornos | Sí | Pruebas y restauraciones no deben sobrescribir datos operativos. | Pendiente: separar puertos, volúmenes, cuentas y secretos. |
| A.8.32 — Gestión de cambios técnicos | Sí | Migraciones e imágenes pueden afectar disponibilidad e integridad. | Migraciones y código versionados. Mantener revisión, pruebas y respaldo antes de cambios importantes. |
| A.8.33 — Protección de datos de prueba | Sí | Los datos de prueba deben proteger personas y evitar mezcla. | Pendiente: revisar datos sintéticos y limpieza aislada. |
| A.8.34 — Protección durante pruebas de auditoría | Sí | La evaluación debe preservar operación y evidencia. | Pendiente: alcance, autorización, ventana y custodia antes de pruebas. |

## 4. Brechas MCU 5.0

El objetivo de la consigna es el perfil Avanzado. Su grado de adopción requiere evaluar controles y evidencias; no se asigna madurez a partir de los datos demo o de la existencia de documentos.

| Función | Qué tenemos | Qué falta |
|---|---|---|
| Gobernar | Política y procedimientos documentados. | Definir responsables operativos, comunicar reglas y revisar su aplicación. |
| Identificar | Inventario lógico y análisis de riesgos actualizado. | Completar relevamiento del equipo y validar hallazgos técnicos. |
| Proteger | Hashes, MFA, guards, cookies protegidas, revocación, cifrado TOTP y HTTPS. | Custodia y recuperación de secretos, validación de XSS/CSP, actualización de dependencias y revisión de imágenes. |
| Detectar | Auditoría y logs con revisión manual. | Ampliar cobertura, preservar copia independiente y comprobar retención; Wazuh como mejora futura. |
| Responder | Procedimiento de incidentes y notificaciones manuales. | Definir contactos y probar un caso completo. |
| Recuperar | Plan y objetivos RTO/RPO; copia manual local. | Respaldos independientes y restauración completa probada. |

## 5. Plan de tratamiento

| Tema | Acción pendiente | Prioridad | Responsable |
|---|---|---|---|
| Respaldos y recuperación | Automatizar copias protegidas fuera del equipo y comprobar una restauración completa. | Alta | Administrador y responsable técnico. |
| Sesiones y XSS | Revisar y validar CSP y prevención de XSS; mantener cookies, origen y revocación. | Alta | Responsable técnico. |
| Secretos y TOTP | Custodiar la clave y probar su recuperación. Gestor de secretos externo como mejora futura. | Alta | Administrador y responsable técnico. |
| Publicación | Verificar certificado válido, origen y puertos antes del acceso remoto. | Alta antes de publicar | Administrador. |
| Dependencias e imágenes | Corregir hallazgos aplicables de npm audit y analizar imágenes Docker. | Alta | Responsable técnico. |
| Auditoría y monitoreo | Completar eventos, copia independiente y conservación comprobada. Wazuh y alertas como mejora futura. | Alta | Administrador y RSI. |
| Permisos y capacidad | Mantener pruebas de acceso; desplegar límites de Nginx y comprobar uso legítimo y carga. | Media | Responsable técnico. |
| Exportaciones y evidencias | Revisar destinatarios y contenido, minimizando datos personales innecesarios. | Media | RSI y responsable técnico. |
| Recuperación de cuentas | Implementar comprobación de identidad, autorización y trazabilidad para recuperar MFA o cuenta. | Media | Responsable técnico y RSI. |
| Operación e incidentes | Definir responsables y contactos, revisar accesos y probar respuesta a un incidente. | Alta | RSI y administrador. |
| Equipo y entorno | Revisar protección física, mantenimiento, custodia y prácticas del equipo. | Media | Administrador. |
| Desarrollo y cambios | Mantener pruebas aisladas, revisión de cambios y respaldo antes de migraciones. | Alta antes de entregar | Responsable técnico. |

Retirar un riesgo del análisis no elimina los controles que siguen siendo aplicables. Las prioridades orientan el trabajo; no representan fechas comprometidas ni controles completados. Cada cierre requiere evidencia y revisión del resultado.

Consultar [Análisis de riesgos](03-Analisis-Riesgos.md), [Gestión de vulnerabilidades](10-Gestion-Vulnerabilidades.md) y [Plan de continuidad](06-Plan-Continuidad.md). Las mejoras futuras continúan pendientes y no se presentan como requisitos cumplidos.
