# Gestión de Identidades y Accesos del Sistema RSI

Este documento regula las cuentas y permisos de quienes utilizan u operan la plataforma RSI, su autenticación, sesiones y credenciales. Las organizaciones y trabajadores almacenados son datos de gestión: registrar un trabajador no le concede una cuenta ni lo convierte en administrador del sistema. El alcance es la versión local y las condiciones necesarias para habilitar acceso remoto.

## Encabezado de mapeo normativo

| Marco | Ítem | Detalle / aporte |
|---|---|---|
| MCU 5.0 | Proteger; PR.AA | Identidades, autenticación y control de acceso. |
| COBIT 2019 | DSS05 y APO13 | Administración y supervisión de usuarios y permisos. |
| ISO/IEC 27001:2022 e ISO/IEC 27002:2022 | A.5.15 a A.5.18; A.8.2 a A.8.5 | Accesos, identidades, credenciales, privilegios y autenticación segura. |
| BCU — Guía de Seguridad de la Información | Autenticación y accesos | Referencia de la consigna. El RSI no realiza transferencias financieras ni se presume una entidad supervisada. |
| Ley 18.331 | Art. 10 | Seguridad de datos personales mediante restricción de accesos. |
| Consigna del proyecto | RF-14, RF-15, RF-16 y RNF-04 | TOTP, algoritmos de hash, roles, auditoría y seguridad administrativa. |

El mapeo adapta las referencias de ejemplo al propio RSI. No se acredita certificación ni cumplimiento del perfil MCU Avanzado. Argon2/bcrypt protegen las contraseñas; TOTP aporta el segundo factor.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-IAM-09 |
| Versión | 1.3 — propuesta |
| Responsable | RSI o responsable de seguridad de la plataforma, por designar |
| Fecha | 03/10/2026 |
| Aprobación | Pendiente |
| Estado | Controles en código; validaciones operativas y revisión de accesos pendientes |
| Revisión | Antes del acceso remoto, al cambiar permisos o autenticación y anualmente tras aprobación |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 30/09/2026 | Equipo del proyecto | Redacción inicial centrada en la plataforma. |
| 1.1 | 30/09/2026 | Equipo del proyecto | Ajuste de organización del documento. |
| 1.2 | 30/09/2026 | Equipo del proyecto | Administrador inicial con Argon2id. |
| 1.3 | 03/10/2026 | Equipo del proyecto | Estructura de la plantilla, tablas y revisión de permisos, factores, secretos y cobertura de auditoría actual. |

## 1. Modelo de autenticación

El backend guarda usuarios y sesiones en PostgreSQL. El identificador aleatorio se envía en una cookie HttpOnly, Secure y SameSite=Strict; la BD conserva su hash SHA-256. La sesión vence como máximo a las dos horas y se invalida al cerrar sesión. El frontend no almacena el identificador en localStorage. Las operaciones que modifican datos, incluido login, exigen que la cabecera Origin coincida exactamente con un origen autorizado. Se rechazan solicitudes sin origen o con origen null; no se utilizan tokens CSRF.

| Factor o mecanismo | Implementación del RSI | Solicitud o intervalo | Estado |
|---|---|---|---|
| Contraseña | Argon2id por defecto o bcrypt al crear la cuenta; verificación compatible con hashes scrypt anteriores | Inicio de sesión por contraseña | Implementado en código; pruebas documentadas en `evidencias/pruebas-automatizadas-backend.md`. |
| TOTP | Secreto, URI de autenticador y confirmación de código | Login si la cuenta tiene MFA confirmado; Administrador y RSI deben configurarlo para acceder a rutas de gestión | Implementado. Semilla almacenada directamente en BD; protección adicional pendiente. |


### Política de factores según operación

| Operación | Factor mínimo aplicado actualmente | Mecanismo y límite |
|---|---|---|
| Login por contraseña | Contraseña; TOTP cuando MFA está confirmado | Antes de configurar MFA, las cuentas Administrador y RSI quedan limitadas a configuración de MFA, consulta propia y cierre de sesión. |
| Gestión de seguridad, cumplimiento y KPI por Administrador o RSI | Sesión autenticada y MFA confirmado | Los guards comprueban sesión y MFA; no solicitan un código nuevo por cada modificación. |
| Administración de usuarios | Sesión de Administrador con MFA confirmado | RSI no administra usuarios. La reautenticación específica para cambios sensibles es propuesta, no implementada. |
| Consulta ordinaria de Dueño de unidad o Lector | Sesión autenticada dentro de su ámbito | TOTP no es obligatorio para esos roles si no lo confirmaron. Lector no modifica registros de negocio. |
| Consulta de auditoría | Administrador autenticado y con MFA confirmado | RSI, Dueño de unidad y Lector no acceden a la ruta actual de auditoría. |

