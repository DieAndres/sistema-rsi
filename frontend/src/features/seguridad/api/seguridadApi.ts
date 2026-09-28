import { apiRequest } from '../../organizacion/api/organizacionApi'
import type { Trabajador, Unidad } from '../../organizacion/types/organizacion'

export type Activo = { id: string; nombre: string; descripcion?: string | null; tipo: string; criticidad: string; clasificacion: string; unidadOrganizativa: Unidad; responsable?: Trabajador | null }
export type DatosActivo = { nombre: string; descripcion?: string; tipo: string; criticidad: string; clasificacion: string; responsableId?: string }
export function listarActivos(unidadId?: string) { return apiRequest<Activo[]>(`/api/v1/seguridad/activos${unidadId ? `?unidadId=${encodeURIComponent(unidadId)}` : ''}`, { method: 'GET' }) }
export function crearActivo(unidadId: string, datos: DatosActivo) { return apiRequest<Activo>(`/api/v1/seguridad/unidades/${unidadId}/activos`, { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarActivo(id: string, datos: DatosActivo) { return apiRequest<Activo>(`/api/v1/seguridad/activos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarActivo(id: string) { return apiRequest<Activo>(`/api/v1/seguridad/activos/${id}`, { method: 'DELETE' }) }
export type Vulnerabilidad = { id: string; activoId: string; nombre: string; descripcion?: string | null; cvss?: number | null; sla?: number | null; planRemediacion?: string | null; estado: string; activo: { id: string; nombre: string }; responsable?: Trabajador | null }
export type DatosVulnerabilidad = { activoId: string; nombre: string; descripcion?: string; cvss?: number; sla?: number; planRemediacion?: string; responsableId?: string }
export function listarVulnerabilidades(estado?: string, cvssMin?: string) { const q = new URLSearchParams(); if (estado) q.set('estado', estado); if (cvssMin) q.set('cvssMin', cvssMin); return apiRequest<Vulnerabilidad[]>(`/api/v1/seguridad/vulnerabilidades${q.toString() ? `?${q}` : ''}`, { method: 'GET' }) }
export function crearVulnerabilidad(datos: DatosVulnerabilidad) { return apiRequest<Vulnerabilidad>('/api/v1/seguridad/vulnerabilidades', { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarVulnerabilidad(id: string, datos: Partial<DatosVulnerabilidad> & { estado?: string }) { return apiRequest<Vulnerabilidad>(`/api/v1/seguridad/vulnerabilidades/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarVulnerabilidad(id: string) { return apiRequest<Vulnerabilidad>(`/api/v1/seguridad/vulnerabilidades/${id}`, { method: 'DELETE' }) }
