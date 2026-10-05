# Notificación de Incidentes del Sistema RSI

Este documento establece cómo preparar, evaluar y registrar comunicaciones sobre incidentes que afecten al **propio Sistema de Gestión Integrada para el RSI**: aplicación web, API, identidad, PostgreSQL, datos, auditoría, configuración y disponibilidad. Los incidentes cargados por organizaciones usuarias son datos gestionados por la plataforma y no activan automáticamente una notificación externa del operador del RSI.

No consta un incidente real de la plataforma ni una notificación enviada en este expediente. Los formularios indican el contenido que corresponde al proyecto y las decisiones pendientes, sin inventar fechas de incidentes, personas afectadas, contactos o envíos. No existe envío automático a BCU, URCDP ni titulares.

## Encabezado de mapeo normativo

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| MCU 5.0 | Responder y comunicación de incidentes | Coordinar evaluación, destinatarios, mensajes y registro del propio operador. |
| COBIT 2019 | DSS02 y MEA01 | Escalamiento, control del proceso y revisión de comunicaciones. |
| ISO/IEC 27001:2022 | A.5.26 y A.5.27; vínculo con A.5.5 y A.5.28 | Respuesta, aprendizaje, contacto con autoridades y preservación de evidencia. |
| BCU — Guía de Seguridad de la Información | Reporte de incidentes relevantes cuando resulte aplicable | La condición de entidad supervisada y sus obligaciones deben verificarse; usar el RSI no convierte al operador en institución financiera. |
| Ley 18.331 y Ley 19.670 | Protección de datos y responsabilidad ante vulneraciones | Identificar al responsable y encargado del tratamiento según la operación real. |
| Decreto 64/020 | Artículos 3 y 4 | Inicio de medidas de minimización, comunicación a URCDP, al responsable por el encargado y a titulares en los supuestos previstos. |

Se corrige la referencia del ejemplo al artículo 20 de la Ley 18.331 y al Decreto 414/009 como fundamento específico del reporte: para este procedimiento de vulneraciones se utilizan los artículos 3 y 4 del Decreto 64/020. El documento no acredita cumplimiento regulatorio ni una notificación efectuada.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-NOT-12 |
| Versión | 1.0 — propuesta |
| Responsable | RSI coordina; responsable del tratamiento y autoridad operativa deben identificarse |
| Fecha | 03/10/2026 |
| Estado | Procedimiento y formularios preparados; contactos, canal institucional y simulacro pendientes |
| Aprobación | Pendiente |
| Revisión | Antes de operar con datos reales, ante cambios de obligaciones y después de un incidente o ejercicio |
| Documentos relacionados | `04-Gestion-Incidentes.md`, `06-Plan-Continuidad.md`, `07-Monitoreo-Logs-SIEM.md` y `09-gestion-accesos.md` |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 03/10/2026 | Equipo del proyecto | Procedimiento inicial centrado en la plataforma, formularios BCU/URCDP y registro de comunicaciones, con referencias de plazos verificadas. |

## 1. Instrucciones de llenado

Usar un expediente por incidente de la plataforma, con identificador operativo propio. Registrar hora UTC y la hora local de Uruguay con zona `America/Montevideo`; para las fechas de este documento el desfase es UTC−3. Distinguir ocurrencia estimada, detección, conocimiento de la vulneración y envío: no son el mismo momento. Si una hora o alcance se desconoce, identificarlo como estimado o pendiente, sin fabricar precisión.

| Paso | Acción del operador del RSI | Registro necesario |
|---|---|---|
| 1 | Recibir y evaluar el evento, identificar si afecta al RSI y abrir expediente conforme a gestión de incidentes | Fuente, síntomas, componente, fecha de detección y hechos conocidos; no confundir un registro demo con un incidente real. |
| 2 | Determinar qué información y personas pueden estar afectadas y quién actúa como responsable o encargado del tratamiento | Datos afectados, alcance conocido, contratos o decisiones operativas y responsable de evaluación. No derivar responsabilidades legales del rol técnico de la app. |
| 3 | Iniciar contención y reducción del impacto, preservando evidencia | Acciones, autor, hora y efecto; no esperar el cierre de la investigación para empezar a minimizar el daño. |
| 4 | Evaluar comunicaciones internas, a responsable, autoridades y titulares; comprobar obligaciones del operador | Decisión, fundamento, destinatario, plazo aplicable, persona que autoriza y canal oficial verificado. |
| 5 | Preparar el formulario con hechos conocidos y limitaciones, revisar contenido y enviar cuando corresponda | Copia exacta del mensaje aprobado, adjuntos mínimos, hora de envío y comprobante de recepción. |
| 6 | Actualizar alcance y medidas y elaborar informe de cierre tras resolver la vulneración | Versiones del reporte, respuestas recibidas, informe final y acciones de mejora. |

