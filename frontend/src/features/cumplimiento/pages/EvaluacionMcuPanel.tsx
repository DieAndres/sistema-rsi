import { useEffect, useState } from 'react'
import { Asistente } from '../../../shared/Asistente'
import { apiRequest } from '../../organizacion/api/organizacionApi'
import { notificarGuardado } from '../../../shared/notificar'

const codigosFunciones: Record<string, string> = { Gobernar: 'GV', Identificar: 'ID', Proteger: 'PR', Detectar: 'DE', Responder: 'RS', Recuperar: 'RC' }

type Evaluacion = {
  respuesta: string | null
  justificacion: string | null
  evidencia: string | null
  demostracion: string | null
}
type Control = {
  controlId: string
  funcion: string
  funciones: string[]
  codigo: string
  tema: string
  evidenciaNecesaria: string
  demostracionSugerida: string
  evaluacion: Evaluacion | null
}
export function EvaluacionMcuPanel({
  organizacionId,
  perfilMcu,
  alGuardar,
}: {
  organizacionId: string
  perfilMcu: string
  alGuardar: () => void
}) {
  const [controles, setControles] = useState<Control[]>([])
  const [funcion, setFuncion] = useState('GV')
  const [control, setControl] = useState<Control | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [evidencia, setEvidencia] = useState('')
  const [demostracion, setDemostracion] = useState('')
  const [error, setError] = useState('')
  const ruta = `/api/v1/exportaciones/organizaciones/${organizacionId}/mcu-controles`
  useEffect(() => {
    const abortador = new AbortController()
    void apiRequest<Control[]>(ruta, {
      method: 'GET',
      signal: abortador.signal,
    })
      .then(setControles)
      .catch(() => {
        if (!abortador.signal.aborted)
          setError('No se pudieron cargar los controles MCU.')
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
      aria-label="Evaluación MCU por funciones"
    >
      <h3>Evaluar controles — objetivo {perfilMcu}</h3>
      <p>Línea base de AGESIC: {controles.length} controles únicos del perfil {perfilMcu}. Un control puede aparecer en varias funciones.</p>
      <p>
        El texto de evidencia sugerida orienta la revisión; no constituye
        evidencia de la organización. N.A. requiere justificación y revisión de
        su aceptación.
      </p>
      {error && (
        <p role="alert" className="mensaje mensaje-error">
          {error}
        </p>
      )}
      <label>
        Función
        <select value={funcion} onChange={(e) => setFuncion(e.target.value)}>
          {[
            ['GV', 'Gobernar'],
            ['ID', 'Identificar'],
            ['PR', 'Proteger'],
            ['DE', 'Detectar'],
            ['RS', 'Responder'],
            ['RC', 'Recuperar'],
          ].map(([id, nombre]) => (
            <option key={id} value={id}>
              {id} — {nombre}
            </option>
          ))}
        </select>
      </label>
      <div className="soa-lista">
        {controles
          .filter((c) => c.funciones.some((nombre) => codigosFunciones[nombre] === funcion))
          .map((c) => (
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
              Aplica (según la planilla)
              <select
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
              >
                <option value="">Pendiente</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
                <option value="NA">N.A.</option>
              </select>
            </label>
            <label className="campo-ancho">
              Justificación si N.A.
              <textarea
                value={justificacion}
                required={respuesta === 'NA'}
                maxLength={10000}
                onChange={(e) => setJustificacion(e.target.value)}
              />
            </label>
            <p className="campo-ancho">
              Evidencia sugerida: {control.evidenciaNecesaria}
            </p>
            <label className="campo-ancho">
              Evidencia de la organización
              <textarea
                value={evidencia}
                required={respuesta === 'SI'}
                maxLength={10000}
                onChange={(e) => setEvidencia(e.target.value)}
              />
            </label>
            <p className="campo-ancho">
              Demostración sugerida: {control.demostracionSugerida}
            </p>
            <label className="campo-ancho">
              Cómo se demuestra en la auditoría
              <textarea
                value={demostracion}
                required={respuesta === 'SI'}
                maxLength={10000}
                onChange={(e) => setDemostracion(e.target.value)}
              />
            </label>
            <button type="submit">Guardar evaluación MCU</button>
          </form>
        </Asistente>
      )}
    </section>
  )
}
