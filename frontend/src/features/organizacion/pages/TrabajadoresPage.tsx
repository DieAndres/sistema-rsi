import { useEffect, useMemo, useState } from 'react'
import {
  actualizarTrabajador, crearTrabajador, eliminarTrabajador, listarOrganizaciones,
  listarTrabajadores, listarUnidades,
} from '../api/organizacionApi'
import type { Organizacion, Trabajador, Unidad } from '../types/organizacion'
import '../organizacion.css'

export function TrabajadoresPage() {
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

  useEffect(() => { void Promise.all([listarOrganizaciones(new AbortController().signal), listarTrabajadores()]).then(([o, t]) => {
    setOrganizaciones(o); setOrganizacionId(o[0]?.id ?? ''); setTrabajadores(t)
  }).catch(() => setError('No se pudieron cargar los datos.')) }, [])

  useEffect(() => { if (organizacionId) void listarUnidades(organizacionId, new AbortController().signal).then((u) => {
    setUnidades(u); setUnidadId((actual) => u.some((x) => x.id === actual) ? actual : u[0]?.id ?? '')
  }).catch(() => setError('No se pudieron cargar las unidades.')) }, [organizacionId])

  const idsUnidades = useMemo(() => new Set(unidades.map((u) => u.id)), [unidades])
  const visibles = trabajadores.filter((t) => t.unidadOrganizativa && idsUnidades.has(t.unidadOrganizativa.id))

  function limpiar() { setEditando(null); setNombre(''); setCargo(''); setCorreo('') }
  function editar(t: Trabajador) { setEditando(t); setUnidadId(t.unidadOrganizativa?.id ?? unidadId); setNombre(t.nombre); setCargo(t.cargo); setCorreo(t.correo ?? '') }

  async function guardar(evento: React.FormEvent) {
    evento.preventDefault(); if (!unidadId || !nombre.trim() || !cargo.trim()) return
    try {
      const datos = { nombre: nombre.trim(), cargo: cargo.trim(), ...(correo.trim() && { correo: correo.trim() }) }
      if (editando) await actualizarTrabajador(editando.id, datos); else await crearTrabajador(unidadId, datos)
      setTrabajadores(await listarTrabajadores()); limpiar()
    } catch { setError('No se pudo guardar el trabajador.') }
  }
  async function borrar(t: Trabajador) {
    if (!window.confirm(`¿Eliminar a “${t.nombre}”?`)) return
    try { await eliminarTrabajador(t.id); setTrabajadores(await listarTrabajadores()) } catch { setError('No se pudo eliminar el trabajador.') }
  }

  return <div className="aplicacion"><header className="barra-superior"><span className="marca"><span className="marca-simbolo">R</span><span className="marca-texto"><strong>RSI</strong><small>Gestión integrada</small></span></span><span className="entorno">Sistema de gestión</span></header><main className="contenido">
    <div className="encabezado-pagina"><div><p className="sobretitulo">ORGANIZACIÓN</p><h1>Trabajadores</h1><p className="introduccion">Administrá las personas y la unidad a la que pertenecen.</p></div><label className="selector-organizacion"><span>Organización</span><select value={organizacionId} onChange={(e) => setOrganizacionId(e.target.value)}>{organizaciones.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label></div>
    {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
    <section className="panel-estructura"><form className="formulario-unidad" onSubmit={guardar}><h3>{editando ? 'Editar trabajador' : 'Nuevo trabajador'}</h3><label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label>Cargo<input value={cargo} onChange={(e) => setCargo(e.target.value)} required /></label><label>Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} /></label><label>Unidad<select value={unidadId} onChange={(e) => setUnidadId(e.target.value)} required>{unidades.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></label><div className="formulario-acciones"><button type="submit">{editando ? 'Guardar cambios' : 'Crear trabajador'}</button>{editando && <button type="button" onClick={limpiar}>Cancelar</button>}</div></form>
      {visibles.length === 0 ? <div className="estado-vacio"><h3>No hay trabajadores registrados</h3><p>Creá el primero para esta organización.</p></div> : <div className="lista-trabajadores">{visibles.map((t) => <article className="unidad-tarjeta" key={t.id}><div className="unidad-detalle"><h3>{t.nombre}</h3><p>{t.cargo} · {t.unidadOrganizativa?.nombre}{t.correo && ` · ${t.correo}`}</p></div><div className="unidad-acciones"><button type="button" onClick={() => editar(t)}>Editar</button><button type="button" onClick={() => void borrar(t)}>Eliminar</button></div></article>)}</div>}
    </section></main></div>
}