Si se constata un incidente que afecte datos personales, deben iniciarse procedimientos para minimizar su impacto dentro de las primeras **24 horas** conforme al [artículo 3 del Decreto 64/020](https://www.impo.com.uy/bases/decretos/64-2020/3). El responsable comunica a URCDP dentro de **72 horas de conocida la vulneración**; si la conoce el encargado, la comunica inmediatamente al responsable. La comunicación a titulares procede ante afectación significativa de sus derechos, y tras resolver la vulneración corresponde informar las medidas adoptadas a URCDP, según el [artículo 4](https://www.impo.com.uy/bases/decretos/64-2020/4). La evaluación de riesgo para titulares no sustituye la obligación de comunicación a URCDP cuando se configura el supuesto del artículo 4.

La evidencia original debe conservarse en un medio protegido fuera del repositorio público, con custodia, origen, fecha e integridad. En `docs/evidencias/` solo incorporar material de prueba o versiones sanitizadas. No adjuntar copias completas de BD, semillas TOTP, tokens, contraseñas ni datos personales innecesarios. Los formularios son instrumentos de preparación: antes de enviar, verificar el canal oficial y formato exigido en la fecha del incidente.

## 2. Formulario de notificación al BCU incidentes relevantes

Para el entorno académico local no se acredita una institución financiera operadora ni obligación de reporte BCU. Este formulario se activa si el RSI se utiliza dentro de una entidad sujeta a esa obligación y la institución determina que el incidente es reportable. No se fija un plazo BCU inventado o tomado del ejemplo; la entidad debe identificar su requisito vigente y canal.

| Campo | Contenido del formulario para el RSI |
|---|---|
| ID del incidente | Identificador del expediente de la plataforma; pendiente de un caso real. |
| Fecha y hora del incidente UTC y local | Registrar ocurrencia cierta o estimada con zona; no hay fecha de incidente en esta versión. |
| Fecha y hora de detección UTC y local | Obtener del primer reporte o evento verificable; conservar la fuente. |
| Fecha y hora de conocimiento | Registrar cuándo la autoridad institucional conoce el hecho y qué obligación de reporte corresponde. |
| Institución financiera | No identificada en el alcance actual. Completar razón social y persona responsable solo si resulta aplicable. |
| Tipo de incidente | Clasificar el hecho comprobado: indisponibilidad del RSI, acceso indebido, alteración, divulgación, pérdida de datos o compromiso del anfitrión. No se selecciona tipo sin incidente. |
| Sistemas afectados | Identificar componentes propios mediante RSI-A01 a RSI-A10 y dependencia física si corresponde; no listar automáticamente los activos de organizaciones cargados en la BD. |
| Datos afectados | Identificar cuentas, registros de personas, registros de gestión, credenciales o auditoría efectivamente afectados y el alcance conocido. |
| Impacto estimado | Duración de indisponibilidad, pérdida desde último respaldo, ámbitos y registros afectados; indicar medición o estimación y qué sigue en investigación. |
| Acciones de contención | Acciones realmente ejecutadas, responsables y horas: aislamiento, restricción de acceso, revocación, preservación o recuperación según el caso. |
| Estado actual | Estado del expediente real: en evaluación, contenido, recuperación o cerrado; sin caso identificado en esta versión. |
| Contacto de reporte | Persona institucional autorizada, teléfono y correo; por designar antes de operación aplicable. El usuario Administrador no es automáticamente el contacto regulatorio. |
| Plazo aplicable y cumplimiento | Documentar norma o requerimiento institucional vigente, hora límite, hora de envío y resultado; no determinado para el alcance actual. |
| Canal y comprobante | Canal oficial validado por la institución y constancia real de envío y recepción; sin envío efectuado. |

## 3. Formulario de notificación a la URCDP violación de datos personales

El responsable del tratamiento debe identificarse según quien determine finalidad y condiciones de tratamiento en la operación real. Si el operador RSI actúa como encargado, comunica inmediatamente al responsable para que este cumpla su obligación. El expediente debe distinguir datos realmente afectados de simples categorías existentes en el esquema.

| Campo | Contenido del formulario para el RSI |
|---|---|
| ID del incidente | Referencia al expediente real de la plataforma; no existe caso identificado en esta versión. |
| Responsable del tratamiento | Entidad o persona responsable y su identificación; pendiente de determinar para un despliegue con datos reales. No usar como sustituto el rol RSI o Administrador de la app. |
| Encargado del tratamiento si aplica | Operador contratado y vínculo con el responsable; no se acredita contrato ni encargado formal en este entorno. |
| Fecha del incidente | Fecha y hora cierta o estimada, UTC y local; documentar incertidumbre. |
| Detección y conocimiento de la vulneración | Horas separadas y persona que conoce el hecho; necesarias para comprobar actuaciones y plazo. |
| Descripción clara y completa | Explicar cómo se afectó la plataforma, lo confirmado, el período conocido y lo que sigue bajo investigación, sin divulgar instrucciones o secretos innecesarios. |
| Categoría de datos personales afectados | Si el hecho los alcanza: nombres, cargos, correos, cuentas, vínculos de trabajadores y metadatos de auditoría. Determinar categorías reales antes de afirmar afectación. |
| Información de autenticación afectada | Precisar posible acceso a hashes, semillas TOTP o sesiones, cuando la evidencia lo sustente, sin adjuntar sus valores. La biometría y PIN de Windows Hello no se reciben ni almacenan en el flujo RSI observado. |
| Número de personas afectadas | Calcular desde el alcance verificado, evitando contar tablas o registros como personas únicas; indicar cantidad estimada si no hay certeza. No medido porque no hay caso. |
| Riesgos para afectados | Evaluar divulgación de información personal, suplantación, pérdida o alteración de registros y otros perjuicios según los datos y hechos del caso. |
| Medidas de minimización | Acciones y horas comprobadas; verificar inicio de procedimientos dentro de las primeras 24 horas de constatado el incidente de datos personales. |
| Comunicación al responsable por el encargado | Fecha, hora, canal y comprobante si el operador actúa como encargado; no corresponde inventar ese vínculo. |
| Notificación a titulares | Evaluar afectación significativa de derechos; describir comunicación clara, destinatarios, canal, medidas recomendadas y fecha real o plan pendiente. |
| Contacto y responsable del informe | Persona autorizada por el responsable del tratamiento, con datos de contacto seguros; por designar. |
| Comunicación a URCDP | Fecha de conocimiento, límite de 72 horas, hora real de envío, canal oficial y comprobante; pendientes de un caso real. |
| Informe posterior a la solución | Describir causa comprobada, alcance final, cronología, medidas y mejoras; registrar comunicación de ese informe a URCDP conforme al artículo 4. |

### Criterios de decisión de notificación a la URCDP

| Pregunta | Decisión y evidencia requerida |
|---|---|
| ¿El evento afecta la plataforma o solo es un incidente registrado por una organización? | Abrir expediente del RSI solo cuando hay hechos sobre la plataforma. Un registro de negocio no prueba la vulneración del operador. |
| ¿Se constata divulgación, pérdida, destrucción, alteración o acceso no autorizado a datos personales? | Aplicar medidas de minimización y procedimiento de comunicación; registrar evidencia y momento de conocimiento. No limitar la evaluación a fugas de datos. |
| ¿El operador actúa como responsable o encargado? | Identificar el vínculo real. Si es encargado, comunicar inmediatamente al responsable; conservar prueba. |
| ¿Se configura una vulneración que incida en la protección de datos? | El responsable aplica el plazo de comunicación a URCDP del artículo 4. La información aún incompleta debe distinguirse de hechos confirmados; no postergar el procedimiento hasta recuperar el sistema. |
| ¿Hay afectación significativa de derechos de titulares? | Evaluar y documentar la comunicación clara a las personas afectadas, diferenciándola de la comunicación a URCDP. |
| ¿Se descarta afectación de datos personales? | Conservar fundamento técnico, alcance revisado, responsable y fecha; continuar la gestión interna del incidente si afecta disponibilidad o integridad del RSI. |

## 4. Registro de notificaciones enviadas

| ID incidente | Autoridad o destinatario | Fecha de envío UTC y local | Canal | Estado respuesta | Responsable |
|---|---|---|---|---|---|
| Sin caso real documentado | No hay notificación acreditada a BCU, URCDP, responsable ni titulares | No aplica; no se registró envío | Sin envío | No corresponde afirmar recepción o respuesta | Pendiente de designación para operación real |

Por cada envío efectivo se incorporará una fila con destinatario, mensaje aprobado, comprobante, respuesta y referencia al expediente protegido. Las simulaciones futuras deben identificarse expresamente y no registrarse como comunicaciones reales. No hay un simulacro completo acreditado en esta versión.
