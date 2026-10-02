import { notificarGuardado } from '../../../shared/notificar'
import { PageHeader } from '../../../shared/PageHeader'
import { Asistente } from '../../../shared/Asistente'
import { Listado } from '../../../shared/Listado'
import { useEffect, useState } from 'react'
import { actualizarOrganizacion, crearOrganizacion, listarOrganizaciones } from '../api/organizacionApi'
import type { Organizacion } from '../types/organizacion'
import '../organizacion.css'

export function OrganizacionesPage() {
  const [cargandoListado, setCargandoListado] = useState(true)

  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]); const [editando, setEditando] = useState<Organizacion | null>(null); const [nombre, setNombre] = useState(''); const [alcance, setAlcance] = useState(''); const [error, setError] = useState('')
  async function cargar() { setOrganizaciones(await listarOrganizaciones(new AbortController().signal)) }
  useEffect(() => { async function cargarInicial() { try { await cargar() } catch { setError('No se pudieron cargar las organizaciones.') } finally { setCargandoListado(false) } } void cargarInicial() }, [])
  function limpiar() { setAsistenteAbierto(false); setEditando(null); setNombre(''); setAlcance('') }
  function editar(o: Organizacion) { setAsistenteAbierto(true); setError(''); setEditando(o); setNombre(o.nombre); setAlcance(o.alcanceSgsi ?? '') }
  async function guardar(e: React.FormEvent) { e.preventDefault(); if (!nombre.trim()) return; try { const datos = { nombre: nombre.trim(), alcanceSgsi: alcance.trim() }; if (editando) await actualizarOrganizacion(editando.id, datos); else await crearOrganizacion(datos); await cargar(); notificarGuardado(); limpiar() } catch { setError('No se pudo guardar la organización.') } }
  return <div className="aplicacion"><main className="contenido"><PageHeader categoria="ORGANIZACIÓN" titulo="Organizaciones" descripcion="Registrá las organizaciones sobre las que se gestionará la información."><div className="asistente-lanzador"><button className="boton-principal" type="button" onClick={() => { limpiar(); setError(''); setAsistenteAbierto(true) }}>＋ Nueva organización</button></div></PageHeader>{error && <p className="mensaje mensaje-error" role="alert">{error}</p>}<section className="panel-estructura"><Asistente abierto={asistenteAbierto} titulo={editando ? 'Editar organización' : 'Nueva organización'} error={error} alCerrar={limpiar}><form className="formulario-organizacion" onSubmit={guardar}><h3>{editando ? 'Editar organización' : 'Nueva organización'}</h3><label>Nombre<input value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label><label>Alcance del SGSI<textarea value={alcance} onChange={(e) => setAlcance(e.target.value)} rows={3} /></label><div className="formulario-acciones"><button type="submit">{editando ? 'Guardar cambios' : 'Crear organización'}</button>{editando && <button type="button" onClick={limpiar}>Cancelar</button>}</div></form></Asistente><Listado cargando={cargandoListado}>{organizaciones.map((o) => <article className="unidad-tarjeta" key={o.id}><div className="unidad-detalle"><h3>{o.nombre}</h3><p>{o.alcanceSgsi || 'Sin alcance del SGSI definido'}</p></div><button type="button" onClick={() => editar(o)}>Editar</button></article>)}</Listado></section></main></div>
}