## 2. Gestión de identidades provisión y desprovisión

Los plazos de operación siguientes son propuestas; la API no ejecuta un circuito automático de autorizaciones ni revisiones periódicas.

| Proceso | Procedimiento | Vencimiento o momento propuesto |
|---|---|---|
| Alta de usuario | Autoridad operativa autoriza necesidad y ámbito; Administrador crea cuenta nominal con correo único, rol y vínculo cuando corresponde. Por defecto se usa LECTOR; Dueño de unidad y Lector requieren trabajador asociado. Registrar la autorización fuera de la lista de cuentas. | Antes del primer acceso; no habilitar hasta confirmar vínculo y autorización. |
| Modificación de rol o vínculo | Comprobar solicitud, necesidad y nuevo ámbito; Administrador actualiza. El cambio de rol, vínculo o estado revoca las sesiones de la cuenta dentro de la misma transacción y registra `USER_UPDATE`. | Antes de ejercer la nueva función; cambio urgente ante privilegios incorrectos. |
| Baja | Desactivar la cuenta con `activo=false`; las comprobaciones de sesión rechazan usuarios inactivos. La desactivación revoca sus sesiones; la recuperación de factores sigue pendiente. | Al cesar la autorización; de inmediato ante compromiso confirmado. |
| Revisión de accesos | Revisar usuarios, roles, vínculos y necesidad con la autoridad operativa; reducir o desactivar lo innecesario y documentar resultado. | Inicial antes de publicación; mensual durante puesta en marcha y ante cambios relevantes. |
| Recuperación de factor o cuenta | Verificar identidad mediante procedimiento autorizado y registrar aprobación y acciones. Implementar recuperación y revocación sin eludir MFA. | Antes de necesitar el flujo; PT12 propone validación para 24/10/2026. |

## 3. Registro de accesos actas

La siguiente matriz refleja los roles en código; **no es un acta firmada ni un inventario de cuentas reales**. Las altas, bajas y revisiones nominales se conservarán en un medio restringido, con cuenta, motivo, aprobador, fecha y resultado.

| Usuario o perfil | Rol | Recursos accesibles | Fecha alta | Fecha baja | Revisión |
|---|---|---|---|---|---|
| Cuentas administrativas de la plataforma | ADMINISTRADOR | Gestión completa, usuarios y auditoría; exige MFA confirmado | Por registrar por cuenta | Por registrar cuando corresponda | Pendiente de acta nominal y justificación de privilegios. |
| Cuentas de gestión de seguridad | RSI | Gestión de seguridad y cumplimiento, búsqueda y KPI; sin administración de usuarios ni auditoría | Por registrar por cuenta | Por registrar cuando corresponda | Pendiente de autorización nominal. |
| Cuentas con responsabilidad de unidad | DUENO_UNIDAD | Gestión limitada por organización/unidad del trabajador vinculado; sin búsqueda global, KPI, usuarios ni auditoría | Por registrar por cuenta | Por registrar cuando corresponda | Comprobar vínculo, rol y alcance efectivo. |
| Cuentas de consulta | LECTOR | Lectura dentro de su ámbito; factores propios y logout; sin escritura de negocio, KPI, búsqueda global, usuarios ni auditoría | Por registrar por cuenta | Por registrar cuando corresponda | Confirmar necesidad de acceso y restricción de escritura. |

La protección efectiva se aplica en backend con `AuthGuard`, `RolesGuard`, `ReadOnlyGuard`, `UnitScopeGuard` y filtros de servicios. Ocultar menús en frontend no sustituye autorización. Las pruebas deben abarcar identificadores directos, relaciones y exportaciones entre organizaciones y unidades.

## 4. Gestión de secretos y credenciales

