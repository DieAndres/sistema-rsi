import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import https from 'node:https';
import tls from 'node:tls';

const origen = new URL(process.env.PUBLIC_ORIGIN || 'https://localhost:8443');
const httpOrigin = process.env.HTTP_ORIGIN || 'http://localhost:8080';
const ca = readFileSync(new URL('./certs/server.crt', import.meta.url));

function solicitar(version, ruta) {
  return new Promise((resolve, reject) => {
    const req = https.get(new URL(ruta, origen), { ca, minVersion: version, maxVersion: version, family: 4 }, res => {
      const resultado = { protocolo: res.socket.getProtocol(), estado: res.statusCode };
      res.resume(); res.on('end', () => resolve(resultado));
    });
    req.setTimeout(5000, () => req.destroy(new Error('Tiempo agotado')));
    req.on('error', reject);
  });
}

for (const version of ['TLSv1.2', 'TLSv1.3']) {
  const pagina = await solicitar(version, '/');
  assert.equal(pagina.estado, 200); assert.equal(pagina.protocolo, version);
  console.log(`${version}: HTTPS 200, certificado y nombre del servidor verificados.`);
}
const api = await solicitar('TLSv1.3', '/api/v1/auth/me');
assert.equal(api.estado, 401);
console.log('Proxy API por HTTPS: 401 sin credenciales (esperado).');
const redireccion = await fetch(`${httpOrigin}/prueba?tls=1`, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
assert.equal(redireccion.status, 308);
assert.equal(redireccion.headers.get('location'), new URL('/prueba?tls=1', origen).href);
console.log('HTTP: 308 hacia HTTPS, conservando ruta y query.');

for (const version of ['TLSv1', 'TLSv1.1']) {
  const resultado = await new Promise(resolve => {
    const socket = tls.connect({ host: origen.hostname, port: Number(origen.port || 443), servername: origen.hostname,
      ca, family: 4, minVersion: version, maxVersion: version, ciphers: 'ALL:@SECLEVEL=0' });
    socket.setTimeout(5000, () => socket.destroy(new Error('Tiempo agotado')));
    socket.on('secureConnect', () => { socket.destroy(); resolve('ACEPTADO'); });
    socket.on('error', error => resolve(error.code));
  });
  assert.equal(resultado, 'ERR_SSL_TLSV1_ALERT_PROTOCOL_VERSION');
  console.log(`${version}: rechazado por el servidor (alerta protocol_version).`);
}
console.log('Verificación TLS completa.');
