# Límites de solicitudes en Nginx — 08/10/2026

Control: `limit_req`, sin dependencias nuevas, en `infrastructure/nginx/default.conf`.

Qué protege: reduce intentos repetidos de autenticación y ráfagas de solicitudes a la API desde una misma IP. Login y confirmación TOTP comparten 5 solicitudes/minuto con `burst=4`; la API utiliza 20 solicitudes/segundo y `burst=40`. El exceso responde 429 antes de llegar a NestJS.

Dónde se aplica: tráfico HTTPS hacia `/api/` a través de Nginx. La IP se obtiene de la conexión, sin confiar en encabezados enviados por el cliente. No cubre acceso directo al backend ni limita por cuenta. Usuarios con la misma IP comparten el límite; ataques distribuidos y capacidad global requieren controles adicionales.

Cómo se probó: contenedores aislados con la configuración real, certificado local y un backend HTTP de prueba. `nginx -t` aprobó. Cinco solicitudes iniciales al login llegaron al backend; el exceso respondió 429. Query distinta, barra final, mayúsculas y confirmación MFA compartieron el mismo límite. Un encabezado `X-Forwarded-For` distinto no lo evitó. Cien solicitudes concurrentes a la API produjeron respuestas permitidas y 429, sin errores 5xx; `/healthz` continuó respondiendo 200. Las respuestas 429 conservaron CSP.

Resultado: prueba aprobada de `verificar-limites.mjs` dentro de la red Docker, con validación TLS del certificado y nombre localhost. La ejecución desde Windows encontró interferencia con la cadena del certificado; no se desactivó la validación TLS. Las pruebas comprueban Nginx y no representan una prueba de carga de NestJS o PostgreSQL.

Repetición: seguir `infrastructure/nginx/README.md` y ejecutar `node infrastructure/nginx/verificar-limites.mjs` en un entorno local con los límites sin consumir. La prueba consume deliberadamente los límites de esa IP. Aplicar al despliegue mediante reconstrucción del frontend.
