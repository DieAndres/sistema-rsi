import { notificarGuardado } from '../../../shared/notificar'
import { PageHeader } from '../../../shared/PageHeader'
import { Asistente } from '../../../shared/Asistente'
import { Acciones } from '../../../shared/Acciones'
import { Badge } from '../../../shared/Badge'
import { Listado } from '../../../shared/Listado'
import { useEffect, useMemo, useState } from 'react'
import {
  listarOrganizaciones,
  listarTrabajadores,
} from '../../organizacion/api/organizacionApi'
import type {
  Organizacion,
  Trabajador,
} from '../../organizacion/types/organizacion'
import { listarRiesgos, type Riesgo } from '../../seguridad/api/seguridadApi'
import {
  actualizarPlan,
  crearHito,
  crearPlan,
  eliminarHito,
  eliminarPlan,
  listarHitos,
  listarPlanes,
  type Hito,
  type Plan,
} from '../api/planesApi'
import '../cumplimiento.css'
export function PlanesPage() {
  const [editando, setEditando] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('PENDIENTE')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [guardando, setGuardando] = useState(false)
  function editar(plan: Plan) {
    setEditando(plan.id)
    setNombre(plan.nombre)
    setTipo(plan.tipo)
    setDescripcion(plan.descripcion ?? '')
    setEstado(plan.estado)
    setFechaInicio(plan.fechaInicio?.slice(0, 10) ?? '')
    setFechaFin(plan.fechaFin?.slice(0, 10) ?? '')
    setResponsableId(plan.responsableId ?? plan.responsable?.id ?? '')
    setRiesgoId(plan.riesgoId ?? '')
    setError('')
    setAsistenteAbierto(true)
  }
  const [cargandoListado, setCargandoListado] = useState(true)

  const [asistenteHitoAbierto, setAsistenteHitoAbierto] = useState(false)
  const [asistenteAbierto, setAsistenteAbierto] = useState(false)
  const [orgs, setOrgs] = useState<Organizacion[]>([])
  const [orgId, setOrgId] = useState('')
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [riesgos, setRiesgos] = useState<Riesgo[]>([])
  const [planes, setPlanes] = useState<Plan[]>([])
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState('TRATAMIENTO')
  const [responsableId, setResponsableId] = useState('')
  const [riesgoId, setRiesgoId] = useState('')
  const [activo, setActivo] = useState('')
  const [hitos, setHitos] = useState<Record<string, Hito[]>>({})
  const [hito, setHito] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    void Promise.all([
      listarOrganizaciones(new AbortController().signal),
      listarTrabajadores(),
      listarRiesgos(),
      listarPlanes(),
    ])
      .then(([o, t, r, p]) => {
        setOrgs(o)
        setOrgId(o[0]?.id ?? '')
        setTrabajadores(t)
        setRiesgos(r)
        setPlanes(p)
      })
      .catch(() => setError('No se pudieron cargar los datos.'))
      .finally(() => setCargandoListado(false))
  }, [])
  const visibles = useMemo(
    () => planes.filter((p) => p.organizacionId === orgId),
    [planes, orgId],
  )
  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!orgId || !nombre.trim()) return
    setGuardando(true)
    try {
      const datos = {
        nombre: nombre.trim(),
        tipo: tipo.trim(),
        descripcion,
        fechaInicio,
        fechaFin,
        responsableId: responsableId || null,
        riesgoId: riesgoId || null,
      }
      if (editando) {
        await actualizarPlan(editando, { ...datos, estado })
      } else {
        await crearPlan(orgId, datos)
      }
      setPlanes(await listarPlanes())
      setNombre('')
      setResponsableId('')
      setRiesgoId('')
      notificarGuardado()
      setAsistenteAbierto(false)
    } catch {
      setError('No se pudo guardar el plan.')
    } finally {
      setGuardando(false)
    }
  }
  async function ver(id: string) {
    try {
      setHitos({ ...hitos, [id]: await listarHitos(id) })
      setActivo(id)
    } catch {
      setError('No se pudieron cargar los hitos.')
    }
  }
  async function guardarHito(e: React.FormEvent) {
    e.preventDefault()
    if (!activo || !hito.trim()) return
    try {
      await crearHito(activo, { nombre: hito.trim() })
      await ver(activo)
      setHito('')
      notificarGuardado()
      setAsistenteHitoAbierto(false)
    } catch {
      setError('No se pudo crear el hito.')
    }
  }
  async function borrarPlan(p: Plan) {
    if (!window.confirm(`¿Eliminar el plan “${p.nombre}”?`)) return
    try {
      await eliminarPlan(p.id)
      setPlanes(await listarPlanes())
    } catch {
      setError('No se pudo eliminar el plan.')
    }
  }
  async function borrarHito(id: string) {
    if (!window.confirm('¿Eliminar este hito?')) return
    try {
      await eliminarHito(id)
      if (activo) await ver(activo)
    } catch {
      setError('No se pudo eliminar el hito.')
    }
  }
  return (
    <div className="aplicacion">
      <main className="contenido">
        <PageHeader
          categoria="CUMPLIMIENTO"
          titulo="Planes e hitos"
          descripcion="Planificá acciones de cumplimiento para la organización."
        >
          <label className="selector-organizacion">
            <span>Organización</span>
            <select
              disabled={asistenteAbierto || guardando}
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                </option>
              ))}
            </select>
          </label>
          <div className="asistente-lanzador">
            <button
              className="boton-principal"
              type="button"
              onClick={() => {
                setEditando('')
                setDescripcion('')
                setEstado('PENDIENTE')
                setFechaInicio('')
                setFechaFin('')
                setNombre('')
                setTipo('TRATAMIENTO')
                setResponsableId('')
                setRiesgoId('')
                setError('')
                setAsistenteAbierto(true)
              }}
            >
              ＋ Nuevo plan
            </button>
          </div>
        </PageHeader>
        {error && (
          <p className="mensaje mensaje-error" role="alert">
            {error}
          </p>
        )}
        <section className="panel-estructura">
          <Asistente
            abierto={asistenteAbierto}
            titulo={editando ? 'Editar plan' : 'Nuevo plan'}
            error={error}
            alCerrar={() => setAsistenteAbierto(false)}
          >
            <form className="formulario-cumplimiento" onSubmit={guardar}>
              <h3>{editando ? 'Editar plan' : 'Nuevo plan'}</h3>
              <label>
                Nombre
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>
              <label>
                Tipo
                <input
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                />
              </label>
              <label>
                Responsable
                <select
                  value={responsableId}
                  onChange={(e) => setResponsableId(e.target.value)}
                >
                  <option value="">Sin responsable</option>
                  {trabajadores.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Riesgo
                <select
                  value={riesgoId}
                  onChange={(e) => setRiesgoId(e.target.value)}
                >
                  <option value="">Sin riesgo</option>
                  {riesgos.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label className="campo-ancho">
                Descripción de la acción
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={3}
                />
              </label>
              <label>
                Fecha de inicio
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </label>
              <label>
                Fecha límite
                <input
                  type="date"
                  min={fechaInicio || undefined}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </label>
              {editando && (
                <label>
                  Estado
                  <input
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  />
                </label>
              )}
              <button type="submit" disabled={guardando}>
                {guardando
                  ? 'Guardando…'
                  : editando
                    ? 'Guardar cambios'
                    : 'Crear plan'}
              </button>
            </form>
          </Asistente>
          <Listado cargando={cargandoListado}>
            {visibles.map((p) => (
              <article className="unidad-tarjeta" key={p.id}>
                <div className="unidad-detalle">
                  <Badge>
                    {p.tipo} · {p.estado}
                  </Badge>
                  <h3>{p.nombre}</h3>
                  <p>
                    Responsable: {p.responsable?.nombre ?? 'Sin responsable'}
                  </p>
                  {activo === p.id && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setHito('')
                          setError('')
                          setAsistenteHitoAbierto(true)
                        }}
                      >
                        ＋ Nuevo hito
                      </button>
                      <Asistente
                        abierto={asistenteHitoAbierto}
                        titulo="Nuevo hito"
                        error={error}
                        alCerrar={() => setAsistenteHitoAbierto(false)}
                      >
                        <form
                          className="formulario-hito"
                          onSubmit={guardarHito}
                        >
                          <input
                            required
                            aria-label="Nombre del hito"
                            placeholder="Nombre del hito"
                            value={hito}
                            onChange={(e) => setHito(e.target.value)}
                          />
                          <button type="submit">Agregar hito</button>
                        </form>
                      </Asistente>
                    </>
                  )}
                  {(hitos[p.id] ?? []).map((h) => (
                    <p className="hito-linea" key={h.id}>
                      • {h.nombre}{' '}
                      <button
                        className="boton-destructivo"
                        type="button"
                        onClick={() => void borrarHito(h.id)}
                      >
                        Eliminar
                      </button>
                    </p>
                  ))}
                </div>
                <Acciones>
                  <button type="button" onClick={() => editar(p)}>
                    Editar
                  </button>
                  <button type="button" onClick={() => void ver(p.id)}>
                    Ver hitos
                  </button>
                  <button
                    className="boton-destructivo"
                    type="button"
                    onClick={() => void borrarPlan(p)}
                  >
                    Eliminar
                  </button>
                </Acciones>
              </article>
            ))}
          </Listado>
        </section>
      </main>
    </div>
  )
}
