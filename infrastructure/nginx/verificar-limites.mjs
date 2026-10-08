// Ejecutar únicamente contra el entorno local de pruebas: consume los límites.
import assert from 'node:assert/strict';
import https from 'node:https';
import { readFileSync } from 'node:fs';

const origin = process.env.PUBLIC_ORIGIN ?? 'https://localhost:8443';
const ca = readFileSync(new URL('./certs/server.crt', import.meta.url));
function solicitar(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(new URL(path, origin), {
      ca,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
    }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => req.destroy(new Error('La solicitud superó 10 segundos.')));
    req.end('{}');
  });
}

const allowed = [200, 201, 400, 401, 403, 404];
for (let i = 0; i < 5; i++) {
  assert.ok(allowed.includes(await solicitar('/api/v1/auth/login')), 'El entorno debe comenzar sin un límite consumido.');
}
for (const path of ['/api/v1/auth/login?test=1', '/api/v1/auth/login/', '/api/v1/auth/LOGIN', '/api/v1/auth/mfa/confirm']) {
  assert.equal(await solicitar(path, { 'X-Forwarded-For': '198.51.100.23' }), 429);
}
const api = await Promise.all(Array.from({ length: 100 }, () => solicitar('/api/v1/auth/me')));
assert.ok(api.some((status) => allowed.includes(status)));
assert.ok(api.some((status) => status === 429));
assert.ok(api.every((status) => allowed.includes(status) || status === 429));
assert.equal(await solicitar('/healthz'), 200);
console.log('OK: límites de autenticación y API, variantes de ruta y healthcheck.');
