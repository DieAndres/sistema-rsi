# Gestión de identidades y accesos del Sistema RSI

Este documento regula el acceso al **Sistema de Gestión Integrada para el RSI**: cuentas, autenticación, sesiones, permisos y auditoría. Los trabajadores y organizaciones registrados son datos administrados por la aplicación; no se convierten por ello en operadores del sistema.

## Encabezado de mapeo normativo

| Marco | Ítem verificado | Aporte al Sistema RSI |
|---|---|---|
| MCU 5.0 | Proteger (PR), PR.AA — Gestión de identidades, autenticación y control de acceso | Orienta la gestión de cuentas, credenciales, autenticación y permisos de la aplicación. |
| MCU 5.0 | PR.AA-01, PR.AA-03 y PR.AA-05; requisitos CA.1, CA.2 y CA.6 | Relaciona alta de identidades, autenticación y mínimo privilegio con la revisión de derechos de acceso. El registro de usuarios y los guards aportan evidencia parcial; la revisión periódica requiere un acta. |
| COBIT 2019 | DSS05 — Gestionar servicios de seguridad; APO13 — Gestionar seguridad | Referencia para administrar controles de acceso y supervisar su operación, sin afirmar un nivel de capacidad COBIT. |
| ISO/IEC 27001:2022 e ISO/IEC 27002:2022 | Anexo A: 5.15 (control de acceso), 5.16 (gestión de identidades), 5.17 (información de autenticación), 5.18 (derechos de acceso), 8.2 (privilegios) y 8.5 (autenticación segura) | Orientan las reglas de cuentas, permisos y autenticación del RSI. El documento no declara conformidad con esos controles. |
| BCU — Guía de estándares mínimos de gestión | CA.1 — Gestionar acceso lógico; CA.2 — Revisar privilegios de acceso lógico | Referencia de buenas prácticas para el RSI. No se atribuyen al proyecto obligaciones de una entidad financiera supervisada. |
| Ley 18.331 | Art. 10 — Principio de seguridad de los datos | El control de acceso contribuye a evitar consulta o tratamiento no autorizado de los datos personales procesados por la aplicación. |

La consigna exige **RF-14** (TOTP, WebAuthn/U2F, Windows Hello y selección de Argon2/bcrypt), **RF-15** (roles y permisos), **RF-16** (auditoría), **RNF-04** (TLS y MFA administrativo) y **RNF-05** (retención de auditoría). El objetivo MCU 5.0 Avanzado no se considera alcanzado por este documento.

## Control del documento

| Campo | Valor |
|---|---|
| Código | SI-IAM-09 |
| Versión | 1.2 — propuesta |
| Responsable | Responsable de seguridad u operación del Sistema RSI, por designar |
| Fecha | 30/09/2026 |
| Aprobación | Pendiente de registrar |
| Próxima revisión | Un año después de la aprobación o ante cambios relevantes de autenticación |

### Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.0 | 30/09/2026 | Equipo del proyecto | Reescritura según la plantilla ISACA y el código actual del RSI. |
| 1.1 | 30/09/2026 | Equipo del proyecto | Retiro de la sección «Evidencia y decisiones pendientes». |
| 1.2 | 30/09/2026 | Equipo del proyecto | Administrador inicial siempre creado con Argon2id. |

## 1. Modelo de autenticación

El backend usa cuentas propias (`Usuario`), sesiones persistidas (`Sesion`) y un token Bearer aleatorio. Guarda en PostgreSQL **el hash SHA-256 del token**, comprueba que la sesión no haya vencido y que el usuario siga activo. La sesión vence a las ocho horas; `logout` elimina la sesión. El frontend conserva el token Bearer en `localStorage`, una decisión actual que requiere revisar el riesgo de exposición ante XSS antes del despliegue.

| Factor o mecanismo | Implementación del RSI | Estado |
|---|---|---|
| Contraseña | Hash Argon2id por defecto o bcrypt seleccionado al crear la cuenta; verificación de hashes scrypt anteriores. | Implementado en código y cubierto por `backend/src/auth/password.spec.ts`. |
| TOTP | Alta mediante secreto y URI de autenticador; confirmación con código; exigido al iniciar sesión si la cuenta tiene MFA confirmado. | Implementado en backend y frontend. Para Administrador y RSI, el guard bloquea otras rutas mientras no configuren MFA. |
| Passkey WebAuthn | Alta desde una sesión autenticada; inicio de sesión con clave pública, desafío de cinco minutos, comprobación de origen, RP ID, firma y contador. | Implementado en código; pruebas automatizadas de desafíos vencidos/reutilizados. |
| Windows Hello | Puede actuar como autenticador de plataforma a través de WebAuthn en Windows; el RSI no recibe PIN ni biometría. | Compatibilidad del flujo implementada; falta evidencia de prueba en dispositivo real. |
| Llave U2F sin verificación de usuario | El backend solicita además TOTP para iniciar sesión. | Regla implementada; falta evidencia de prueba con llave física. |

