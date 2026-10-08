# Gestión de identidades y accesos del Sistema RSI

Este documento define cómo se administran las cuentas, permisos, autenticación y sesiones del propio Sistema RSI. Registrar una organización o un trabajador no crea automáticamente una cuenta de acceso.

## Mapeo normativo

| Marco | Referencia | Aporte |
|---|---|---|
| MCU 5.0 | Proteger; PR.AA | Identidades, autenticación y permisos. |
| COBIT 2019 | DSS05 y APO13 | Administración y revisión de accesos. |
| ISO/IEC 27001:2022 | A.5.15 a A.5.18 y A.8.2 a A.8.5 | Cuentas, credenciales y privilegios. |
| BCU | Autenticación y accesos | Referencia para controles de acceso. |
| Protección de datos personales | Ley 18.331 | Restringir el acceso a información personal. |
| Consigna | RF-14 a RF-16 y RNF-04 | Autenticación, roles, auditoría y seguridad administrativa. |

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-IAM-09 |
| Versión | 1.4 |
| Responsable | RSI o responsable de seguridad designado |
| Fecha | 08/10/2026 |

## 1. Autenticación

El acceso utiliza correo y contraseña. Las contraseñas se guardan como hashes Argon2id por defecto o bcrypt, según la opción elegida al crear la cuenta. Se mantiene compatibilidad de verificación con hashes scrypt anteriores.

TOTP agrega un código temporal generado por una aplicación autenticadora. Administrador y RSI deben configurar y confirmar MFA para utilizar las rutas de gestión. Mientras no lo confirmen, su acceso queda limitado a las operaciones habilitadas para completar MFA, consultar su cuenta y cerrar o revocar sesiones. Para los demás roles, MFA es opcional; una vez confirmado, se exige en el login.

Las semillas TOTP se guardan cifradas con AES-256-GCM. El backend utiliza `TOTP_ENCRYPTION_KEY` para descifrarlas al configurar o verificar el factor.

Nginx tiene configurados límites por IP para login, confirmación TOTP y API. El exceso responde 429. Solo se aplican al tráfico que pasa por ese proxy; no representan un bloqueo por cuenta. Su activación depende de desplegar la configuración actualizada.

## 2. Roles y permisos

| Rol | Acceso |
|---|---|
| ADMINISTRADOR | Gestión completa, administración de usuarios y consulta de auditoría. Requiere MFA confirmado para las rutas de gestión. |
| RSI | Gestión de seguridad y cumplimiento, búsqueda y KPI. Sin administración de usuarios ni consulta directa de auditoría. Requiere MFA confirmado para gestión. |
| DUENO_UNIDAD | Gestión dentro del ámbito permitido del trabajador vinculado. Sin administración de usuarios, auditoría, búsqueda global ni KPI. |
| LECTOR | Consulta dentro de su ámbito, sin modificar registros de negocio. Puede configurar su MFA y cerrar o revocar sus propias sesiones. |

Los permisos se comprueban en el backend mediante `AuthGuard`, `RolesGuard`, `ReadOnlyGuard`, `UnitScopeGuard` y filtros de los servicios. Ocultar un botón o menú no sustituye estas comprobaciones.

## 3. Gestión de cuentas

| Proceso | Regla |
|---|---|
| Alta | El Administrador crea una cuenta con correo único y rol según la necesidad. Dueño de unidad y Lector requieren trabajador vinculado. El rol predeterminado es LECTOR. |
| Cambio de permisos o vínculo | Comprobar la necesidad y actualizar el rol o trabajador asociado. El cambio revoca las sesiones existentes y registra auditoría. |
| Desactivación | Desactivar la cuenta cuando deja de estar autorizada. Sus sesiones se revocan y el backend rechaza el acceso. |
| Revisión | Revisar roles, vínculos y necesidad de acceso antes de publicar y cuando cambie la función del usuario. Registrar el resultado. |
| Recuperación | Definir cómo comprobar identidad y restablecer contraseña o MFA con autorización y auditoría. Este procedimiento sigue pendiente. |

