# Notificación de incidentes del Sistema RSI

Este procedimiento indica cómo evaluar, preparar y registrar comunicaciones sobre incidentes del propio Sistema RSI. Un incidente de una organización cargado en la aplicación no activa automáticamente una notificación del operador de la plataforma.

Las notificaciones son manuales. No hay envío automático a autoridades o personas afectadas, ni una notificación real documentada en este expediente.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Responder | Coordinar la comunicación de incidentes. |
| COBIT 2019 | DSS02 y MEA01 | Gestionar comunicaciones y revisar resultados. |
| ISO/IEC 27001:2022 | A.5.5, A.5.26 a A.5.28 | Contactos, respuesta y evidencias. |
| BCU | Reporte de incidentes cuando corresponda | Evaluar obligaciones de una entidad supervisada. |
| Protección de datos personales | Ley 18.331, Ley 19.670 y Decreto 64/020 | Identificar responsables y comunicar vulneraciones. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-NOT-12 |
| Versión | 1.1 |
| Responsable | RSI coordina; responsable del tratamiento autoriza las comunicaciones que le corresponden |
| Fecha | 08/10/2026 |

## 1. Procedimiento

1. **Evaluar:** confirmar si el evento afecta a la plataforma, abrir el caso y determinar componentes, datos y personas potencialmente afectados. Seguir [Gestión de incidentes](04-Gestion-Incidentes.md) e iniciar contención sin esperar el cierre de la investigación.
2. **Determinar destinatarios:** identificar al operador, al responsable del tratamiento y al encargado cuando corresponda. El rol RSI o Administrador de la aplicación no determina por sí solo esas responsabilidades.
3. **Preparar:** completar la plantilla con hechos conocidos, medidas y límites de la información. Distinguir datos confirmados, estimados y pendientes.
4. **Enviar:** revisar y autorizar el mensaje, comprobar el canal y formato oficial vigentes y comunicar dentro del plazo aplicable.
5. **Registrar y actualizar:** conservar mensaje, comprobante y respuestas. Comunicar cambios relevantes y preparar el informe posterior a la solución cuando corresponda.

Registrar por separado ocurrencia, detección, conocimiento y envío, indicando zona horaria. No inventar precisión si una fecha o alcance se desconoce.

## 2. Destinatarios y criterios

| Destinatario | Cuándo corresponde | Momento o plazo |
|---|---|---|
| RSI y administrador | Evento o incidente del propio sistema. | Al detectarlo; escalar inmediatamente si es crítico o alto. |
| Responsable del tratamiento | El encargado conoce una vulneración de datos personales. | Comunicar de inmediato. |
| URCDP | El responsable constata una vulneración que incide en la protección de datos. | Máximo 72 horas desde que conoce la vulneración. |
| Personas afectadas | La vulneración provoca una afectación significativa de sus derechos. | Comunicación clara y sencilla según la evaluación del caso. |
| BCU | La institución operadora está sujeta a una obligación de reporte y el incidente resulta reportable. | Verificar el plazo y canal aplicables a esa entidad; no se presume obligación por usar RSI. |

Ante un incidente que afecte datos personales, el responsable y el encargado deben iniciar los procedimientos para minimizar su impacto dentro de las primeras 24 horas de constatado. Ese plazo corresponde a iniciar medidas, no al envío a URCDP. Referencia: [Decreto 64/020, artículo 3](https://www.impo.com.uy/bases/decretos/64-2020/3).

La comunicación a URCDP, el aviso inmediato del encargado al responsable y la comunicación a titulares con afectación significativa se regulan en el [artículo 4](https://www.impo.com.uy/bases/decretos/64-2020/4). Una vez solucionada la vulneración, el responsable debe elaborar y comunicar a URCDP un informe detallado de lo ocurrido y las medidas adoptadas. No esperar la recuperación completa para iniciar el procedimiento de comunicación.

Si se descarta afectación de datos personales, registrar el fundamento y continuar la gestión interna del incidente cuando corresponda. Los contactos y canales institucionales deben definirse antes de operar con datos reales.

## 3. Plantilla de comunicación

Esta plantilla sirve para preparar la información; no sustituye un formulario oficial exigido por el destinatario.

| Campo | Qué completar |
|---|---|
| Incidente | Identificador y descripción clara del caso. |
| Responsable y contacto | Operador, responsable del tratamiento o institución y persona autorizada para informar. |
| Fechas | Ocurrencia cierta o estimada, detección, conocimiento y envío, con zona horaria. |
| Componentes y alcance | Elementos afectados: frontend, API, autenticación, PostgreSQL, auditoría, configuración o Nginx/TLS. Usar el inventario RSI-A01 a RSI-A11 cuando corresponda. |
| Datos y personas afectadas | Categorías de datos y cantidad comprobada o estimada de personas; no confundir registros con personas únicas. |
| Impacto | Consecuencias conocidas o posibles y aspectos que siguen en investigación. |
| Medidas y estado | Contención, corrección y recuperación realizadas, con responsables y fechas. |
| Destinatario y plazo | A quién se comunica, fundamento, plazo aplicable y canal verificado. |

No adjuntar copias completas de la BD, contraseñas, hashes, cookies de sesión, semillas o códigos TOTP ni claves. Incluir únicamente los datos necesarios para la comunicación.

## 4. Registro y conservación

Por cada comunicación efectiva, conservar:

- Identificador del incidente y destinatario.
- Mensaje aprobado y adjuntos necesarios.
- Fecha, canal, persona que autoriza y persona que envía.
- Comprobante de envío o recepción y respuestas recibidas.
- Actualizaciones e informe final cuando corresponda.

Guardar originales y evidencias en un medio protegido con acceso restringido. En el repositorio público utilizar solamente datos de prueba o versiones sin información sensible.

Las simulaciones deben identificarse como tales. Los formularios preparados no demuestran un envío real; todavía no hay un simulacro completo documentado de notificación.
