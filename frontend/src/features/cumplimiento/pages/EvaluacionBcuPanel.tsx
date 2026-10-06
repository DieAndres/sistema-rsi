import { useEffect, useState } from 'react'
import { Asistente } from '../../../shared/Asistente'
import { apiRequest } from '../../organizacion/api/organizacionApi'
import { notificarGuardado } from '../../../shared/notificar'

type Evaluacion = {
  respuesta: string | null
  justificacion: string | null
  evidencia: string | null
  demostracion: string | null
}
type Control = {
  controlId: string
  tema: string
  descripcion: string

  evaluacion: Evaluacion | null
}
export function EvaluacionBcuPanel({
  organizacionId,
  alGuardar,
}: {
  organizacionId: string
  alGuardar: () => void
}) {
  const [controles, setControles] = useState<Control[]>([])
  const [control, setControl] = useState<Control | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [evidencia, setEvidencia] = useState('')
  const [demostracion, setDemostracion] = useState('')
  const [error, setError] = useState('')
  const ruta = `/api/v1/exportaciones/organizaciones/${organizacionId}/bcu-controles`
  useEffect(() => {
    const abortador = new AbortController()
    void apiRequest<Control[]>(ruta, {
      method: 'GET',
      signal: abortador.signal,
    })
      .then(setControles)
      .catch(() => {
        if (!abortador.signal.aborted)
          setError('No se pudieron cargar los controles BCU.')
      })
    return () => abortador.abort()
  }, [ruta])
  function editar(c: Control) {
    setControl(c)
    setRespuesta(c.evaluacion?.respuesta ?? '')
    setJustificacion(c.evaluacion?.justificacion ?? '')
    setEvidencia(c.evaluacion?.evidencia ?? '')
    setDemostracion(c.evaluacion?.demostracion ?? '')
    setError('')
  }
  async function guardar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!control) return
    try {
      await apiRequest(`${ruta}/${control.controlId}`, {
        method: 'PUT',
        body: JSON.stringify({
          respuesta: respuesta || null,
          justificacion,
          evidencia,
          demostracion,
        }),
      })
      notificarGuardado()
      setControl(null)
      alGuardar()
    } catch {
      setError(
        'No se pudo confirmar el guardado. Revisá los datos y consultá el reporte antes de reintentar.',
      )
    }
  }
  return (
    <section
      className="panel-estructura"
      aria-label="Evaluación BCU por funciones"
    >
      <h3>Evaluar requerimientos BCU</h3>
      <p>
        Revisá si cada requerimiento corresponde a la entidad. Justificá la
        evaluación y registrá la evidencia; la descripción de referencia no
        demuestra cumplimiento.
      </p>
      {error && (
        <p role="alert" className="mensaje mensaje-error">
          {error}
        </p>
      )}

      <div className="soa-lista">
        {controles.map((c) => (
          <button
            className="soa-control"
            type="button"
            key={c.controlId}
            onClick={() => editar(c)}
          >
            <strong>
              {c.controlId} — {c.tema}
            </strong>
            <small>{c.evaluacion?.respuesta ?? 'Pendiente'}</small>
          </button>
        ))}
      </div>
      {control && (
        <Asistente
          abierto
          titulo={`${control.controlId} — ${control.tema}`}
          error={error}
          alCerrar={() => setControl(null)}
        >
          <form className="formulario-cumplimiento" onSubmit={guardar}>
            <label className="campo-ancho">
              Control (solo lectura)
              <input value={control.tema} readOnly />
            </label>
            <label>
              Evaluación
              <select
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              >
                <option value="">Pendiente</option>
                <option value="CUMPLE">Cumple</option>
                <option value="PARCIAL">Parcial</option>
                <option value="NO">No cumple</option>
                <option value="NA">N.A.</option>
              </select>
            </label>
            <label className="campo-ancho">
              Justificación y aplicabilidad a la entidad
              <textarea
                value={justificacion}
                required={respuesta !== ''}
                maxLength={10000}
                onChange={(e) => setJustificacion(e.target.value)}
              />
            </label>
            <p className="campo-ancho">
              Descripción de referencia: {control.descripcion}
            </p>
            <label className="campo-ancho">
              Evidencia de la organización
              <textarea
                value={evidencia}
                required={respuesta === 'CUMPLE' || respuesta === 'PARCIAL'}
                maxLength={10000}
                onChange={(e) => setEvidencia(e.target.value)}
              />
            </label>

            <label className="campo-ancho">
              Acción pendiente
              <textarea
                value={demostracion}
                maxLength={10000}
                onChange={(e) => setDemostracion(e.target.value)}
              />
            </label>
            <button type="submit">Guardar evaluación BCU</button>
          </form>
        </Asistente>
      )}
    </section>
  )
}