La revisión y autorización son tareas manuales; no hay un circuito automático de aprobación ni revisión periódica implementado.

## 4. Protección de sesiones

El identificador de sesión se envía en una cookie `HttpOnly`, `Secure` y `SameSite=Strict`. La BD guarda su hash SHA-256; el frontend no lo conserva en localStorage.

- La sesión dura como máximo dos horas y se invalida al cerrar sesión.
- Las solicitudes que modifican datos, incluido login, requieren un `Origin` autorizado. Se rechazan orígenes ausentes, `null` o ajenos; no se usan tokens CSRF.
- El usuario puede cerrar todas sus sesiones desde Seguridad de cuenta. El Administrador puede revocar las de otra cuenta desde Usuarios.
- Cambiar rol, vínculo o estado revoca automáticamente las sesiones de la cuenta.

Nginx contiene una configuración CSP. Su revisión específica y validación frente a XSS siguen pendientes. La cookie HttpOnly impide que JavaScript la lea, pero no evita que código malicioso ejecute acciones dentro de una sesión abierta.

## 5. Contraseñas y secretos

| Elemento | Regla |
|---|---|
| Contraseñas de usuarios | Entre 12 y 1024 caracteres. Con bcrypt, además, como máximo 72 bytes UTF-8. Usar una contraseña robusta y exclusiva, sin compartir cuentas. |
| Administrador inicial | Se crea mediante `crear-admin.mjs` cuando no existen usuarios, con contraseña suministrada fuera del repositorio y hash Argon2id. |
| Credenciales de BD y entorno | Guardadas en variables de entorno o archivos `.env`, excluidos de Git. Restringir lectura y conservar una copia segura. |
| Clave TOTP | `TOTP_ENCRYPTION_KEY` se guarda sin cifrar en el entorno del backend, separada de la BD. Conservar una copia segura: perderla impide recuperar las semillas. No reemplazarla sin volver a cifrar los datos. |
| Transporte | HTTPS mediante Nginx. El certificado local es autofirmado; para acceso remoto se necesita un certificado válido y un origen autorizado correcto. |

No registrar contraseñas, hashes, cookies de sesión, semillas o códigos TOTP ni claves en logs o evidencias. La aplicación no tiene cambio de contraseña por autoservicio ni recuperación de factores implementados. Ante exposición, el administrador debe contener el acceso y seguir un procedimiento autorizado; no se declara rotación automática.

## 6. Auditoría

La auditoría registra login, fallos de TOTP durante login, activación de MFA, cambios de usuarios, logout y revocación de sesiones. El interceptor registra los cambios de gestión y exportaciones que cubre.

Los eventos se guardan mediante el modelo `AuditEvent`. No se auditan automáticamente todas las lecturas, solicitudes fallidas o cambios directos en la BD. El Administrador puede consultarlos con filtros y paginación; la conservación anual y recuperación deben comprobarse.

Consultar [Monitoreo y logs](07-Monitoreo-Logs.md) para revisión y protección de registros.

## 7. Mejoras futuras

- Passkeys/WebAuthn y Windows Hello, retirados del acceso actual.
- Recuperación de cuentas y MFA con comprobación de identidad, autorización y auditoría.
- Reautenticación para operaciones sensibles.
- Gestor de secretos externo para mejorar la custodia de la clave TOTP.
- Integración con Wazuh para centralizar eventos y generar alertas. La parte de SIEM de la consigna sigue pendiente.

## 8. Evidencias

- [Pruebas del backend](evidencias/pruebas-automatizadas-backend.md): autenticación, cookies, vencimiento, revocación y permisos.
- [Cifrado TOTP](evidencias/cifrado-totp.md): cifrado de semillas y conversión de datos existentes.
- [Límites de Nginx](evidencias/limites-nginx.md): respuestas permitidas y 429 en un entorno aislado.
