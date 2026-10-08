# Plan de continuidad y recuperación del Sistema RSI

Este plan indica cómo recuperar el propio Sistema RSI ante una interrupción o pérdida de información. Incluye frontend y Nginx, backend, PostgreSQL, datos, auditoría, código, configuración y secretos. No establece planes de continuidad para las organizaciones registradas en la aplicación.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Proteger y Recuperar | Proteger las copias y recuperar el servicio. |
| COBIT 2019 | DSS04 | Organizar la continuidad. |
| ISO/IEC 27001:2022 | A.5.29, A.5.30, A.8.13 y A.8.14 | Seguridad durante interrupciones, respaldos y disponibilidad. |
| ISO 22301 | Continuidad | Definir responsabilidades y ejercicios de recuperación. |
| BCU | Continuidad y respaldos | Referencia para proteger copias y comprobar su restauración. |
| Protección de datos personales | Ley 18.331 | Restringir el acceso a los datos y respaldos. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-BCP-06 |
| Versión | 1.2 |
| Responsable | RSI o responsable de seguridad designado |
| Fecha | 08/10/2026 |

## 1. Estado actual y objetivos

Docker Compose define frontend con Nginx, backend y PostgreSQL. La aplicación utiliza HTTPS; Nginx se comunica con el backend por la red interna de Docker. Los datos se conservan en el volumen `postgres_data`.

**El volumen Docker es almacenamiento operativo, no un respaldo.** Una falla del disco o del equipo puede afectar todos los servicios y sus datos.

Se realizó una copia manual local antes de cifrar las semillas TOTP. No se dispone de respaldo automático diario, copia independiente del equipo ni una recuperación completa probada.

| Objetivo | Valor propuesto | Qué significa |
|---|---|---|
| RTO | 6 horas | Tiempo objetivo para recuperar el servicio completo desde que se declara la interrupción. |
| RPO | 24 horas | Máxima antigüedad admisible de los últimos datos recuperables; requiere al menos una copia diaria válida e independiente. |

Estos valores son objetivos pendientes de comprobar, no tiempos garantizados. Si no existe una copia válida, no se puede asegurar la recuperación de los datos.

## 2. Elementos a respaldar

Las frecuencias y ubicaciones siguientes son propuestas. Las copias deben tener acceso restringido, protección adecuada y conservarse fuera del equipo donde funciona el RSI.

| Elemento | Qué conservar | Frecuencia propuesta | Ubicación |
|---|---|---|---|
| Base de datos | Esquema y datos, incluidos usuarios, semillas TOTP cifradas y auditoría. Usar `pg_dump` y registrar el formato para restaurarlo. | Diario y antes de cambios importantes. | Copia cifrada fuera del equipo. |
| Código y migraciones | Repositorio, lockfiles y commit de la versión utilizada. | En cada cambio aprobado. | Repositorio remoto y versión identificada. |
| Configuración | Compose, Dockerfiles y configuración Nginx, incluidos CSP y límites de solicitudes. | En cada cambio. | Git para archivos sin secretos. |
| Secretos | Archivos de entorno, credenciales de BD y `TOTP_ENCRYPTION_KEY`. | Al crearlos o modificarlos. | Medio protegido externo; custodiar la clave TOTP separada de la copia de BD. |
| Certificados HTTPS | Certificado y clave privada, o medios para emitir un certificado nuevo. | Al crearlos o renovarlos. | Medio protegido fuera del repositorio público. |
| Archivos de evidencia | Archivos externos a la BD que deban conservarse. Una URL registrada no respalda el archivo referido. | Cuando se incorporen o cambien. | Almacenamiento externo protegido. |

El código puede reconstruirse, pero los datos y secretos requieren sus propias copias. Perder la clave TOTP impide descifrar las semillas existentes. No reemplazarla sin volver a cifrar los datos. Un gestor de secretos externo queda como mejora futura.

Registrar fecha, versión del sistema, destino y resultado de cada respaldo. Comprobar su integridad y definir su retención. La conservación de auditoría debe contemplar el plazo solicitado en la consigna, sin depender únicamente de unas pocas copias recientes. Los respaldos anteriores al cifrado TOTP pueden contener semillas sin cifrar y deben seguir protegidos.

## 3. Prueba de restauración

El administrador ejecuta la recuperación, el responsable técnico verifica la aplicación y el RSI revisa los resultados. La prueba se realiza en un entorno aislado, sin sobrescribir la BD operativa.

1. **Preparar:** seleccionar una copia válida, registrar su fecha y preparar PostgreSQL y la aplicación con puertos y volumen independientes.
2. **Restaurar:** recuperar la copia con acceso autorizado y restaurar la BD. Usar `pg_restore` para dumps de formato personalizado o `psql` para archivos SQL. Detenerse si hay errores.
3. **Recuperar configuración:** utilizar código y migraciones compatibles, credenciales, la misma clave TOTP que protege las semillas restauradas y certificados HTTPS válidos. No publicar secretos en Git o evidencias.
4. **Verificar:** comprobar datos y relaciones, login y TOTP, permisos por unidad, auditoría, interfaz y una exportación con datos de prueba. El healthcheck de Nginx por sí solo no demuestra recuperación completa.
5. **Registrar:** medir el tiempo empleado y la antigüedad de los datos recuperados, compararlos con RTO y RPO y documentar fallos y mejoras.

Si la copia proviene de un compromiso, revocar las sesiones restauradas y tratar las credenciales afectadas antes de reabrir. Conservar evidencias sin secretos y retirar las copias temporales de prueba de forma segura.

Se propone una prueba inicial antes de usar datos reales o publicar el servicio, y repetirla tras cambios importantes. **Todavía no hay una restauración completa documentada.**

## 4. Escenarios de recuperación

| Escenario | Qué hacer | Responsable |
|---|---|---|
| Caída de frontend, Nginx o backend | Revisar logs y configuración, corregir la causa y reiniciar o reconstruir el servicio. Verificar HTTPS, interfaz, API y autenticación. | Administrador y responsable técnico. |
| Pérdida o corrupción de datos, disco o equipo | Detener las escrituras cuando corresponda, preservar lo disponible y restaurar la última copia válida en un entorno separado. Comprobar qué cambios posteriores a la copia se perdieron. | Administrador, responsable técnico y RSI. |
| Compromiso del equipo | Aislar el entorno, preservar evidencias y aplicar el procedimiento de incidentes. Recuperar en un entorno limpio desde una copia confiable, corregir la causa y revocar sesiones o renovar credenciales afectadas. | RSI coordina; administrador y responsable técnico ejecutan. |

No eliminar el volumen para resolver un fallo de arranque. Durante la interrupción se suspenden las operaciones que no puedan ejecutarse con seguridad. Reabrir después de comprobar los datos y las funciones afectadas.

La recuperación debe conservar HTTPS y el origen autorizado. Consultar [Gestión de incidentes](04-Gestion-Incidentes.md) cuando haya indicios de ataque.

## 5. Comunicación

- Quien detecta la interrupción informa al RSI y al administrador, indicando hora, síntomas y alcance conocido.
- El administrador comunica el avance técnico; el RSI coordina los avisos a los usuarios afectados y las decisiones de recuperación.
- Al restablecer el servicio, informar las comprobaciones realizadas, posibles datos perdidos y restricciones pendientes.

Los avisos son manuales y deben utilizar un canal accesible aunque el RSI esté caído. Registrar decisiones y resultados; no compartir secretos ni copias de la BD por canales sin protección. Cuando corresponda, aplicar [Notificación de incidentes](12-Notificacion-Incidentes.md).
