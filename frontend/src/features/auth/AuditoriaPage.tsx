import { useEffect, useState } from 'react'
import { apiGet } from '../../shared/api/apiGet'

type Evento = {
  id: string
  eventType: string
  entityType: string
  entityId: string | null
  action: string
  result: string
  timestamp: string
  actor?: { correo: string } | null
}

export function AuditoriaPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    apiGet<Evento[]>('/api/v1/auth/auditoria', controller.signal)
      .then(setEventos)
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError('No se pudo cargar la auditoría.')
      })
    return () => controller.abort()
  }, [])

  return (
    <main className="pagina">
      <h1>Auditoría</h1>
      <p>Últimos eventos registrados del sistema.</p>
      {error && <p className="mensaje-error">{error}</p>}
      <div className="auditoria-lista">
        {eventos.map((evento) => (
          <article className="auditoria-fila" key={evento.id}>
            <strong>{evento.action}</strong>
            <span>{evento.actor?.correo ?? 'Sistema'}</span>
            <span>{evento.entityType}{evento.entityId ? ` · ${evento.entityId}` : ''}</span>
            <span>{evento.result}</span>
            <time dateTime={evento.timestamp}>{new Date(evento.timestamp).toLocaleString()}</time>
          </article>
        ))}
        {!error && eventos.length === 0 && <p>No hay eventos registrados.</p>}
      </div>
    </main>
  )
}
