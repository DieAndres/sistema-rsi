import { PageHeader } from '../../shared/PageHeader'
import { Skeleton } from '../../shared/Skeleton'
import { Badge } from '../../shared/Badge'
import { useEffect, useState } from 'react'
import { apiGet } from '../../shared/api/apiGet'
import './auth.css'

type Evento = {
  id: string
  eventType: string
  entityType: string
  entityId: string | null
  action: string
  result: string
  timestamp: string
  actor?: { correo: string } | null
  metadata?: { campos?: string[]; anterior?: Record<string, unknown> | null; nuevo?: Record<string, unknown> | null; documento?: string } | null
}

const entidades = ['AUTH', 'ORGANIZACION', 'UNIDAD', 'TRABAJADOR', 'PROCESO', 'RACI', 'ACTIVO', 'RIESGO', 'VULNERABILIDAD', 'INCIDENTE', 'POLITICA', 'PROCEDIMIENTO', 'PLAN', 'HITO', 'EVIDENCIA', 'INDICADOR_KPI', 'MEDICION_KPI', 'EVALUACION_SOA', 'BRECHA_MCU', 'EXPORTACION']
const valor = (dato: unknown) => dato === undefined || dato === null ? '—' : typeof dato === 'string' ? dato : JSON.stringify(dato)

export function AuditoriaPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [error, setError] = useState('')
  const [entidad, setEntidad] = useState('')
  const [usuarioId, setUsuarioId] = useState('')
  const [usuarios, setUsuarios] = useState<Array<{ id: string; correo: string }>>([])
  const [pagina, setPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    apiGet<Array<{ id: string; correo: string }>>('/api/v1/auth/usuarios', controller.signal)
      .then(setUsuarios).catch((err: Error) => { if (err.name !== 'AbortError') setError('No se pudieron cargar los usuarios.') })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const query = new URLSearchParams({ pagina: String(pagina), ...(entidad && { entidad }), ...(usuarioId && { usuarioId }) })
    apiGet<{ eventos: Evento[]; total: number }>(`/api/v1/auth/auditoria?${query}`, controller.signal)
      .then(datos => { setEventos(datos.eventos); setTotal(datos.total) })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError('No se pudo cargar la auditoría.')
      })
      .finally(() => { if (!controller.signal.aborted) setCargando(false) })
    return () => controller.abort()
  }, [entidad, usuarioId, pagina])

  return (
    <main className="contenido">
      <PageHeader categoria="ADMINISTRACIÓN" titulo="Auditoría" descripcion="Consultá las operaciones, sus responsables y los cambios registrados." />
      <div className="auditoria-filtros">
        <label>Entidad<select value={entidad} onChange={e => { setCargando(true); setError(''); setEntidad(e.target.value); setPagina(1) }}><option value="">Todas las entidades</option>{entidades.map(tipo => <option key={tipo}>{tipo}</option>)}</select></label>
        <label>Usuario<select value={usuarioId} onChange={e => { setCargando(true); setError(''); setUsuarioId(e.target.value); setPagina(1) }}><option value="">Todos los usuarios</option>{usuarios.map(usuario => <option key={usuario.id} value={usuario.id}>{usuario.correo}</option>)}</select></label>
      </div>
      {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
      {cargando && <Skeleton />}
      <div className="auditoria-lista">
        {!cargando && !error && eventos.map((evento) => (
          <article className="auditoria-fila" key={evento.id}>
            <strong>{evento.action}</strong>
            <span>{evento.actor?.correo ?? 'Sistema'}</span>
            <span>{evento.entityType}{evento.entityId ? ` · ${evento.entityId}` : ''}</span>
            <Badge>{evento.result}</Badge>
            <time dateTime={evento.timestamp}>{new Date(evento.timestamp).toLocaleString()}</time>
            {evento.metadata?.campos && evento.metadata.campos.length > 0 && <details className="auditoria-detalle"><summary>Ver cambios</summary><dl>{evento.metadata.campos.map(campo => <div key={campo}><dt>{campo}</dt><dd>Anterior: {valor(evento.metadata?.anterior?.[campo])}</dd><dd>Nuevo: {valor(evento.metadata?.nuevo?.[campo])}</dd></div>)}</dl></details>}
            {evento.metadata?.documento && <span>Documento: {evento.metadata.documento}</span>}
          </article>
        ))}
        {!cargando && !error && eventos.length === 0 && <p>No hay eventos para estos filtros.</p>}
      </div>
      <div className="auditoria-filtros"><button type="button" disabled={cargando || pagina === 1} onClick={() => { setCargando(true); setError(''); setPagina(p => p - 1) }}>Anterior</button><span>Página {pagina} · {total} eventos</span><button type="button" disabled={cargando || pagina * 50 >= total} onClick={() => { setCargando(true); setError(''); setPagina(p => p + 1) }}>Siguiente</button></div>
    </main>
  )
}
