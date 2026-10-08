import { apiGet, apiFetch } from '../../../shared/api/apiGet'
import { obtenerUsuarioActual } from '../../../shared/api/apiGet'
import type { Organizacion, Trabajador, Unidad } from '../types/organizacion'

export type Proceso = { id: string; organizacionId: string; nombre: string; descripcion?: string | null; version: string; estado: string; responsable?: Trabajador | null }
export type DatosProceso = { nombre: string; descripcion?: string; version?: string; estado?: string; responsableId?: string }
export type TipoRaci = 'R' | 'A' | 'C' | 'I'
export type AsignacionRaci = { id: string; procesoId: string; trabajadorId: string; tipoResponsabilidad: TipoRaci; proceso: Proceso; trabajador: Trabajador }

export async function listarOrganizaciones(signal: AbortSignal) {
  const organizaciones = await apiGet<Organizacion[]>('/api/v1/organizaciones', signal)
  const usuario = obtenerUsuarioActual()
  return ['DUENO_UNIDAD', 'LECTOR'].includes(usuario?.rol ?? '') && usuario?.organizacionId
    ? organizaciones.filter((organizacion) => organizacion.id === usuario.organizacionId)
    : organizaciones
}

export async function apiRequest<T>(ruta: string, init: RequestInit): Promise<T> {
  const respuesta = await apiFetch(ruta, {
    ...init,
    signal: init.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(20000)])
      : AbortSignal.timeout(20000),
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}.`)
  }

  return respuesta.json() as Promise<T>
}


export function crearOrganizacion(datos: { nombre: string; alcanceSgsi?: string | null; perfilMcu?: Organizacion["perfilMcu"] }) { return apiRequest<Organizacion>('/api/v1/organizaciones', { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarOrganizacion(id: string, datos: { nombre: string; alcanceSgsi?: string | null; perfilMcu?: Organizacion["perfilMcu"] }) { return apiRequest<Organizacion>(`/api/v1/organizaciones/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }

export function listarUnidades(organizacionId: string, signal: AbortSignal) {
  const ruta = `/api/v1/organizaciones/${encodeURIComponent(organizacionId)}/unidades`

  return apiGet<Unidad[]>(ruta, signal)
}

export type DatosUnidad = {
  nombre: string
  tipo: Unidad['tipo']
  unidadPadreId?: string
  responsableId?: string
}

export function crearUnidad(organizacionId: string, datos: DatosUnidad) {
  return apiRequest<Unidad>(`/api/v1/organizaciones/${organizacionId}/unidades`, {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarUnidad(id: string, datos: DatosUnidad) {
  return apiRequest<Unidad>(`/api/v1/organizaciones/unidades/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export function eliminarUnidad(id: string) {
  return apiRequest<Unidad>(`/api/v1/organizaciones/unidades/${id}`, {
    method: 'DELETE',
  })
}

export type DatosTrabajador = { nombre: string; cargo: string; correo?: string }

export function listarTrabajadores() {
  return apiRequest<Trabajador[]>('/api/v1/organizaciones/trabajadores', { method: 'GET' })
}

export function crearTrabajador(unidadId: string, datos: DatosTrabajador) {
  return apiRequest<Trabajador>(`/api/v1/organizaciones/unidades/${unidadId}/trabajadores`, {
    method: 'POST', body: JSON.stringify(datos),
  })
}

export function actualizarTrabajador(id: string, datos: DatosTrabajador) {
  return apiRequest<Trabajador>(`/api/v1/organizaciones/trabajadores/${id}`, {
    method: 'PATCH', body: JSON.stringify(datos),
  })
}

export function eliminarTrabajador(id: string) {
  return apiRequest<Trabajador>(`/api/v1/organizaciones/trabajadores/${id}`, { method: 'DELETE' })
}

export function listarProcesos() { return apiRequest<Proceso[]>('/api/v1/organizaciones/procesos', { method: 'GET' }) }
export function crearProceso(organizacionId: string, datos: DatosProceso) { return apiRequest<Proceso>(`/api/v1/organizaciones/${organizacionId}/procesos`, { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarProceso(id: string, datos: DatosProceso) { return apiRequest<Proceso>(`/api/v1/organizaciones/procesos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarProceso(id: string) { return apiRequest<Proceso>(`/api/v1/organizaciones/procesos/${id}`, { method: 'DELETE' }) }
export function listarAsignacionesRaci() { return apiRequest<AsignacionRaci[]>('/api/v1/organizaciones/asignaciones-raci', { method: 'GET' }) }
export function crearAsignacionRaci(datos: { procesoId: string; trabajadorId: string; tipoResponsabilidad: TipoRaci }) { return apiRequest<AsignacionRaci>('/api/v1/organizaciones/asignaciones-raci', { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarAsignacionRaci(id: string, tipoResponsabilidad: TipoRaci) { return apiRequest<AsignacionRaci>(`/api/v1/organizaciones/asignaciones-raci/${id}`, { method: 'PATCH', body: JSON.stringify({ tipoResponsabilidad }) }) }
export function eliminarAsignacionRaci(id: string) { return apiRequest<AsignacionRaci>(`/api/v1/organizaciones/asignaciones-raci/${id}`, { method: 'DELETE' }) }
