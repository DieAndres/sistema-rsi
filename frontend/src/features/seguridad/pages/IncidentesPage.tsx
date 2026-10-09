import { ImportarCsv } from '../components/ImportarCsv'
import { notificarGuardado } from '../../../shared/notificar'
import { PageHeader } from '../../../shared/PageHeader'
import { Asistente } from '../../../shared/Asistente'
import { Acciones } from '../../../shared/Acciones'
import { Badge } from '../../../shared/Badge'
import { Listado } from '../../../shared/Listado'
import { useEffect, useMemo, useRef, useState } from 'react'
import { listarOrganizaciones, listarTrabajadores, listarUnidades } from '../../organizacion/api/organizacionApi'
import type { Organizacion, Trabajador, Unidad } from '../../organizacion/types/organizacion'
import { actualizarIncidente, crearIncidente, eliminarIncidente, listarActivos, listarIncidentes, type Activo, type DatosIncidente, type Incidente } from '../api/seguridadApi'
import '../seguridad.css'

export function IncidentesPage() {
  const [cargandoListado, setCargandoListado] = useState(true)

  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const etapas = ['ABIERTO', 'CONTENIDO', 'ERRADICADO', 'RECUPERADO', 'CERRADO']
  const [accion, setAccion] = useState('')
  const [seguimiento, setSeguimiento] = useState<Incidente | null>(null)
  const [guardando, setGuardando] = useState(false)
  const tituloSeguimiento = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (seguimiento?.id) { tituloSeguimiento.current?.focus({ preventScroll: true }); tituloSeguimiento.current?.scrollIntoView({ block: 'start' }) } }, [seguimiento?.id])
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]); const [organizacionId, setOrganizacionId] = useState(''); const [unidades, setUnidades] = useState<Unidad[]>([]); const [activos, setActivos] = useState<Activo[]>([]); const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]); const [incidentes, setIncidentes] = useState<Incidente[]>([]); const [editando, setEditando] = useState<Incidente | null>(null); const [activoId, setActivoId] = useState(''); const [titulo, setTitulo] = useState(''); const [descripcion, setDescripcion] = useState(''); const [severidad, setSeveridad] = useState('MEDIA'); const [estado, setEstado] = useState('ABIERTO'); const [lecciones, setLecciones] = useState(''); const [responsableId, setResponsableId] = useState(''); const [error, setError] = useState('')
  useEffect(() => { void Promise.all([listarOrganizaciones(new AbortController().signal), listarTrabajadores(), listarActivos(), listarIncidentes()]).then(([o, t, a, i]) => { setOrganizaciones(o); setOrganizacionId(o[0]?.id ?? ''); setTrabajadores(t); setActivos(a); setIncidentes(i) }).catch(() => setError('No se pudieron cargar los datos.')).finally(() => setCargandoListado(false)) }, [])
  useEffect(() => { if (organizacionId) void listarUnidades(organizacionId, new AbortController().signal).then(setUnidades).catch(() => setError('No se pudieron cargar las unidades.')) }, [organizacionId])
  const ids = useMemo(() => new Set(unidades.map((u) => u.id)), [unidades]); const activosVisibles = activos.filter((a) => ids.has(a.unidadOrganizativa.id)); const incidentesVisibles = incidentes.filter((i) => activosVisibles.some((a) => a.id === i.activoId)); const trabajadoresVisibles = trabajadores.filter((t) => ids.has(t.unidadOrganizativa?.id ?? ''))
  function limpiar() { setAsistenteAbierto(false); setSeguimiento(null); setAccion(''); setError(''); setEditando(null); setActivoId(''); setTitulo(''); setDescripcion(''); setSeveridad('MEDIA'); setEstado('ABIERTO'); setLecciones(''); setResponsableId('') }
  function editar(i: Incidente) { setAsistenteAbierto(true); setSeguimiento(null); setAccion(''); setError(''); setEditando(i); setActivoId(i.activoId); setTitulo(i.titulo); setDescripcion(i.descripcion ?? ''); setSeveridad(i.severidad); setEstado(i.estado); setLecciones(i.leccionesAprendidas ?? ''); setResponsableId(i.responsable?.id ?? '') }
  function abrirSeguimiento(i: Incidente) { limpiar(); setSeguimiento(i); setEstado(i.estado); setLecciones(i.leccionesAprendidas ?? '') }
  async function guardar(e: React.FormEvent) {
    e.preventDefault(); if (guardando) return; setError(''); setGuardando(true)
    const d: DatosIncidente = { activoId, titulo: titulo.trim(), descripcion: descripcion.trim(), severidad, responsableId }
    try { if (editando) await actualizarIncidente(editando.id, d); else await crearIncidente(d); setIncidentes(await listarIncidentes()); notificarGuardado(); limpiar() }
    catch { setError('No se pudo guardar el incidente.') } finally { setGuardando(false) }
  }
  async function guardarSeguimiento(e: React.FormEvent) {
    e.preventDefault(); if (!seguimiento || guardando) return
    setError('')
    if (!accion.trim()) { setError('Describí la acción realizada.'); return }
    if (estado === 'CERRADO' && !lecciones.trim()) { setError('Completá las lecciones aprendidas para cerrar.'); return }
    if (estado === 'CERRADO' && !window.confirm('¿Cerrar este incidente y guardar las lecciones aprendidas?')) return
    setGuardando(true)
    try {
      const actualizado = await actualizarIncidente(seguimiento.id, { estado, accionRealizada: accion.trim(), leccionesAprendidas: lecciones.trim() })
      setIncidentes((lista) => lista.map((i) => i.id === actualizado.id ? actualizado : i))
      setSeguimiento(actualizado); setEstado(actualizado.estado); setAccion(''); notificarGuardado()
    } catch { setError('No se pudo guardar el seguimiento. Verificá la etapa y las lecciones e intentá de nuevo.') }
    finally { setGuardando(false) }
  }
  async function borrar(i: Incidente) { if (!window.confirm(`¿Eliminar el incidente “${i.titulo}”?`)) return; try { await eliminarIncidente(i.id); setIncidentes(await listarIncidentes()); if (seguimiento?.id === i.id || editando?.id === i.id) limpiar() } catch { setError('No se pudo eliminar el incidente.') } }
  return <div className="aplicacion"><main className="contenido"><PageHeader categoria="SEGURIDAD" titulo="Incidentes" descripcion="Registrá y gestioná incidentes asociados a los activos."><label className="selector-organizacion"><span>Organización</span><select disabled={guardando} value={organizacionId} onChange={(e) => { setOrganizacionId(e.target.value); limpiar() }}>{organizaciones.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label>{!seguimiento && <div className="asistente-lanzador"><button className="boton-principal" type="button" onClick={() => { limpiar(); setError(''); setAsistenteAbierto(true) }}>＋ Nuevo incidente</button><ImportarCsv key={organizacionId} tipo="incidentes" organizacionId={organizacionId} organizacionNombre={organizaciones.find(o => o.id === organizacionId)?.nombre ?? ''} unidades={unidades} trabajadores={trabajadoresVisibles} activos={activosVisibles} alImportar={async () => setIncidentes(await listarIncidentes())} /></div>}</PageHeader>{error && <p className="mensaje mensaje-error" role="alert">{error}</p>}<section className="panel-estructura">{!seguimiento && <><Asistente abierto={asistenteAbierto} titulo={editando ? 'Editar incidente' : 'Nuevo incidente'} error={error} alCerrar={limpiar}><form className="formulario-incidente" onSubmit={guardar}><h3>{editando ? 'Editar incidente' : 'Nuevo incidente'}</h3><label>Activo<select value={activoId} onChange={(e) => setActivoId(e.target.value)} disabled={!!editando || guardando} required><option value="">Seleccioná un activo</option>{activosVisibles.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select></label><label>Título<input value={titulo} onChange={(e) => setTitulo(e.target.value)} required /></label><label>Severidad<select value={severidad} onChange={(e) => setSeveridad(e.target.value)}><option>BAJA</option><option>MEDIA</option><option>ALTA</option><option>CRITICA</option></select></label><label>Responsable<select value={responsableId} onChange={(e) => setResponsableId(e.target.value)}><option value="">Sin responsable</option>{trabajadoresVisibles.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></label><label className="campo-ancho">Descripción<textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} /></label><div className="formulario-acciones"><button type="submit" disabled={guardando}>{editando ? 'Guardar cambios' : 'Crear incidente'}</button>{editando && <button type="button" disabled={guardando} onClick={limpiar}>Cancelar</button>}</div></form></Asistente></>}{seguimiento && <section className="seguimiento-incidente" aria-labelledby="titulo-seguimiento">
 <h3 id="titulo-seguimiento" ref={tituloSeguimiento} tabIndex={-1}>Seguimiento: {seguimiento.titulo}</h3>
 <p>{seguimiento.activo.nombre} · Responsable: {seguimiento.responsable?.nombre ?? 'Sin responsable'}</p>
 <ol className="etapas-incidente" aria-label="Recorrido del incidente">{etapas.map((etapa, indice) => <li key={etapa} aria-current={etapa === seguimiento.estado ? 'step' : undefined} className={indice <= etapas.indexOf(seguimiento.estado) ? 'etapa-alcanzada' : ''}>{['Detección', 'Contención', 'Erradicación', 'Recuperación', 'Lecciones y cierre'][indice]}<small>{etapa}</small></li>)}</ol>
 <form className="formulario-incidente" onSubmit={guardarSeguimiento}>
 <label>Etapa de la acción<select value={estado} onChange={(e) => setEstado(e.target.value)} disabled={guardando}>{etapas.map((etapa, indice) => <option key={etapa} disabled={![etapas.indexOf(seguimiento.estado), etapas.indexOf(seguimiento.estado) + 1].includes(indice)}>{etapa}</option>)}</select></label>
 <label className="campo-ancho">Acción realizada<textarea value={accion} onChange={(e) => setAccion(e.target.value)} maxLength={2000} required disabled={guardando} rows={3} placeholder="Describí qué se hizo en esta etapa" /></label>
 <label className="campo-ancho">Lecciones aprendidas<textarea value={lecciones} onChange={(e) => setLecciones(e.target.value)} required={estado === 'CERRADO'} disabled={guardando} rows={3} /></label>
 <p className="campo-ancho">Podés registrar varias acciones en la misma etapa o avanzar a la siguiente. Para cerrar, completá las lecciones aprendidas.</p>
 <div className="formulario-acciones"><button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar seguimiento'}</button><button type="button" disabled={guardando} onClick={limpiar}>Volver</button></div>
 </form>
 <h3>Historial de acciones</h3>{seguimiento.historial?.map((a) => <article className="accion-incidente" key={a.id}><strong>{a.estado}</strong><p>{a.descripcion}</p><small>{a.usuarioCorreo ?? 'Registro anterior sin autor conocido'} · {new Date(a.fecha).toLocaleString()}</small></article>)}
 </section>}<Listado cargando={cargandoListado}>{incidentesVisibles.map((i) => <article className="unidad-tarjeta" key={i.id}><div className="unidad-detalle"><Badge>{i.severidad} · {i.estado}</Badge><h3>{i.titulo}</h3><p>{i.activo.nombre} · Responsable: {i.responsable?.nombre ?? 'Sin responsable'}</p></div><Acciones><button type="button" disabled={guardando} onClick={() => editar(i)}>Editar</button><button type="button" disabled={guardando} onClick={() => abrirSeguimiento(i)}>Seguimiento</button><button className="boton-destructivo" type="button" onClick={() => void borrar(i)}>Eliminar</button></Acciones></article>)}</Listado></section></main></div>
}
