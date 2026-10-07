// Remove credentials left by the previous Bearer-based frontend.
localStorage.removeItem('rsi_token')
localStorage.removeItem('rsi_usuario')

export async function apiFetch(ruta: string, init: RequestInit = {}): Promise<Response> {
  if (!ruta.startsWith('/api/v1/')) throw new Error('Ruta de API inválida.')
  const respuesta = await fetch(ruta, { ...init, credentials: 'same-origin', cache: 'no-store' })
  if (respuesta.status === 401 && ruta !== '/api/v1/auth/login') window.dispatchEvent(new Event('rsi-session-ended'))
  return respuesta
}

export async function apiGet<T>(ruta: string, signal: AbortSignal): Promise<T> {
  const respuesta = await apiFetch(ruta, { signal })
  if (!respuesta.ok) throw new Error(`La API respondió con el estado ${respuesta.status}.`)
  return respuesta.json() as Promise<T>
}

export type UsuarioActual = { id: string; correo: string; rol: string; trabajadorId: string | null; unidadOrganizativaId: string | null; organizacionId: string | null; mfaConfirmado?: boolean }
let usuarioActual: UsuarioActual | null = null
export function obtenerUsuarioActual() { return usuarioActual }
export function guardarUsuarioActual(usuario: UsuarioActual) { usuarioActual = usuario }
export function eliminarUsuarioActual() { usuarioActual = null }
