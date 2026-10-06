import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from '../../backend/node_modules/typescript/lib/typescript.js'

const fuente = readFileSync(new URL('../src/features/organizacion/api/organizacionApi.ts', import.meta.url), 'utf8')
  .replace(/^import .*\r?\n/gm, '')
const { outputText } = ts.transpileModule(`const obtenerToken = () => null;\n${fuente}`, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { apiRequest } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const fetchOriginal = globalThis.fetch
const timeoutOriginal = AbortSignal.timeout
try {
  let plazo
  AbortSignal.timeout = ms => { plazo = ms; return timeoutOriginal(10) }
  globalThis.fetch = async (_, { signal }) => ({ ok: true, json: () => new Promise((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return }
    signal.addEventListener('abort', () => reject(signal.reason), { once: true })
  }) })
  // Mantiene el proceso activo mientras el cuerpo de la respuesta espera.
  const reloj = setTimeout(() => {}, 100)
  await assert.rejects(apiRequest('/prueba', { method: 'PUT' }), { name: 'TimeoutError' })
  clearTimeout(reloj)
  assert.equal(plazo, 20000)
  const abortador = new AbortController()
  const peticion = apiRequest('/prueba', { method: 'GET', signal: abortador.signal })
  abortador.abort()
  await assert.rejects(peticion, { name: 'AbortError' })
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ guardado: true }) })
  assert.deepEqual(await apiRequest('/prueba', { method: 'PUT' }), { guardado: true })
  console.log('API: guardado, límite de espera y cancelación verificados.')
} finally {
  globalThis.fetch = fetchOriginal
  AbortSignal.timeout = timeoutOriginal
}
