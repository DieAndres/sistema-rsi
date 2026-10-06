import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from '../../backend/node_modules/typescript/lib/typescript.js'

const fuente = readFileSync(new URL('../src/features/cumplimiento/api/exportacionesApi.ts', import.meta.url), 'utf8')
  .replace(/import .* from .*\r?\n/, 'const obtenerToken = () => null\n')
const { outputText } = ts.transpileModule(fuente, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { exportarControlesSoa } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const fetchOriginal = globalThis.fetch
try {
  globalThis.fetch = async () => ({ ok: true, json: async () => [
    { controlId: 'A.5.1', tema: 'Sin evaluar', evaluacion: null },
    { controlId: 'A.5.2', tema: 'Pendiente', evaluacion: { aplica: null } },
    { controlId: 'A.5.3', tema: 'Excluido', evaluacion: { aplica: false } },
    { controlId: 'A.5.4', tema: 'Aplicable', evaluacion: { aplica: true, estado: 'IMPLEMENTADO' } },
  ] })
  const { contenido } = await exportarControlesSoa('organizacion-prueba')
  assert.ok(contenido.includes('| A.5.1 | Sin evaluar | Pendiente |'))
  assert.ok(contenido.includes('| A.5.2 | Pendiente | Pendiente |'))
  assert.ok(contenido.includes('| A.5.3 | Excluido | No |'))
  assert.ok(contenido.includes('| A.5.4 | Aplicable | Sí | IMPLEMENTADO |'))
  console.log('Exportación SoA: aplicabilidad pendiente, sí y no verificadas.')
} finally {
  globalThis.fetch = fetchOriginal
}
