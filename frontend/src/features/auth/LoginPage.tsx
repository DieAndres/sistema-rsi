import { useState } from 'react'
import { guardarToken, guardarUsuarioActual } from '../../shared/api/apiGet'
import './auth.css'

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function ingresar(evento: React.FormEvent) {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      const respuesta = await fetch('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo, password }) })
      if (!respuesta.ok) throw new Error('Correo o contraseña incorrectos.')
      const datos = await respuesta.json() as { token: string; usuario: { id: string; correo: string; rol: string; trabajadorId: string | null; unidadOrganizativaId: string | null; organizacionId: string | null } }
      guardarToken(datos.token)
      guardarUsuarioActual(datos.usuario)
      onLogin()
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.') }
    finally { setCargando(false) }
  }

  return <main className="login-pagina"><form className="login-panel" onSubmit={ingresar}><p className="sobretitulo">SISTEMA RSI</p><h1>Iniciar sesión</h1><p className="introduccion">Accedé con tu cuenta autorizada.</p>{error && <p className="mensaje mensaje-error">{error}</p>}<label>Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoComplete="username" /></label><label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label><button type="submit" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar'}</button></form></main>
}
