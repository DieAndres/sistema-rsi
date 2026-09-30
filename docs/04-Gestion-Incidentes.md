# Gestión de incidentes de seguridad del Sistema RSI

Este procedimiento trata los incidentes que afectan al **propio Sistema de Gestión Integrada para el RSI**: su aplicación web, API, autenticación, base de datos, configuración, exportaciones y disponibilidad. Los incidentes que una organización registra sobre sus activos son datos gestionados por el RSI y no demuestran que la plataforma haya sufrido un incidente.

## Encabezado de mapeo normativo

| Marco | Ítem verificado | Aporte al Sistema RSI |
|---|---|---|
| MCU 5.0 (funciones) | Detectar (DE), Responder (RS), Recuperar (RC) | Ordena la detección de eventos de la plataforma, su respuesta y la verificación de la recuperación. |
| MCU 5.0 (categorías) | DE.AE; RS.MA, RS.AN, RS.CO, RS.MI; RC.RP | Relaciona este procedimiento con análisis de eventos, gestión y mitigación de incidentes y ejecución de la recuperación. No equivale a demostrar cada subcategoría. |
| COBIT 2019 | DSS02 (gestión de solicitudes e incidentes) y DSS04 (continuidad) | Orienta el registro, la asignación de responsables y la conexión con el plan de continuidad del RSI. |
| ISO/IEC 27001:2022 | Anexo A: 5.24 a 5.28 | Referencia para preparar, evaluar, responder, aprender y preservar evidencias. Este documento no declara conformidad. |
| ISO/IEC 27035-1:2023 | Principios y proceso de gestión de incidentes | Referencia para ordenar las etapas del procedimiento. |
| BCU — Guía de estándares mínimos de gestión | GI.1 a GI.5 | Referencia para planificar, evaluar, informar, registrar y responder. Solo una entidad supervisada determina sus obligaciones ante el BCU. |
| Protección de datos personales | Ley 19.670, art. 38; Decreto 64/020, arts. 3 y 4 | Si una vulneración del RSI afecta datos personales, su operador debe evaluar las medidas y comunicaciones que correspondan. El «art. 20 de la Ley 18.331» citado en la plantilla no regula esta notificación. |

El objetivo académico del proyecto es el perfil MCU 5.0 **Avanzado**. El perfil y el grado de adopción se evalúan con controles y evidencia, no por la existencia de este texto.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-INC-04 |
| Versión | 1.3 — propuesta |
| Responsable | RSI o responsable de seguridad designado para operar el Sistema RSI |
| Fecha | 30/09/2026 |
| Aprobación | Pendiente de registrar |
| Próxima revisión | Un año después de la aprobación o tras un incidente significativo |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 24/09/2026 | Equipo del proyecto | Primer borrador. |
| 1.1 | 30/09/2026 | Equipo del proyecto | Alcance y referencias normativas centradas en el RSI. |
| 1.2 | 30/09/2026 | Equipo del proyecto | Reorganización según la estructura de `plantilla/isaca/04-gestion-incidentes.md`. |
| 1.3 | 30/09/2026 | Equipo del proyecto | Retiro de las secciones de guía de llenado y aceptación, propias de la plantilla. |

## 1. Definiciones (marco)

- **Evento de seguridad:** hecho observable en el RSI que debe evaluarse. Un fallo de autenticación aislado es un evento, no necesariamente un incidente.
- **Incidente de seguridad del RSI:** evento confirmado o razonablemente sospechado que afecta su confidencialidad, integridad o disponibilidad, o vulnera su política de seguridad.
- **Severidad:** prioridad inicial de respuesta según impacto y alcance. Puede cambiar a medida que aparezca evidencia.

Las bandas siguientes son criterios propuestos para el proyecto; requieren aprobación operativa.

| Severidad | Criterio | Ejemplo relacionado con el RSI |
|---|---|---|
| S0 — Crítica | Exposición extensa de información, control administrativo no autorizado o indisponibilidad total de alto impacto. | Acceso no autorizado a toda la base de datos. |
| S1 — Alta | Compromiso confirmado de cuenta privilegiada, componente central o datos de un ámbito restringido. | Sesión administrativa utilizada por un tercero. |
| S2 — Media | Afectación acotada o intento de intrusión con indicios verificables y sin compromiso extenso confirmado. | Alteración limitada de una exportación. |
| S3 — Baja | Anomalía que amerita análisis, con impacto aún no confirmado. | Serie inusual de accesos fallidos. |

## 2. Clasificación y registro de incidentes

Quien detecte un evento debe comunicarlo al responsable de seguridad. Este distingue hecho de sospecha, identifica el componente afectado, asigna severidad y abre un expediente si corresponde.

| Campo del expediente del RSI | Qué registrar |
|---|---|
| Identificador | Referencia única asignada al abrir el caso; no se presupone un formato automático. |
| Fecha y hora UTC | Detección, confirmación, decisiones, recuperación y cierre. |
| Descripción y fuente | Síntomas observados, reporte humano, log o resultado de prueba. |
| Severidad y estado | Clasificación inicial y cambios posteriores, con motivo. |
| Componente y alcance | Frontend, API, autenticación, base de datos, exportador o infraestructura; datos potencialmente afectados. |
| Responsable | Persona que coordina la respuesta. |
| Evidencia preservada | Referencia protegida a logs o archivos, su origen y quien los obtuvo; no incluir secretos en Git. |
| Acciones | Contención, corrección, restauración, verificación y comunicaciones efectuadas. |

