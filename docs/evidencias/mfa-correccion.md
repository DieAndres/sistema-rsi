# MFA — Corrección de QR y validación TOTP

Fecha: 05/10/2026. Se detectaron dos condiciones en código que podían causar rechazos: verificación solo del período exacto (sin tolerancia) y sustitución del secreto en cada solicitud del QR. No se afirma que una de ellas explique por sí sola el rechazo del teléfono del usuario.

## Cambios

- Configuración explícita SHA-1, seis dígitos y períodos de 30 segundos en el QR y verificador compartido.
- Tolerancia de 30 segundos para los períodos adyacentes, conforme a la [configuración de otplib](https://otplib.yeojz.dev/guide/advanced-usage). No se aceptan códigos arbitrarios ni períodos más lejanos.
- El secreto pendiente se reutiliza. Solicitudes simultáneas usan actualización condicional para conservar un único QR.
- Generar un QR no reemplaza un factor ya confirmado.
- La confirmación comprueba que el secreto no cambió antes de activar MFA.
- Interfaz bloquea operaciones simultáneas, normaliza espacios, oculta el QR tras confirmar y diferencia código ausente de código inválido en login.

## Verificación

Comando ejecutado desde backend:

```powershell
npm.cmd test -- --runInBand src/auth/totp.spec.ts src/auth/auth-mfa.spec.ts src/auth/passkey.service.spec.ts
```

Resultado: 3 suites y 7 pruebas aprobadas. Incluyen vectores públicos RFC calculados con HMAC independiente, ceros iniciales, cambios de período, rechazo fuera de tolerancia, QR estable, solicitudes concurrentes y protección del factor confirmado.

Backend y frontend compilan. ESLint de los archivos modificados pasa.

Se ejecutó una prueba real de API en el backend de desarrollo con una cuenta temporal: login inicial, dos solicitudes del mismo QR, confirmación TOTP, rechazo de login sin código, login con código y rechazo de regeneración tras activar. Todos correctos. La cuenta temporal y sus eventos se eliminaron al terminar; no se modificó el administrador real.

Se reinició el backend de desarrollo para aplicar cambios. La prueba del autenticador físico requiere volver a cargar la pantalla, mostrar el QR pendiente actual y confirmar con hora automática del teléfono. No se registraron ni publicaron contraseñas, semillas, QR o códigos de la cuenta real.
