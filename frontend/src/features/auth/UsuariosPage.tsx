import { Listado } from '../../shared/Listado'
import { PageHeader } from '../../shared/PageHeader'
import { Asistente } from '../../shared/Asistente'
import { useEffect, useState } from 'react'
import { apiGet, obtenerToken } from '../../shared/api/apiGet'
import type { Trabajador } from '../organizacion/types/organizacion'
import './auth.css'

type Usuario = { id: string; correo: string; rol: string; activo: boolean; trabajadorId: string | null }
const roles = ['ADMINISTRADOR', 'RSI', 'DUENO_UNIDAD', 'LECTOR']

export function UsuariosPage() {
  const [cargandoListado, setCargandoListado] = useState(true)
  const [asistenteAbierto, setAsistenteAbierto] = useState(false)

  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [datosUsuario, setDatosUsuario] = useState({ rol: 'LECTOR', activo: true })
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [algoritmo, setAlgoritmo] = useState<'argon2' | 'bcrypt'>('argon2')
  const [rol, setRol] = useState('LECTOR')
  const [trabajadorId, setTrabajadorId] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function cargar() {
    const [lista, trabajadoresDisponibles] = await Promise.all([
      apiGet<Usuario[]>('/api/v1/auth/usuarios', new AbortController().signal),
      apiGet<Trabajador[]>('/api/v1/organizaciones/trabajadores', new AbortController().signal),
    ])
    setUsuarios(lista)
    setTrabajadores(trabajadoresDisponibles)
  }

  useEffect(() => { async function cargarInicial() { try { await cargar() } catch { setError('No se pudieron cargar los usuarios.') } finally { setCargandoListado(false) } } void cargarInicial() }, [])

  async function crear(evento: React.FormEvent) {
    evento.preventDefault(); setMensaje(''); setError('')
    const respuesta = await fetch('/api/v1/auth/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${obtenerToken() ?? ''}` }, body: JSON.stringify({ correo, password, algoritmo, rol, trabajadorId: trabajadorId || undefined }) })
    if (!respuesta.ok) { setError('No se pudo crear el usuario.'); return }
    setCorreo(''); setPassword(''); setRol('LECTOR'); setTrabajadorId(''); setMensaje('Usuario creado correctamente.'); await cargar(); setAsistenteAbierto(false)
  }

  async function actualizar(usuario: Usuario, cambios: Partial<Usuario>) {
    const respuesta = await fetch(`/api/v1/auth/usuarios/${usuario.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${obtenerToken() ?? ''}` }, body: JSON.stringify(cambios) })
    if (!respuesta.ok) { setError('No se pudo actualizar el usuario.'); return false }
    await cargar()
    return true
  }

  const nombreTrabajador = (id: string | null) => trabajadores.find((item) => item.id === id)?.nombre ?? 'Sin trabajador vinculado'
  const trabajadoresAsignados = new Set(usuarios.map((usuario) => usuario.trabajadorId).filter(Boolean))
  const trabajadoresDisponibles = trabajadores.filter((trabajador) => !trabajadoresAsignados.has(trabajador.id))
  return <main className="contenido"><PageHeader categoria="ADMINISTRACIÓN" titulo="Usuarios" descripcion="Creá y administrá las cuentas del sistema."><div className="asistente-lanzador"><button className="boton-principal" type="button" onClick={() => { setCorreo(''); setPassword(''); setRol('LECTOR'); setTrabajadorId(''); setAlgoritmo('argon2'); setMensaje(''); setError(''); setAsistenteAbierto(true) }}>＋ Nuevo usuario</button></div></PageHeader><section className="panel-estructura"><Asistente abierto={asistenteAbierto} titulo={"Nuevo usuario"} error={error} alCerrar={() => setAsistenteAbierto(false)}><form className="formulario-usuario" onSubmit={crear}><h2>Nuevo usuario</h2>{error && <p className="mensaje mensaje-error">{error}</p>}{mensaje && <p className="mensaje mensaje-exito">{mensaje}</p>}<label>Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={12} required /><small>Mínimo 12 caracteres.</small></label><label>Algoritmo de contraseña<select value={algoritmo} onChange={(e) => setAlgoritmo(e.target.value as 'argon2' | 'bcrypt')}><option value="argon2">Argon2id</option><option value="bcrypt">bcrypt</option></select></label><label>Rol<select value={rol} onChange={(e) => setRol(e.target.value)}>{roles.map((opcion) => <option key={opcion}>{opcion}</option>)}</select></label><label>Trabajador<select value={trabajadorId} onChange={(e) => setTrabajadorId(e.target.value)} required={rol !== 'ADMINISTRADOR'}><option value="" disabled={rol !== 'ADMINISTRADOR'}>Sin trabajador vinculado</option>{trabajadoresDisponibles.map((item) => <option key={item.id} value={item.id}>{item.nombre} — {item.cargo}</option>)}</select></label><button type="submit">Crear usuario</button></form></Asistente>{mensaje && <p className="mensaje mensaje-exito" role="status">{mensaje}</p>}{error && !asistenteAbierto && !usuarioEditando && <p className="mensaje mensaje-error" role="alert">{error}</p>}<Asistente abierto={!!usuarioEditando} titulo="Editar usuario" error={error} alCerrar={() => setUsuarioEditando(null)}><form className="formulario-usuario" onSubmit={async e => { e.preventDefault(); setError(''); if (usuarioEditando && await actualizar(usuarioEditando, datosUsuario)) { setUsuarioEditando(null); setMensaje('Usuario actualizado correctamente.') } }}><p>{usuarioEditando?.correo}</p><label>Rol<select value={datosUsuario.rol} onChange={e => setDatosUsuario({ ...datosUsuario, rol: e.target.value })}>{roles.map(opcion => <option key={opcion} disabled={opcion !== 'ADMINISTRADOR' && !usuarioEditando?.trabajadorId}>{opcion}</option>)}</select></label><label className="usuario-activo"><input type="checkbox" checked={datosUsuario.activo} onChange={e => setDatosUsuario({ ...datosUsuario, activo: e.target.checked })} /> Activo</label></form></Asistente><div className="usuarios-lista"><h2>Usuarios existentes</h2><Listado cargando={cargandoListado}>{usuarios.map((usuario) => <article className="usuario-fila" key={usuario.id}><div><strong>{usuario.correo}</strong><small>{nombreTrabajador(usuario.trabajadorId)}</small></div><span>{usuario.rol.replaceAll('_', ' ')} · {usuario.activo ? 'Activo' : 'Inactivo'}</span><button type="button" onClick={() => { setError(''); setUsuarioEditando(usuario); setDatosUsuario({ rol: usuario.rol, activo: usuario.activo }) }}>Editar</button></article>)}</Listado></div></section></main>
}
