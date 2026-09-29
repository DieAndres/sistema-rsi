import { useState } from 'react'
import QRCode from 'qrcode'
import { obtenerToken } from '../../shared/api/apiGet'
import './auth.css'

export function MfaPage() {
  const [qr, setQr] = useState('')
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  async function iniciar() {
    setError('')
    const respuesta = await fetch('/api/v1/auth/mfa/setup', { method: 'POST', headers: { Authorization: `Bearer ${obtenerToken() ?? ''}` } })
    if (!respuesta.ok) { setError('No se pudo iniciar la configuración MFA.'); return }
    const datos = await respuesta.json() as { otpauthUri: string }
    setQr(await QRCode.toDataURL(datos.otpauthUri, { margin: 2, width: 240 }))
  }

  async function confirmar(evento: React.FormEvent) {
    evento.preventDefault(); setError(''); setMensaje('')
    const respuesta = await fetch('/api/v1/auth/mfa/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${obtenerToken() ?? ''}` }, body: JSON.stringify({ codigo }) })
    if (!respuesta.ok) { setError('El código MFA no es válido.'); return }
    setMensaje('MFA activado correctamente. A partir del próximo inicio de sesión deberás ingresar el código.')
    setCodigo('')
  }

  return <main className="contenido"><div className="encabezado-pagina"><div><p className="sobretitulo">SEGURIDAD DE CUENTA</p><h1>MFA / TOTP</h1><p className="introduccion">Protegé tu cuenta con un código temporal de seis dígitos.</p></div></div><section className="panel-estructura formulario-usuario"><h2>Activar autenticación multifactor</h2><p>Generá la configuración y escaneala con Google Authenticator.</p><button type="button" onClick={() => void iniciar()}>Generar código QR</button>{qr && <><img className="mfa-qr" src={qr} alt="Código QR para Google Authenticator" /><p className="introduccion">Abrí Google Authenticator, elegí agregar una cuenta y escaneá este código.</p><form onSubmit={confirmar}><label>Código de seis dígitos<input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={codigo} onChange={(e) => setCodigo(e.target.value)} required autoComplete="one-time-code" /></label><button type="submit">Confirmar MFA</button></form></>}{error && <p className="mensaje mensaje-error">{error}</p>}{mensaje && <p className="mensaje mensaje-exito">{mensaje}</p>}</section></main>
}
