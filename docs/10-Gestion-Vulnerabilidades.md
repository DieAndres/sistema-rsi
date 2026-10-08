# Gestión de vulnerabilidades del Sistema RSI

Este procedimiento indica cómo identificar y corregir debilidades del propio Sistema RSI: frontend, API, autenticación, PostgreSQL, dependencias, Docker y Nginx. Las vulnerabilidades que las organizaciones registran sobre sus activos son datos de la aplicación y no hallazgos de esta plataforma.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Identificar y Proteger | Identificar debilidades y reducir riesgos. |
| COBIT 2019 | APO12 y DSS05 | Priorizar riesgos y correcciones. |
| ISO/IEC 27001:2022 | A.8.8 | Gestionar vulnerabilidades técnicas. |
| BCU | Vulnerabilidades y parches | Referencia para revisión y actualización. |
| Protección de datos personales | Ley 18.331 | Proteger información frente a fallos de seguridad. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-VUL-10 |
| Versión | 1.2 |
| Responsable | RSI coordina; responsable técnico y administrador ejecutan |
| Fecha | 08/10/2026 |

## 1. Herramientas y comprobaciones

| Método | Uso | Estado |
|---|---|---|
| Revisión de código y configuración | Detectar controles ausentes y limitaciones. | Utilizada; no equivale a una prueba completa de penetración. |
| Jest y pruebas de API | Comprobar controles y rechazo de operaciones no autorizadas. | Pruebas disponibles con resultados documentados. |
| npm audit | Detectar vulnerabilidades conocidas en dependencias del backend y frontend. | Configurado en el hook pre-push; bloquea el push ante hallazgos altos o críticos o si falla el análisis. |
| Análisis de imágenes Docker | Revisar vulnerabilidades de las imágenes utilizadas. | Pendiente de ejecución y documentación. |

El hook requiere activar `.githooks` en cada clon y se puede omitir; no sustituye un control obligatorio en CI. Detectar un aviso con npm audit no corrige la dependencia: debe revisarse su aplicabilidad y actualizarse cuando corresponda.

Las pruebas activas se realizan sobre un entorno autorizado, preferentemente aislado, con datos de prueba. No se prueban los sistemas de las organizaciones registradas en la aplicación.

## 2. Registro de hallazgos

Estas observaciones provienen de revisión y pruebas del proyecto. No representan un inventario completo de vulnerabilidades ni ataques demostrados.

| ID | Descripción | Estado | Responsable | Evidencia o comprobación |
|---|---|---|---|---|
| V-RSI-01 | Semillas TOTP anteriormente almacenadas sin cifrado de aplicación. | Corregida en código y BD local con AES-256-GCM. Custodia y recuperación de la clave siguen requiriendo protección. | Responsable técnico y administrador. | [Cifrado TOTP](evidencias/cifrado-totp.md). |
| V-RSI-02 | Identificador de sesión anteriormente guardado en localStorage y accesible a JavaScript. | Corregida mediante cookie HttpOnly, Secure y SameSite=Strict. La revisión específica de prevención de XSS sigue pendiente. | Responsable técnico. | [Pruebas del backend](evidencias/pruebas-automatizadas-backend.md). |
| V-RSI-03 | Falta de respaldo automático independiente y restauración completa probada. | Pendiente. La copia manual local y el volumen Docker no cubren la pérdida del equipo. | Administrador. | [Plan de continuidad](06-Plan-Continuidad.md); comprobar copia externa y restauración. |
| V-RSI-04 | Cobertura incompleta de auditoría: alta de usuarios y algunos rechazos tempranos de autenticación sin evento específico. | Pendiente de ampliar y verificar. Existen eventos de cambios de usuarios y gestión, pero no se registra toda solicitud. | Responsable técnico y RSI. | [Monitoreo y logs](07-Monitoreo-Logs.md); probar cada flujo pendiente. |

HTTPS ya está configurado mediante Nginx. También se configuraron y probaron límites de solicitudes en un entorno aislado; su activación depende de desplegar la configuración actualizada. Estos controles no sustituyen la revisión de permisos, dependencias e imágenes.

Registrar cada nuevo hallazgo con versión evaluada, descripción, componente afectado, evidencia, prioridad, responsable y resultado de la corrección. No copiar secretos ni datos personales innecesarios en el expediente público.

## 3. Prioridad de corrección

La prioridad considera impacto, alcance y exposición real. Los siguientes criterios orientan la respuesta; no son plazos automáticos implementados.

| Prioridad | Criterio | Acción |
|---|---|---|
| Crítica | Compromiso activo o exposición extensa de datos o privilegios. | Contener inmediatamente y corregir o aislar el componente afectado. |
| Alta | Posibilidad de acceso no autorizado a cuentas privilegiadas o datos restringidos. | Atender antes de ampliar la exposición del servicio. |
| Media | Debilidad de alcance limitado que necesita tratamiento. | Programar la corrección y aplicar medidas temporales si corresponde. |
| Baja | Impacto reducido en el contexto evaluado. | Incorporar al mantenimiento y revisar si cambia su alcance. |

No asignar una gravedad solo por el nombre de una herramienta o por una sospecha. Ante indicios de compromiso, aplicar [Gestión de incidentes](04-Gestion-Incidentes.md).

## 4. Procedimiento de corrección

1. **Registrar:** describir el hallazgo, la versión y el componente afectado.
2. **Comprobar:** reproducirlo de forma controlada o verificar que la versión y configuración sean aplicables.
3. **Priorizar:** evaluar impacto y exposición, asignar responsable y acordar cuándo corregirlo.
4. **Corregir:** actualizar código, dependencia o configuración. Respaldar antes de cambios que puedan afectar datos y probar en un entorno separado.
5. **Volver a probar:** repetir la comprobación y verificar que las funciones necesarias sigan operativas.
6. **Cerrar:** registrar resultado y evidencia. Si queda pendiente, documentar motivo y medidas temporales.

Una actualización no se considera una corrección comprobada solo porque compile o cambie el estado del registro. Revisar los hallazgos antes de cada entrega y después de cambios importantes.

## 5. Falsos positivos

Un falso positivo es un aviso que no corresponde a una vulnerabilidad aplicable al sistema evaluado. Para descartarlo debe existir una explicación verificable, como una versión no afectada o una función vulnerable que no se utiliza y no es alcanzable en ese entorno.

Registrar la justificación y la revisión del RSI. Corregir una vulnerabilidad real o aceptar temporalmente un riesgo no lo convierte en falso positivo. No se documentan falsos positivos confirmados en este registro.
