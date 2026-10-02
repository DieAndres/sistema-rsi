import { notificarGuardado } from '../../../shared/notificar'
import { PageHeader } from '../../../shared/PageHeader'
import { Asistente } from '../../../shared/Asistente'
import { Acciones } from '../../../shared/Acciones'
import { Badge } from '../../../shared/Badge'
import { Listado } from '../../../shared/Listado'
import { useEffect, useMemo, useState } from 'react'
import { actualizarProceso, crearProceso, eliminarProceso, listarOrganizaciones, listarProcesos, listarTrabajadores } from '../api/organizacionApi'
import type { Organizacion, Trabajador } from '../types/organizacion'
import type { DatosProceso, Proceso } from '../api/organizacionApi'
import '../organizacion.css'

export function ProcesosPage() {
  const [cargandoListado, setCargandoListado] = useState(true)

  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]); const [organizacionId, setOrganizacionId] = useState('')
  const [procesos, setProcesos] = useState<Proceso[]>([]); const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]); const [editando, setEditando] = useState<Proceso | null>(null)
  const [nombre, setNombre] = useState(''); const [descripcion, setDescripcion] = useState(''); const [estado, setEstado] = useState('BORRADOR'); const [version, setVersion] = useState('1.0'); const [responsableId, setResponsableId] = useState(''); const [error, setError] = useState('')
  useEffect(() => { void Promise.all([listarOrganizaciones(new AbortController().signal), listarProcesos(), listarTrabajadores()]).then(([o, p, t]) => { setOrganizaciones(o); setOrganizacionId(o[0]?.id ?? ''); setProcesos(p); setTrabajadores(t) }).catch(() => setError('No se pudieron cargar los datos.')).finally(() => setCargandoListado(false)) }, [])
  const visibles = useMemo(() => procesos.filter((p) => p.organizacionId === organizacionId), [procesos, organizacionId])
  function limpiar() { setAsistenteAbierto(false); setEditando(null); setNombre(''); setDescripcion(''); setEstado('BORRADOR'); setVersion('1.0'); setResponsableId('') }
  function editar(p: Proceso) { setAsistenteAbierto(true); setError(''); setEditando(p); setNombre(p.nombre); setDescripcion(p.descripcion ?? ''); setEstado(p.estado); setVersion(p.version); setResponsableId(p.responsable?.id ?? '') }
  async function guardar(e: React.FormEvent) { e.preventDefault(); if (!organizacionId || !nombre.trim()) return; const d: DatosProceso = { nombre: nombre.trim(), descripcion: descripcion.trim(), estado, version, ...(responsableId && { responsableId }) }; try { if (editando) await actualizarProceso(editando.id, d); else await crearProceso(organizacionId, d); setProcesos(await listarProcesos()); notificarGuardado(); limpiar() } catch { setError('No se pudo guardar el proceso.') } }
  async function borrar(p: Proceso) { if (!window.confirm(`¿Eliminar el proceso “${p.nombre}”?`)) return; try { await eliminarProceso(p.id); setProcesos(await listarProcesos()) } catch { setError('No se pudo eliminar el proceso.') } }
  return <div className="aplicacion"><main className="contenido"><PageHeader categoria="ORGANIZACIÓN" titulo="Procesos" descripcion="Registrá los procesos de la organización y su responsable."><label className="selector-organizacion"><span>Organización</span><select value={organizacionId} onChange={(e) => setOrganizacionId(e.target.value)}>{organizaciones.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label><div className="asistente-lanzador"><button className="boton-principal" type="button" onClick={() => { limpiar(); setError(''); setAsistenteAbierto(true) }}>＋ Nuevo proceso</button></div></PageHeader>{error && <p className="mensaje mensaje-error" role="alert">{error}</p>}<section className="panel-estructura"><Asistente abierto={asistenteAbierto} titulo={editando ? 'Editar proceso' : 'Nuevo proceso'} error={error} alCerrar={limpiar}><form className="formulario-proceso" onSubmit={guardar}><h3>{editando ? 'Editar proceso' : 'Nuevo proceso'}</h3><label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label>Versión<input value={version} onChange={(e) => setVersion(e.target.value)} /></label><label>Estado<select value={estado} onChange={(e) => setEstado(e.target.value)}><option>BORRADOR</option><option>ACTIVO</option><option>INACTIVO</option></select></label><label>Responsable<select value={responsableId} onChange={(e) => setResponsableId(e.target.value)}><option value="">Sin responsable</option>{trabajadores.map((t) => <option key={t.id} value={t.id}>{t.nombre} · {t.cargo}</option>)}</select></label><label className="campo-ancho">Descripción<textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} /></label><div className="formulario-acciones"><button type="submit">{editando ? 'Guardar cambios' : 'Crear proceso'}</button>{editando && <button type="button" onClick={limpiar}>Cancelar</button>}</div></form></Asistente><Listado cargando={cargandoListado}>{visibles.map((p) => <article className="unidad-tarjeta" key={p.id}><div className="unidad-detalle"><Badge>{p.estado} · v{p.version}</Badge><h3>{p.nombre}</h3><p>{p.descripcion || 'Sin descripción'} · Responsable: {p.responsable?.nombre ?? 'Sin responsable'}</p></div><Acciones><button type="button" onClick={() => editar(p)}>Editar</button><button className="boton-destructivo" type="button" onClick={() => void borrar(p)}>Eliminar</button></Acciones></article>)}</Listado></section></main></div>
}
