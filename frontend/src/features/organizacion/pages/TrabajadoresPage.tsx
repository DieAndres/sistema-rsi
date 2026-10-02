import { notificarGuardado } from '../../../shared/notificar'
import { PageHeader } from '../../../shared/PageHeader'
import { Asistente } from '../../../shared/Asistente'
import { Acciones } from '../../../shared/Acciones'
import { Listado } from '../../../shared/Listado'
import { useEffect, useMemo, useState } from 'react'
import {
  actualizarTrabajador, crearTrabajador, eliminarTrabajador, listarOrganizaciones,
  listarTrabajadores, listarUnidades,
} from '../api/organizacionApi'
import type { Organizacion, Trabajador, Unidad } from '../types/organizacion'
import { obtenerUsuarioActual } from '../../../shared/api/apiGet'
import '../organizacion.css'

export function TrabajadoresPage() {
  const [cargandoListado, setCargandoListado] = useState(true)

  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([])
  const [organizacionId, setOrganizacionId] = useState('')
  const [unidades, setUnidades] = useState<Unidad[]>([])
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [unidadId, setUnidadId] = useState('')
  const [editando, setEditando] = useState<Trabajador | null>(null)
  const [nombre, setNombre] = useState('')
  const [cargo, setCargo] = useState('')
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const usuario = obtenerUsuarioActual()
  const unidadFija = ['DUENO_UNIDAD', 'LECTOR'].includes(usuario?.rol ?? '')

  useEffect(() => { void Promise.all([listarOrganizaciones(new AbortController().signal), listarTrabajadores()]).then(([o, t]) => {
    setOrganizaciones(o); setOrganizacionId(o[0]?.id ?? ''); setTrabajadores(t)
  }).catch(() => setError('No se pudieron cargar los datos.')).finally(() => setCargandoListado(false)) }, [])

  useEffect(() => { if (organizacionId) void listarUnidades(organizacionId, new AbortController().signal).then((u) => {
    setUnidades(u); setUnidadId((actual) => u.some((x) => x.id === actual) ? actual : u[0]?.id ?? '')
  }).catch(() => setError('No se pudieron cargar las unidades.')) }, [organizacionId])

  const unidadesVisibles = unidadFija && usuario?.unidadOrganizativaId
    ? unidades.filter((unidad) => unidad.id === usuario.unidadOrganizativaId)
    : unidades
  const idsUnidades = useMemo(() => new Set(unidadesVisibles.map((u) => u.id)), [unidadesVisibles])
  const visibles = trabajadores.filter((t) => t.unidadOrganizativa && idsUnidades.has(t.unidadOrganizativa.id))

  function limpiar() { setAsistenteAbierto(false); setEditando(null); setNombre(''); setCargo(''); setCorreo('') }
  function editar(t: Trabajador) { setAsistenteAbierto(true); setError(''); setEditando(t); setUnidadId(t.unidadOrganizativa?.id ?? unidadId); setNombre(t.nombre); setCargo(t.cargo); setCorreo(t.correo ?? '') }

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault(); if (!unidadId || !nombre.trim() || !cargo.trim()) return
    try {
      const datos = { nombre: nombre.trim(), cargo: cargo.trim(), ...(correo.trim() && { correo: correo.trim() }) }
      if (editando) await actualizarTrabajador(editando.id, datos); else await crearTrabajador(unidadId, datos)
      setTrabajadores(await listarTrabajadores()); notificarGuardado(); limpiar()
    } catch { setError('No se pudo guardar el trabajador.') }
  }
  async function borrar(t: Trabajador) {
    if (!window.confirm(`¿Eliminar a “${t.nombre}”?`)) return
    try { await eliminarTrabajador(t.id); setTrabajadores(await listarTrabajadores()) } catch { setError('No se pudo eliminar el trabajador.') }
  }

  return <div className="aplicacion"><main className="contenido">
    <PageHeader categoria="ORGANIZACIÓN" titulo="Trabajadores" descripcion="Administrá las personas y la unidad a la que pertenecen."><label className="selector-organizacion"><span>Organización</span><select value={organizacionId} onChange={(e) => setOrganizacionId(e.target.value)} disabled={unidadFija}>{organizaciones.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label><div className="asistente-lanzador"><button className="boton-principal" type="button" onClick={() => { limpiar(); setError(''); setAsistenteAbierto(true) }}>＋ Nuevo trabajador</button></div></PageHeader>
    {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
    <section className="panel-estructura"><Asistente abierto={asistenteAbierto} titulo={editando ? 'Editar trabajador' : 'Nuevo trabajador'} error={error} alCerrar={limpiar}><form className="formulario-unidad" onSubmit={guardar}><h3>{editando ? 'Editar trabajador' : 'Nuevo trabajador'}</h3><label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label>Cargo<input value={cargo} onChange={(e) => setCargo(e.target.value)} required /></label><label>Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} /></label><label>Unidad<select value={unidadId} onChange={(e) => setUnidadId(e.target.value)} disabled={unidadFija} required>{unidadesVisibles.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></label><div className="formulario-acciones"><button type="submit">{editando ? 'Guardar cambios' : 'Crear trabajador'}</button>{editando && <button type="button" onClick={limpiar}>Cancelar</button>}</div></form></Asistente>
      {visibles.length === 0 ? <div className="estado-vacio"><h3>No hay trabajadores registrados</h3><p>Creá el primero para esta organización.</p></div> : <Listado cargando={cargandoListado}>{visibles.map((t) => <article className="unidad-tarjeta" key={t.id}><div className="unidad-detalle"><h3>{t.nombre}</h3><p>{t.cargo} · {t.unidadOrganizativa?.nombre}{t.correo && ` · ${t.correo}`}</p></div><Acciones><button type="button" onClick={() => editar(t)}>Editar</button><button className="boton-destructivo" type="button" onClick={() => void borrar(t)}>Eliminar</button></Acciones></article>)}</Listado>}
    </section></main></div>
}
