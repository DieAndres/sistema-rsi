import { PageHeader } from '../../shared/PageHeader'
import { useRef, useState } from 'react'
import QRCode from 'qrcode'
import { obtenerToken } from '../../shared/api/apiGet'
import { startRegistration } from '@simplewebauthn/browser'
import './auth.css'

export function MfaPage() {
  const [qr, setQr] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [activado, setActivado] = useState(false)
  const operacion = useRef(false)
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function iniciar() {
    if (operacion.current || activado) return
    operacion.current = true; setOcupado(true); setError(''); setMensaje(''); setCodigo('')
    try {
      const respuesta = await fetch('/api/v1/auth/mfa/setup', { method: 'POST', headers: { Authorization: `Bearer ${obtenerToken() ?? ''}` } })
      if (!respuesta.ok) throw new Error('No se pudo iniciar la configuración MFA. Si ya está activada, no necesitás otro QR.')
      const datos = await respuesta.json() as { otpauthUri: string }
      setQr(await QRCode.toDataURL(datos.otpauthUri, { margin: 2, width: 240 }))
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo generar el QR.') }
    finally { operacion.current = false; setOcupado(false) }
  }

  async function confirmar(evento: React.FormEvent) {
    evento.preventDefault()
    if (operacion.current) return
    operacion.current = true; setOcupado(true); setError(''); setMensaje('')
    try {
      const respuesta = await fetch('/api/v1/auth/mfa/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${obtenerToken() ?? ''}` }, body: JSON.stringify({ codigo: codigo.replace(/\s/g, '') }) })
      if (!respuesta.ok) {
        if (respuesta.status === 401) throw new Error('El código no coincide. Usá el QR mostrado, comprobá la hora automática del teléfono e intentá con un código nuevo.')
        throw new Error('No se pudo confirmar MFA. Recargá la página e intentá nuevamente.')
      }
      setMensaje('MFA activado correctamente. A partir del próximo inicio de sesión deberás ingresar el código.')
      setActivado(true); setQr(''); setCodigo('')
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo confirmar MFA.') }
    finally { operacion.current = false; setOcupado(false) }
  }
  async function registrarPasskey() {
    setError(''); setMensaje('')
    try {
      const headers = { Authorization: `Bearer ${obtenerToken() ?? ''}` }
      const inicio = await fetch('/api/v1/auth/passkey/register/options', { method: 'POST', headers })
      if (!inicio.ok) throw new Error('No se pudo iniciar el registro de passkey.')
      const { challengeId, options } = await inicio.json()
      const response = await startRegistration({ optionsJSON: options })
      const final = await fetch('/api/v1/auth/passkey/register/verify', { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ challengeId, response }) })
      if (!final.ok) throw new Error('No se pudo verificar la passkey.')
      setMensaje('Passkey registrada. Podés usarla en el próximo inicio de sesión.')
    } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo registrar la passkey.') }
  }

  return <main className="contenido"><PageHeader categoria="SEGURIDAD DE CUENTA" titulo="Seguridad de cuenta" descripcion="Configurá un segundo factor para proteger el acceso a RSI." />{error && <p className="mensaje mensaje-error" role="alert">{error}</p>}{mensaje && <p className="mensaje mensaje-exito" role="status">{mensaje}</p>}<div className="mfa-secciones"><section className="panel-estructura"><div className="panel-encabezado"><div><p className="sobretitulo">CÓDIGO TEMPORAL</p><h2>Aplicación autenticadora</h2></div></div><p className="introduccion">Generá el código QR y escanealo con Google Authenticator.</p><button className="mfa-setup-button boton-principal" type="button" disabled={ocupado || activado} onClick={() => void iniciar()}>Generar código QR</button>{qr && <><img className="mfa-qr" src={qr} alt="Código QR para Google Authenticator" /><p className="introduccion">Agregá una cuenta en tu aplicación y escaneá este código.</p><form className="mfa-form" onSubmit={confirmar}><label>Código de seis dígitos<input inputMode="numeric" pattern="[0-9]{6}" maxLength={12} value={codigo} onChange={(e) => setCodigo(e.target.value.replace(/\s/g, '').slice(0, 6))} required autoComplete="one-time-code" /></label><button type="submit" disabled={ocupado}>Confirmar MFA</button></form></>}</section><section className="panel-estructura"><div className="panel-encabezado"><div><p className="sobretitulo">ACCESO CON EL DISPOSITIVO</p><h2>Passkey / Windows Hello</h2></div></div><p className="introduccion">Registrá una passkey en este dispositivo o una llave de seguridad. Windows Hello puede solicitar PIN, huella o rostro.</p><button className="mfa-passkey-button" type="button" onClick={() => void registrarPasskey()}>Registrar passkey</button></section></div></main>
}
