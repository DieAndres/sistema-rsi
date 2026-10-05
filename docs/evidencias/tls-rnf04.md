# Evidencia — HTTPS / TLS de RNF-04

Prueba del 04/10/2026 (America/Montevideo); registro UTC: 05/10/2026 01:53:23. Entorno local Docker, origen `https://localhost:8443`.

## Cambios comprobados

- Nginx termina TLS con certificado local RSA 3072 y SAN localhost / 127.0.0.1.
- Solo TLS 1.2 y TLS 1.3 habilitados.
- HTTP 8080 redirige a HTTPS 8443; `/healthz` es la única excepción HTTP, sin datos de negocio.
- API accesible por HTTPS; backend Docker sin HTTP publicado en el anfitrión.
- `WEBAUTHN_ORIGIN` del backend Docker: `https://localhost:8443`.
- Se reutilizó PostgreSQL y su volumen; se comprobaron los cuatro indicadores registrados.

## Resultados ejecutados

`docker compose build frontend backend`: ambas imágenes construidas.

`docker compose exec -T frontend nginx -t`: configuración y sintaxis correctas.

`docker compose ps`: frontend saludable, backend y PostgreSQL en ejecución.

`node infrastructure/nginx/verificar-tls.mjs`:

```text
TLSv1.2: HTTPS 200, certificado y nombre del servidor verificados.
TLSv1.3: HTTPS 200, certificado y nombre del servidor verificados.
Proxy API por HTTPS: 401 sin credenciales (esperado).
HTTP: 308 hacia HTTPS, conservando ruta y query.
TLSv1: rechazado por el servidor (alerta protocol_version).
TLSv1.1: rechazado por el servidor (alerta protocol_version).
Verificación TLS completa.
```

El cliente utiliza el certificado como CA explícita y verifica su identidad; no desactiva validación con `rejectUnauthorized: false`. Para los protocolos antiguos permite su negociación en el cliente y comprueba que sea el servidor quien los rechaza.

Huella SHA-256 del certificado:

```text
98:F3:D8:EC:68:BF:DB:14:14:81:38:66:56:12:50:5C:75:FF:71:0D:E6:6F:AE:70:D4:B5:3A:46:7D:C1:C0:D0
```

Vigencia: 05/10/2026 01:50:24 UTC a 05/10/2027 01:50:24 UTC. Certificado y clave excluidos de Git.

## Alcance

Se acredita la parte TLS de RNF-04 en laboratorio. El certificado es autofirmado y no se instaló confianza en Windows: el navegador puede mostrar un aviso. No acredita un certificado público, pruebas reales de Windows Hello ni todos los controles de RNF-04. Nginx → backend utiliza HTTP en la red privada Docker; TLS protege navegador → Nginx.
