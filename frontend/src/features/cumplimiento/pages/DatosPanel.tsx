import { useState } from 'react'
import { apiFetch, obtenerUsuarioActual } from '../../../shared/api/apiGet'

export function DatosPanel({ organizacionId }: { organizacionId: string }) {
  const [mensaje, setMensaje] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const rol = obtenerUsuarioActual()?.rol
  if (!['ADMINISTRADOR', 'RSI'].includes(rol ?? '')) return null
  async function pedir(ruta: string, opciones: RequestInit = {}) {
    const respuesta = await apiFetch(`/api/v1/datos/organizaciones/${organizacionId}/${ruta}`, {
      ...opciones, headers: { 'Content-Type': 'application/json' },
    })
    if (!respuesta.ok) {
      const error = await respuesta.json().catch(() => null) as { message?: string } | null
      throw new Error(error?.message ?? `Error ${respuesta.status}`)
    }
    return respuesta
  }
  async function exportar(formato: 'json' | 'csv') {
    setOcupado(true); setMensaje('')
    try {
      const respuesta = await pedir(`exportar?formato=${formato}`)
      const url = URL.createObjectURL(await respuesta.blob()); const enlace = document.createElement('a')
      enlace.href = url; enlace.download = `datos-rsi.${formato}`; enlace.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMensaje('Exportación descargada.')
    } catch (error) { setMensaje((error as Error).message) } finally { setOcupado(false) }
  }
  return <section className="panel-estructura" aria-label="Exportación de datos">
    <h2>Datos de la organización</h2>
    <p>Descargá los registros de la organización con sus relaciones en JSON o CSV.</p>
    <div className="acciones-exportacion">
      <button type="button" disabled={ocupado || !organizacionId} onClick={() => void exportar('json')}>Exportar JSON</button>
      <button type="button" disabled={ocupado || !organizacionId} onClick={() => void exportar('csv')}>Exportar CSV</button>
    </div>
    {ocupado && <p role="status">Procesando archivo…</p>}
    {mensaje && <p role="status">{mensaje}</p>}
  </section>
}