Windows Hello no es un tercer factor que el RSI controle por separado. El navegador y el sistema operativo eligen el autenticador WebAuthn disponible.

### Política de factores según operación

| Operación del RSI | Regla actual |
|---|---|
| Inicio de sesión con contraseña | Contraseña; TOTP si la cuenta tiene MFA confirmado. |
| Inicio de sesión de Administrador o RSI | Debe completar el alta de TOTP antes de acceder a las demás rutas. |
| Inicio de sesión con passkey | WebAuthn con verificación de usuario; si el autenticador no verifica al usuario, se exige TOTP. |
| Registro de una passkey | Sesión autenticada; para Administrador y RSI, TOTP ya confirmado. |
| Alta o cambio de usuarios y roles | Solo Administrador, mediante el guard de roles; no existe una nueva comprobación de factor por cada cambio. |
| Consulta de auditoría | Solo Administrador. |

Estas reglas describen el código actual. La plantilla incluye operaciones de un **gestor de contraseñas y contraseña maestra** que no existen en el RSI y no se incorporan aquí.

## 2. Gestión de identidades: provisión y desprovisión

| Proceso | Procedimiento del RSI | Estado y decisión pendiente |
|---|---|---|
| Alta | El Administrador crea la cuenta con correo único, contraseña, rol y trabajador asociado cuando corresponde. El rol inicial es LECTOR. | API y pantalla de usuarios implementadas; falta definir quién autoriza cada alta y conservar esa autorización. |
| Cambio de rol o vínculo | El Administrador modifica `rol`, `activo` o `trabajadorId`. DUENO_UNIDAD y LECTOR requieren un trabajador vinculado. | El backend registra `USER_UPDATE`; falta un procedimiento de solicitud y aprobación. |
| Baja | El Administrador puede desactivar la cuenta con `activo=false`; las sesiones de usuarios inactivos dejan de ser válidas al consultarlas. | No hay plazo institucional aprobado para ejecutar la baja; tampoco pantalla de revocación individual de passkeys. |
| Revisión de accesos | Comparar cuentas, roles, vínculos y necesidad de acceso con el responsable designado; registrar correcciones. | No se encontró acta ni frecuencia acordada. No se presume revisión semestral. |

Los roles implementados son `ADMINISTRADOR`, `RSI`, `DUENO_UNIDAD` y `LECTOR`. `RolesGuard` restringe rutas marcadas por rol; `ReadOnlyGuard` impide cambios de negocio al LECTOR, con excepciones para su propia MFA y cierre de sesión; `UnitScopeGuard` limita a DUENO_UNIDAD y LECTOR según organización o unidad. La revisión de permisos efectivos debe abarcar también exportaciones y acceso horizontal a registros.

Desde el 01/10/2026, todas las rutas de búsqueda global y KPI requieren
`ADMINISTRADOR` o `RSI`, incluidos configuración de indicadores y registro de
mediciones. Dueño de unidad y Lector reciben HTTP 403. El frontend oculta el
Dashboard para esos roles y abre Activos al ingresar o recargar. Esta
restricción se aplica en el backend mediante `@Roles` en ambos controladores.

## 3. Registro de accesos (acta)

La lista de usuarios del backend incluye ID, correo, rol, estado, vínculo con trabajador y fecha de alta. **No equivale a un acta de autorización ni a una revisión de accesos**. Para cada revisión debe conservarse, en un medio de acceso restringido:

| Campo del acta | Contenido requerido |
|---|---|
| Fecha y responsable | Quién revisó y cuándo. |
| Cuenta y ámbito | ID de usuario, rol, trabajador y unidad u organización asociada. |
| Justificación | Necesidad vigente de acceso y autoridad que la aprobó. |
| Resultado | Mantener, reducir, desactivar o investigar; fecha de ejecución. |

No se incluyen cuentas reales ni datos personales de usuarios en este documento. El acta inicial y su periodicidad siguen pendientes.

## 4. Gestión de secretos y credenciales