| Credencial | Protección actual | Medida pendiente o regla de operación |
|---|---|---|
| Contraseñas de usuarios | Hash Argon2id/bcrypt; compatibilidad scrypt | No compartir cuentas ni publicar hashes; registrar cambios y recuperación de cuenta cuando se implemente el flujo. |
| Sesión | Hash SHA-256 en BD; cookie HttpOnly, Secure y SameSite=Strict; duración máxima de dos horas | Origen autorizado en escrituras, CSP en Nginx y revocación propia o por Administrador. |
| Semilla TOTP | Campo `mfaSecret` almacenado directamente en Usuario | Cifrar con clave custodiada fuera de BD y respaldos, restringir permisos y probar recuperación; PT03. No afirmar cifrado ya implementado. |
| Credenciales de PostgreSQL y configuración | Variables y archivos `.env` excluidos de Git | Custodiar copia cifrada independiente, restringir acceso, rotar ante exposición y no registrar valores en logs. |
| Transporte y origen | HTTPS local mediante Nginx; certificado autofirmado de laboratorio | Para acceso remoto, HTTPS y origen exacto antes de habilitarlo; no publicar directamente BD o backend. |

## 5. Política de contraseñas por sistema

| Sistema o tipo | Regla de generación | Longitud | Complejidad | Ciclo de cambio |
|---|---|---|---|---|
| Cuenta RSI con Argon2id | Validación de longitud al crearla; Argon2id predeterminado | Entre 12 y 1024 caracteres | No hay regex de mayúsculas/símbolos obligatoria; proponer frase robusta y exclusiva | No hay autoservicio o rotación periódica implementados; cambiar ante compromiso mediante flujo autorizado que se implemente. |
| Cuenta RSI con bcrypt | Seleccionado por Administrador al alta; bcrypt con coste 12 | Entre 12 y 1024 caracteres y como máximo 72 bytes UTF-8 | No usar el límite de caracteres para omitir el límite de bytes | Misma condición de recuperación; no se declara cambio automático. |
| Administrador inicial | Script `crear-admin.mjs`, Argon2id | Comprobar validación del script y suministrar secreto robusto fuera del repositorio | No reutilizar credencial entre entornos | Revisar custodia al preparar el entorno; rotar ante exposición. |
| PostgreSQL | Variables del despliegue; no se demuestra una política de longitud en código | Política del operador por aprobar | Secreto aleatorio y distinto por entorno, como regla propuesta | Rotación controlada y validada ante exposición o cambio de custodia; no automatizada. |

No existe contraseña maestra ni gestor de contraseñas dentro del RSI. No se incorpora a este documento ese caso del ejemplo.

## 6. Registro de autenticaciones auditoría

| Evento | Registro existente | Límite o acción pendiente |
|---|---|---|
| Login con contraseña | `LOGIN` exitoso o fallido; correo o actor según resultado | Rechazos tempranos por formato/longitud no generan el mismo evento; completar cobertura. |
| TOTP en login y alta confirmada | `MFA_FAILURE` y `MFA_ENABLED` | No se acredita evento específico para todos los rechazos de confirmación, inicio de alta o recuperación. |
| Cambio de usuario y cierre de sesión | `USER_UPDATE`, `LOGOUT` y `SESSION_REVOKE` | Incorporar cambios previos/nuevos de permisos sin secretos; alta de usuario sin evento explícito en el flujo revisado. |
| Cambios de gestión y exportaciones | Interceptor común y `AuditEvent`; transacción compartida con operaciones cubiertas de gestión | No equivalen a auditar cada lectura, 401/403 ni operación directa en BD. |
| Centralización y alertas | Pendientes | `07-Monitoreo-Logs-SIEM.md` propone reglas de fallos de login, MFA y cambios sensibles. No hay envío SIEM ni alertas automáticas acreditados. |

La ruta de auditoría es exclusiva de Administrador, con filtros por entidad/usuario y páginas de 50 eventos. La retención anual de cambios requiere capacidad, copia independiente y recuperación probada. Las pruebas históricas de hashes, desafíos y permisos no sustituyen las pruebas de recuperación y revisión de accesos.

## Mejora futura

La incorporación de passkeys/WebAuthn y Windows Hello queda como mejora futura. Sus servicios y rutas fueron retirados; el acceso actual utiliza contraseña y TOTP.
Se considera una mejora futura, sin compromiso de implementación en esta entrega.

## Protección de sesiones

En Seguridad de cuenta se pueden cerrar todas las sesiones propias. Administrador puede cerrar las de una cuenta desde Usuarios. Los cambios de rol, vínculo o estado invalidan sus sesiones automáticamente. La CSP de Nginx permite scripts del propio origen y bloquea scripts inline, eval y objetos embebidos; permite estilos inline utilizados por la interfaz.

Pruebas y límites: [Evidencia de sesiones](./evidencias/sesiones-cookie-csrf.md).
