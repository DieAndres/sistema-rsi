import { useState } from 'react'
import { guardarToken, guardarUsuarioActual } from '../../shared/api/apiGet'
import { startAuthentication } from '@simplewebauthn/browser'
import './auth.css'

type UsuarioLogin = { id: string; correo: string; rol: string; trabajadorId: string | null; unidadOrganizativaId: string | null; organizacionId: string | null; mfaConfirmado: boolean }

export function LoginPage({ onLogin }: { onLogin: (mfaSetupRequired: boolean | undefined, usuario: UsuarioLogin) => void }) {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [codigoMfa, setCodigoMfa] = useState('')
  const [requiereMfa, setRequiereMfa] = useState(false)

  async function ingresar(evento: React.FormEvent) {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      const respuesta = await fetch('/api/v1/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo, password, ...(codigoMfa && { codigoMfa }) }) })
      if (!respuesta.ok) {
        const detalle = await respuesta.json() as { message?: string }
        if (detalle.message?.includes('MFA')) setRequiereMfa(true)
        throw new Error(detalle.message?.includes('MFA') ? 'Ingresá el código de tu aplicación autenticadora.' : 'Correo o contraseña incorrectos.')
      }
      const datos = await respuesta.json() as { token: string; mfaSetupRequired?: boolean; usuario: UsuarioLogin }
      guardarToken(datos.token)
      guardarUsuarioActual(datos.usuario)
      onLogin(datos.mfaSetupRequired, datos.usuario)
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.') }
    finally { setCargando(false) }
  }

  async function ingresarConPasskey() {
    setError(''); setCargando(true)
    try {
      const inicio = await fetch('/api/v1/auth/passkey/login/options', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo }) })
      if (!inicio.ok) throw new Error('Esta cuenta no tiene una passkey registrada.')
      const { challengeId, options } = await inicio.json()
      const response = await startAuthentication({ optionsJSON: options })
      const final = await fetch('/api/v1/auth/passkey/login/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ challengeId, response, codigoMfa }) })
      if (!final.ok) { setRequiereMfa(true); throw new Error('No se pudo verificar la passkey. Si usás una llave U2F, ingresá también el código MFA.') }
      const datos = await final.json() as { token: string; mfaSetupRequired?: boolean; usuario: UsuarioLogin }
      guardarToken(datos.token); guardarUsuarioActual(datos.usuario); onLogin(datos.mfaSetupRequired, datos.usuario)
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión con passkey.') }
    finally { setCargando(false) }
  }

  return <main className="login-pagina"><form className="login-panel" onSubmit={ingresar}><p className="sobretitulo">SISTEMA RSI</p><h1>Iniciar sesión</h1><p className="introduccion">Accedé con tu cuenta autorizada.</p>{error && <p className="mensaje mensaje-error">{error}</p>}<label>Correo<input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required autoComplete="username" /></label><label>Contraseña<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>{requiereMfa && <label>Código MFA<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={codigoMfa} onChange={(e) => setCodigoMfa(e.target.value)} autoComplete="one-time-code" /></label>}<button type="submit" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar'}</button><button type="button" disabled={cargando || !correo} onClick={() => void ingresarConPasskey()}>Entrar con passkey / Windows Hello</button></form></main>
}