- Las contraseñas se almacenan como hashes Argon2id o bcrypt; los hashes scrypt anteriores se verifican por compatibilidad. No hay contraseña maestra del RSI.
- `Passkey` conserva clave pública y contador; `PasskeyChallenge` conserva desafíos temporales. La clave privada permanece en el autenticador del usuario.
- `mfaSecret` se guarda en la tabla `Usuario`. Antes de operar con datos reales debe definirse y demostrar su protección en reposo y acceso restringido; no se debe afirmar que ya está cifrado.
- Los secretos de PostgreSQL y configuración local deben permanecer fuera de Git. Ningún log, acta o captura debe contener contraseñas, tokens, códigos TOTP o semillas.
- El origen WebAuthn debe coincidir con `WEBAUTHN_ORIGIN`; para despliegue remoto se requiere HTTPS y dominio real. La configuración Nginx/TLS de producción aún no está demostrada.
- Falta un flujo documentado para pérdida del segundo factor, recuperación de cuenta y revocación de passkeys. Esas acciones no deben resolverse omitiendo MFA.

## 5. Política de contraseñas por sistema

| Cuenta o secreto | Regla comprobada | Cambio o revisión |
|---|---|---|
| Cuenta del RSI | Entre 12 y 1024 caracteres al crearla; Argon2id predeterminado o bcrypt elegido por el Administrador. Con bcrypt se rechazan contraseñas que exceden 72 bytes UTF-8. | No se encontró cambio de contraseña por autoservicio ni rotación periódica implementada. |
| Administrador inicial | Siempre Argon2id. | El secreto inicial debe suministrarse y custodiarse fuera del repositorio. |
| Credencial de PostgreSQL | Configurada mediante variables de entorno; `.env.example` contiene solo valores de ejemplo. | No se encontró un procedimiento automatizado de rotación. |

No se exige una expresión regular de mayúsculas, símbolos y cambios cada 90/180 días: esas cifras pertenecen al ejemplo de la plantilla y no están implementadas ni acordadas. Ante una credencial expuesta debe cambiarse y revocarse su acceso.

## 6. Registro de autenticaciones (auditoría)

| Evento | Estado en el código |
|---|---|
| Inicio de sesión con contraseña exitoso o fallido | Se crea un evento `LOGIN` en `AuditEvent`. |
| Código TOTP faltante o inválido; alta confirmada | Se registran `MFA_FAILURE` y `MFA_ENABLED`. |
| Registro e inicio con passkey | Se registran `PASSKEY_REGISTER` y `PASSKEY_LOGIN`; el login con passkey fallido también se audita. |
| Cambio de usuario y cierre de sesión | Se registran `USER_UPDATE` y `LOGOUT`. |

Desde el 01/10/2026 también se registran los cambios de los módulos de gestión
y las exportaciones mediante un interceptor común, con valores anteriores y
nuevos y transacción compartida con la operación. La API permite al
Administrador filtrar por entidad y usuario y consultar páginas de 50 eventos,
incluidos los antiguos. Ver `docs/evidencias/auditoria-gestion.md`.
No hay purga automática. La garantía operativa de retención de al menos un año,
la correlación SIEM/Wazuh y las alertas requieren implementación o evidencia
adicional antes de declararlas satisfechas.

## Fuentes oficiales

- [AGESIC — MCU 5.0, PR.AA y subcategorías](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/marco-ciberseguridad-50/marco-ciberseguridad/funcion-proteger-pr) y [guía CA.6](https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/guia-implementacion-del-mcu-50/control-acceso/ca6-gestion-accesos).
- [ISACA — objetivos APO13 y DSS05 de COBIT 2019](https://www.isaca.org/resources/news-and-trends/industry-news/2021/a-systematic-approach-to-implementing-a-governance-system-using-cobit-2019).
- [ISO — ISO/IEC 27002:2022, controles de seguridad de la información](https://www.iso.org/standard/75652.html).
- [BCU — Guía de estándares mínimos de gestión de seguridad de la información](https://www.bcu.gub.uy/Servicios-Financieros-SSF/Documents/guia%20emg%20seguridad%20de%20la%20informacion.pdf).
- [IMPO — Ley 18.331, art. 10](https://www.impo.com.uy/bases/leyes/18331-2008/10).
- [RFC Editor — RFC 6238, TOTP](https://www.rfc-editor.org/info/rfc6238/), [W3C — WebAuthn](https://www.w3.org/TR/webauthn-2/) y [Microsoft — WebAuthn y Windows Hello](https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/webauthn-apis).
