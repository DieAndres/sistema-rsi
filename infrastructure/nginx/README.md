# Nginx — HTTPS y TLS (RNF-04)

El despliegue Docker sirve React y la API en **https://localhost:8443**. Nginx termina TLS 1.2/1.3 y reenvía `/api/` al backend por la red privada de Compose. HTTP 8080 redirige con 308 a `PUBLIC_ORIGIN`, preservando ruta y query. Solo `/healthz`, sin datos de negocio, queda disponible por HTTP para el healthcheck.

La configuración sigue las [directivas SSL oficiales de Nginx](https://nginx.org/en/docs/http/ngx_http_ssl_module.html). `default.conf` se instala como plantilla: el entrypoint sustituye únicamente `PUBLIC_ORIGIN` y conserva `$request_uri` y `$backend`.

## Arranque local

Desde `sistema-rsi`, con Docker Desktop y `.env` / `backend/.env` configurados:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File infrastructure/nginx/generar-certificado.ps1
docker compose config --quiet
docker compose up -d --build
docker compose exec frontend nginx -t
node infrastructure/nginx/verificar-tls.mjs
```

El generador requiere OpenSSL y lo localiza también en Git para Windows. Crea RSA 3072, SAN localhost / 127.0.0.1 y vigencia de un año. Conserva el par existente y no instala confianza en Windows. El navegador puede mostrar un aviso por ser autofirmado; el verificador confía explícitamente en ese certificado y comprueba nombre y vigencia, sin desactivar la validación TLS.

Los archivos `certs/server.crt` y `certs/server.key` se montan de solo lectura y se excluyen de Git. No compartir la clave privada. Para renovar, colocar el nuevo par y reiniciar frontend.

## Variables de Compose

| Variable | Predeterminado | Uso |
|---|---|---|
| `PUBLIC_ORIGIN` | `https://localhost:8443` | Origen exacto, redirección HTTP y `WEBAUTHN_ORIGIN`. |
| `FRONTEND_PORT` | `8080` | Puerto HTTP para redirección. |
| `FRONTEND_HTTPS_PORT` | `8443` | Puerto HTTPS del anfitrión; Nginx escucha 443 internamente. |
| `FRONTEND_BIND_ADDRESS` | `127.0.0.1` | Interfaz local por defecto. |
| `TLS_CERT_DIRECTORY` | `./infrastructure/nginx/certs` | Directorio de certificado y clave. |

Si cambia el puerto HTTPS, actualizar también `PUBLIC_ORIGIN`. Para el verificador definir `PUBLIC_ORIGIN` y `HTTP_ORIGIN` en su entorno si cambian las URLs. El backend Docker no publica HTTP en el anfitrión; PostgreSQL conserva su puerto local y volumen.

## Dominio público y desarrollo

Para publicar, utilizar un certificado válido para el dominio y su cadena en `server.crt`, clave en `server.key` y configurar renovación. Ajustar `PUBLIC_ORIGIN`, los puertos 443/80 y la interfaz de publicación. El certificado de localhost es para laboratorio; no acredita confianza pública.

Vite sigue siendo un entorno HTTP de desarrollo separado. Para demostrar RNF-04 utilizar Docker HTTPS. Al cambiar de origen es necesario iniciar sesión nuevamente; probar las passkeys bajo el origen HTTPS configurado. El tráfico Nginx → backend utiliza HTTP dentro de la red privada Docker.