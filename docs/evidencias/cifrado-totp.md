# Cifrado de semillas TOTP — 07/10/2026

Control: cifrado de aplicación AES-256-GCM, con IV aleatorio de 12 bytes por escritura y etiqueta de autenticación de 16 bytes.

Qué protege: una copia de la base de datos ya convertida no contiene las semillas originales. No protege frente al compromiso conjunto del backend y su clave, ni elimina secretos de copias anteriores.

Dónde se aplica: `backend/src/auth/totp-secret.ts` y `auth.service.ts`, al configurar MFA, confirmar el factor e iniciar sesión. `main.ts` exige una clave válida. El campo existente `Usuario.mfaSecret` contiene versión, IV, etiqueta y texto cifrado. No se acepta texto plano en el flujo de autenticación.

Custodia: `TOTP_ENCRYPTION_KEY` se configura en el entorno del backend, fuera del repositorio y de la BD. No cambiarla sin volver a cifrar los datos; se requiere una copia custodiada para recuperación. No se publican claves, semillas ni el respaldo local en esta evidencia.

Cómo se probó:

- Compilación del backend aprobada.
- Diez suites unitarias: 16 pruebas aprobadas. Incluyen recuperación de la semilla, IV distinto por cifrado, rechazo de datos alterados, texto plano, clave incorrecta y clave ausente o inválida. Configuraciones repetidas y concurrentes conservan el QR.
- Suite HTTP de sesiones: 9 pruebas aprobadas, incluyendo configuración y confirmación TOTP, rechazo de códigos inválidos y login con una semilla cifrada.
- Conversión con PostgreSQL aislado: semillas antiguas cifradas, semillas ya cifradas verificadas, valores nulos conservados y segunda ejecución sin cambios. Clave incorrecta y datos inválidos provocan rollback sin modificaciones parciales.
- BD local: respaldo previo fuera del control de versiones y conversión aprobada de 2 semillas. PostgreSQL quedó nuevamente pausado.

Resultado: cifrado implementado y semillas locales convertidas. La conversión no modifica el factor configurado en el autenticador. El procedimiento de recuperación operativa de claves queda pendiente de una prueba específica; no se afirma que los respaldos anteriores estén cifrados.

Repetición: desde `backend`, ejecutar `npm test -- --runInBand`, `npm run test:e2e -- --runInBand sesiones-cookie.e2e-spec.ts` y `npm run build`. Para convertir otra BD, seguir `backend/README.md` y ejecutar `npm run migrar:totp` con el backend detenido y la clave custodiada.
