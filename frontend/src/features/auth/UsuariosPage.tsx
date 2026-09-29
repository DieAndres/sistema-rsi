import { useEffect, useState } from 'react'
import { apiGet, obtenerToken } from '../../shared/api/apiGet'
import type { Trabajador } from '../organizacion/types/organizacion'
import './auth.css'

type Usuario = { id: string; correo: string; rol: string; activo: boolean; trabajadorId: string | null }
const roles = ['ADMINISTRADOR', 'RSI', 'DUENO_UNIDAD', 'LECTOR']

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
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

  useEffect(() => { void cargar().catch(() => setError('No se pudieron cargar los usuarios.')) }, [])

  async function crear(evento: React.FormEvent) {
    evento.preventDefault(); setMensaje(''); setError('')
    const respuesta = await fetch('/api/v1/auth/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${obtenerToken() ?? ''}` }, body: JSON.stringify({ correo, password, rol, trabajadorId: trabajadorId || undefined }) })
    if (!respuesta.ok) { setError('No se pudo crear el usuario.'); return }
    setCorreo(''); setPassword(''); setRol('LECTOR'); setTrabajadorId(''); setMensaje('Usuario creado correctamente.'); await cargar()
  }

  async function actualizar(usuario: Usuario, cambios: Partial<Usuario>) {
    const respuesta = await fetch(`/api/v1/auth/usuarios/${usuario.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${obtenerToken() ?? ''}` }, body: JSON.stringify(cambios) })
    if (!respuesta.ok) { setError('No se pudo actualizar el usuario.'); return }
    await cargar()
  }

  const nombreTrabajador = (id: string | null) => trabajadores.find((item) => item.id === id)?.nombre ?? 'Sin trabajador vinculado'
  const trabajadoresAsignados = new Set(usuarios.map((usuario) => usuario.trabajadorId).filter(Boolean))
  const trabajadoresDisponibles = trabajadores.filter((trabajador) => !trabajadoresAsignados.has(trabajador.id))
  return <main className="contenido"><div className="encabezado-pagina"><div><p className="sobretitulo">ADMINISTRACIÓN</p><h1>Usuarios</h1><p className="introduccion">Creá y administrá las cuentas del sistema.</p></div></div><section className="panel-estructura"><form className="formulario-usuario" onSubmit={crear}><h2>Nuevo usuario</h2>{error && <p className="mensaje mensaje-error">{error}</p>}{mensaje && <p className="mensaje mensaje-exito">{mensaje}</p>}<label>Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required /></label><label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={12} required /><small>Mínimo 12 caracteres.</small></label><label>Rol<select value={rol} onChange={(e) => setRol(e.target.value)}>{roles.map((opcion) => <option key={opcion}>{opcion}</option>)}</select></label><label>Trabajador<select value={trabajadorId} onChange={(e) => setTrabajadorId(e.target.value)} required={rol !== 'ADMINISTRADOR'}><option value="" disabled={rol !== 'ADMINISTRADOR'}>Sin trabajador vinculado</option>{trabajadoresDisponibles.map((item) => <option key={item.id} value={item.id}>{item.nombre} — {item.cargo}</option>)}</select></label><button type="submit">Crear usuario</button></form><div className="usuarios-lista"><h2>Usuarios existentes</h2>{usuarios.map((usuario) => <article className="usuario-fila" key={usuario.id}><div><strong>{usuario.correo}</strong><small>{nombreTrabajador(usuario.trabajadorId)}</small></div><select value={usuario.rol} onChange={(e) => void actualizar(usuario, { rol: e.target.value })}>{roles.map((opcion) => <option key={opcion} disabled={opcion !== 'ADMINISTRADOR' && !usuario.trabajadorId}>{opcion}</option>)}</select><label className="usuario-activo"><input type="checkbox" checked={usuario.activo} onChange={(e) => void actualizar(usuario, { activo: e.target.checked })} /> Activo</label></article>)}</div></section></main>
}
