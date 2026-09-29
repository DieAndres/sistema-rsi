import { obtenerToken } from '../../../shared/api/apiGet'

async function apiText(ruta: string) {
  const respuesta = await fetch(ruta, { headers: { Authorization: `Bearer ${obtenerToken() ?? ''}` } })
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
  return { contenido: await respuesta.text() }
}
async function apiControlesMarkdown(ruta: string) {
  const respuesta = await fetch(ruta, { headers: { Authorization: `Bearer ${obtenerToken() ?? ''}` } })
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`)
  const controles = await respuesta.json() as Array<{ controlId: string; tema: string; evaluacion?: { aplica?: boolean; estado?: string } }>
  const filas = controles.map(control => `| ${control.controlId} | ${control.tema} | ${control.evaluacion?.aplica ? 'Sí' : 'No'} | ${control.evaluacion?.estado ?? 'Sin evaluación'} |`).join('\n')
  return { contenido: `# Controles SOA\n\n| Control | Tema | Aplica | Estado |\n|---|---|---|---|\n${filas}` }
}
export function exportarInventario(id: string) { return apiText(`/api/v1/exportaciones/organizaciones/${id}/inventario-activos`) }
export function exportarControlesSoa(id: string) { return apiControlesMarkdown(`/api/v1/exportaciones/organizaciones/${id}/soa/controles`) }
export function exportarSoa(id: string) { return apiText(`/api/v1/exportaciones/organizaciones/${id}/soa`) }
export function exportarBrechas(id: string, funcion: string) { void funcion; return exportarSoa(id) }
