import { notificarGuardado } from '../../../shared/notificar'
import { Asistente } from '../../../shared/Asistente'
import { useEffect, useState } from 'react'
import { listarEvidencias, type Evidencia } from '../api/evidenciasApi'
import {
  guardarEvaluacionSoa,
  listarControlesSoa,
  type SoaControl,
} from '../api/soaApi'
import { listarPlanes, type Plan } from '../api/planesApi'
import '../cumplimiento.css'

export function EvaluacionSoaPanel({
  organizacionId,
  alGuardar,
}: {
  organizacionId: string
  alGuardar: () => void
}) {
  const [planes, setPlanes] = useState<Plan[]>([])
  const [planId, setPlanId] = useState('')
  const [cargando, setCargando] = useState(true)
  const [asistenteAbierto, setAsistenteAbierto] = useState(false)
  const [controles, setControles] = useState<SoaControl[]>([])
  const [evidencias, setEvidencias] = useState<Evidencia[]>([])
  const [seleccionado, setSeleccionado] = useState('')
  const [aplica, setAplica] = useState('')
  const [justificacion, setJustificacion] = useState('')
  const [insumos, setInsumos] = useState('')
  const [estado, setEstado] = useState('PENDIENTE')
  const [evidenciaId, setEvidenciaId] = useState('')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const control = controles.find((c) => c.controlId === seleccionado)
  const evidenciasVisibles = evidencias.filter(
    (e) => e.organizacionId === organizacionId,
  )
  useEffect(() => {
    let vigente = true
    if (!organizacionId) return
    void Promise.all([
      listarControlesSoa(organizacionId),
      listarEvidencias(),
      listarPlanes(),
    ])
      .then(([c, e, p]) => {
        if (!vigente) return
        setControles(c)
        setEvidencias(e)
        setPlanes(p.filter((plan) => plan.organizacionId === organizacionId))
      })
      .catch(() => {
        if (vigente)
          setError('No se pudieron cargar los controles, evidencias y planes.')
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [organizacionId])
  function seleccionar(id: string) {
    setError('')
    setAsistenteAbierto(true)
    const evaluacion = controles.find((c) => c.controlId === id)?.evaluacion
    setSeleccionado(id)
    setAplica(
      evaluacion?.aplica === null || evaluacion?.aplica === undefined
        ? ''
        : String(evaluacion.aplica),
    )
    setJustificacion(evaluacion?.justificacion ?? '')
    setInsumos(evaluacion?.insumos ?? '')
    setEstado(evaluacion?.estado ?? 'PENDIENTE')
    setEvidenciaId(evaluacion?.evidenciaId ?? '')
    setPlanId(evaluacion?.planId ?? '')
  }
  async function guardar(evento: React.FormEvent) {
    evento.preventDefault()
    if (!organizacionId || !seleccionado) return
    if (estado === 'IMPLEMENTADO' && !evidenciaId) {
      setError(
        'Para marcar el control como implementado, vinculá una evidencia.',
      )
      return
    }
    setGuardando(true)
    setError('')
    let guardado = false
    try {
      await guardarEvaluacionSoa(organizacionId, seleccionado, {
        aplica: aplica === '' ? null : aplica === 'true',
        justificacion,
        insumos,
        estado,
        evidenciaId,
        planId,
      })
      guardado = true
      setControles(await listarControlesSoa(organizacionId))
      alGuardar()
      notificarGuardado()
      setAsistenteAbierto(false)
    } catch (error) {
      if (guardado) {
        setError(
          'La evaluación se guardó, pero no se pudo actualizar el listado. Cerrá la ficha y volvé a consultar el informe.',
        )
      } else if (error instanceof Error && error.name === 'TimeoutError') {
        setError(
          'El servidor no confirmó el guardado a tiempo. Consultá el listado antes de volver a guardar; el cambio puede haberse registrado.',
        )
      } else {
        setError(
          'No se pudo confirmar el guardado de la evaluación SoA. Revisá la conexión y consultá el listado.',
        )
      }
    } finally {
      setGuardando(false)
    }
  }
  return (
    <>
      {error && (
        <p className="mensaje mensaje-error" role="alert">
          {error}
        </p>
      )}
      <section className="panel-estructura">
        <h3>Evaluar controles SoA</h3>
        <p>
          El catálogo es común; la aplicabilidad, justificación, evidencia y
          plan se evalúan para cada organización.
        </p>
        {cargando && <p role="status">Cargando controles…</p>}
        <div className="soa-lista">
          {controles.map((c) => (
            <button
              className={
                c.controlId === seleccionado
                  ? 'soa-control seleccionado'
                  : 'soa-control'
              }
              type="button"
              key={c.controlId}
              onClick={() => seleccionar(c.controlId)}
            >
              <strong>{c.controlId}</strong>
              <span>{c.tema}</span>
              <small>
                Aplica:{' '}
                {c.evaluacion?.aplica == null
                  ? 'Pendiente'
                  : c.evaluacion.aplica
                    ? 'Sí'
                    : 'No'}{' '}
                · {c.evaluacion?.estado ?? 'Sin evaluar'}
              </small>
            </button>
          ))}
        </div>
        {control && (
          <Asistente
            abierto={asistenteAbierto}
            titulo={control.controlId + ' — ' + control.tema}
            error={error}
            alCerrar={() => setAsistenteAbierto(false)}
          >
            <form
              className="formulario-cumplimiento soa-formulario"
              onSubmit={guardar}
            >
              <h3>
                {control.controlId} — {control.tema}
              </h3>
              <label className="campo-ancho">
                Tema del control (solo lectura)
                <input value={control.tema} readOnly />
              </label>
              <label>
                ¿Aplica?
                <select
                  value={aplica}
                  onChange={(e) => setAplica(e.target.value)}
                >
                  <option value="">Pendiente</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>
              <label>
                Estado
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  {![
                    'PENDIENTE',
                    'EN_IMPLEMENTACION',
                    'IMPLEMENTADO',
                    'NO_APLICA',
                  ].includes(estado) && (
                    <option value={estado}>{estado} (estado guardado)</option>
                  )}
                  <option>PENDIENTE</option>
                  <option>EN_IMPLEMENTACION</option>
                  <option>IMPLEMENTADO</option>
                  <option>NO_APLICA</option>
                </select>
              </label>
              <label className="campo-ancho">
                Justificación para la organización
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  required={aplica !== ''}
                  rows={3}
                />
              </label>
              <label className="campo-ancho">
                Insumos organizacionales
                <textarea
                  value={insumos}
                  onChange={(e) => setInsumos(e.target.value)}
                  rows={3}
                />
              </label>
              <label className="campo-ancho">
                Evidencia vinculada
                <select
                  value={evidenciaId}
                  onChange={(e) => setEvidenciaId(e.target.value)}
                >
                  <option value="">Sin evidencia</option>
                  {evidenciasVisibles.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="campo-ancho">
                Plan de tratamiento
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value)}
                >
                  <option value="">Sin plan vinculado</option>
                  {planes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <p className="campo-ancho">
                Al guardar, estos datos se reflejan en la declaración de
                aplicabilidad y su plan de tratamiento exportados.
              </p>
              <div className="formulario-acciones">
                <button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando…' : 'Guardar evaluación'}
                </button>
              </div>
            </form>
          </Asistente>
        )}
      </section>
    </>
  )
}