### Registro de incidentes del Sistema RSI

| ID | Detección UTC | Descripción | Severidad | Componente | Estado | Responsable | Evidencia |
|---|---|---|---|---|---|---|---|
| Sin incidentes del RSI documentados en este archivo | — | — | — | — | — | — | — |

El CRUD `/api/v1/seguridad/incidentes` y la entidad `Incidente` de Prisma registran incidentes asociados a activos de organizaciones cargadas en la aplicación. No contienen la cronología ni las acciones de un expediente de incidente **del RSI**. Hasta que se defina un registro específico, el expediente operativo debe conservarse en un medio protegido y referenciar las evidencias pertinentes de `docs/evidencias/` cuando se trate del laboratorio del curso. La tabla se completa solo con casos reales o simulacros identificados como tales.

## 3. Procedimiento de respuesta (línea de tiempo)

1. **Detección:** recibir un reporte, revisar un evento de auditoría o identificar una anomalía durante una prueba. Registrar hora UTC y fuente.
2. **Evaluación y registro:** confirmar lo conocido, abrir el expediente, estimar impacto, asignar severidad y responsable. No retrasar la contención mientras se investiga una causa aún desconocida.
3. **Preservación:** guardar los logs y artefactos originales con origen, fecha y acceso restringido antes de modificarlos cuando sea posible.
4. **Contención:** limitar el daño según el caso, por ejemplo revocar una sesión, restringir un endpoint o aislar una instancia afectada. Registrar el efecto de la medida sobre el servicio.
5. **Erradicación:** corregir la causa comprobada, como código, configuración, dependencia o credencial comprometida; verificar que la vía de ataque ya no funcione.
6. **Recuperación:** restaurar desde una fuente confiable si corresponde y comprobar base de datos, autenticación, permisos, API y exportaciones afectadas. Ante pérdida de servicio o datos, aplicar `docs/06-Plan-Continuidad.md`.
7. **Lecciones y cierre:** documentar impacto, causa, acciones y mejoras; cerrar después de verificar la recuperación y las comunicaciones necesarias.

Este es un procedimiento manual. El código y la documentación actual no acreditan un SIEM operativo, respuesta automatizada, respaldo diario ni restauración probada.

## 4. Notificación y escalamiento

| Escenario | Notificar o escalar a | Plazo o criterio | Registro |
|---|---|---|---|
| Evento o incidente interno del RSI | RSI o responsable designado; administrador para acciones técnicas | Al detectarlo. El canal interno y su alternativa deben definirse antes de operar. | Expediente del incidente. |
| Incidente S0 o S1 | Responsable de seguridad y autoridad operativa del sistema | Escalamiento inmediato tras la clasificación inicial; informar cambios relevantes. | Decisiones y comunicaciones en el expediente. |
| Vulneración de datos personales tratados por el RSI | Responsable o encargado del tratamiento, según su función real; URCDP y titulares cuando corresponda | Iniciar medidas para minimizar el impacto dentro de las primeras 24 horas de constatado; el responsable comunica a URCDP dentro de 72 horas de conocida la vulneración, conforme al Decreto 64/020. | Constancia de evaluación y comunicación externa. |
| Incidente en una entidad sujeta a supervisión del BCU | Responsable institucional de cumplimiento de esa entidad | Aplicar las obligaciones y plazos vigentes para ella; la condición de entidad supervisada no se presume por usar el RSI. | Constancia institucional, si corresponde. |

La notificación externa requiere determinar quién opera el sistema y quién es responsable del tratamiento. El RSI no envía automáticamente notificaciones a URCDP o BCU. `docs/12-Notificacion-Incidentes.md` aún no existe.

## 5. Plantilla de lecciones aprendidas

| Campo | Qué completar al cerrar un caso |
|---|---|
| Qué ocurrió | Hechos comprobados y secuencia UTC. |
| Por qué ocurrió | Causa verificada o hipótesis que sigue abierta. |
| Qué funcionó | Controles y acciones que limitaron el impacto. |
| Qué falló | Debilidades observadas en el RSI o en la respuesta. |
| Recuperación | Comprobaciones realizadas y resultado. |
| Acciones de mejora | Cambio concreto, responsable y fecha objetivo. |

## Fuentes oficiales

- [AGESIC — Marco de Ciberseguridad 5.0](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/book/9330/download).
- [ISACA — objetivos DSS02 y DSS04 de COBIT 2019](https://www.isaca.org/resources/news-and-trends/industry-news/2020/evaluating-business-service-continuity-and-availability-using-cobit-2019).
- [Comité ISO/IEC JTC 1/SC 27 — controles 5.24 a 5.28](https://committee.iso.org/files/live/sites/jtc1sc27/files/resources/Journal%202025.pdf) e [ISO — ISO/IEC 27035-1:2023](https://www.iso.org/standard/78973.html).
- [BCU — Guía de estándares mínimos de gestión de seguridad de la información](https://www.bcu.gub.uy/Servicios-Financieros-SSF/Documents/guia%20emg%20seguridad%20de%20la%20informacion.pdf).
- [IMPO — Ley 19.670, art. 38](https://www.impo.com.uy/bases/leyes/19670-2018/38) y [Decreto 64/020, arts. 3 y 4](https://www.impo.com.uy/bases/decretos/64-2020).
