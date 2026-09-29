export async function apiGet<T>(ruta: string, signal: AbortSignal): Promise<T> {
  const token = localStorage.getItem('rsi_token')
  const respuesta = await fetch(ruta, { signal, headers: token ? { Authorization: `Bearer ${token}` } : undefined })

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}.`)
  }

  return respuesta.json() as Promise<T>
}

export function guardarToken(token: string) { localStorage.setItem('rsi_token', token) }
export function eliminarToken() { localStorage.removeItem('rsi_token') }
export function obtenerToken() { return localStorage.getItem('rsi_token') }

export type UsuarioActual = { id: string; correo: string; rol: string; trabajadorId: string | null; unidadOrganizativaId: string | null; organizacionId: string | null }
export function obtenerUsuarioActual(): UsuarioActual | null {
  const valor = localStorage.getItem('rsi_usuario')
  return valor ? JSON.parse(valor) as UsuarioActual : null
}
export function guardarUsuarioActual(usuario: UsuarioActual) { localStorage.setItem('rsi_usuario', JSON.stringify(usuario)) }
export function eliminarUsuarioActual() { localStorage.removeItem('rsi_usuario') }
