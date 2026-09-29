import { apiRequest } from '../../organizacion/api/organizacionApi'
import type { Trabajador, Unidad } from '../../organizacion/types/organizacion'

export type Activo = { id: string; nombre: string; descripcion?: string | null; tipo: string; criticidad: string; clasificacion: string; unidadOrganizativa: Unidad; responsable?: Trabajador | null; procesos?: { id: string; nombre: string }[] }
export type DatosActivo = { nombre: string; descripcion?: string; tipo: string; criticidad: string; clasificacion: string; responsableId?: string; procesoIds?: string[] }
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
export type Riesgo = { id: string; activoId: string; nombre: string; descripcion?: string | null; probabilidad: number; impacto: number; puntajeInherente: number; tratamiento?: string | null; riesgoResidual?: string | null; aceptado: boolean; estado: string; activo: { id: string; nombre: string }; responsable?: Trabajador | null }
export type DatosRiesgo = { activoId: string; nombre: string; descripcion?: string; probabilidad: number; impacto: number; tratamiento?: string; riesgoResidual?: string; aceptado?: boolean; responsableId?: string }
export function listarRiesgos(estado?: string) { return apiRequest<Riesgo[]>(`/api/v1/seguridad/riesgos${estado ? `?estado=${encodeURIComponent(estado)}` : ''}`, { method: 'GET' }) }
export function crearRiesgo(datos: DatosRiesgo) { return apiRequest<Riesgo>('/api/v1/seguridad/riesgos', { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarRiesgo(id: string, datos: Partial<DatosRiesgo> & { estado?: string }) { return apiRequest<Riesgo>(`/api/v1/seguridad/riesgos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarRiesgo(id: string) { return apiRequest<Riesgo>(`/api/v1/seguridad/riesgos/${id}`, { method: 'DELETE' }) }
export type Incidente = { id: string; activoId: string; titulo: string; descripcion?: string | null; severidad: string; estado: string; leccionesAprendidas?: string | null; activo: { id: string; nombre: string }; responsable?: Trabajador | null }
export type DatosIncidente = { activoId: string; titulo: string; descripcion?: string; severidad: string; estado?: string; leccionesAprendidas?: string; responsableId?: string }
export function listarIncidentes(estado?: string, severidad?: string) { const q = new URLSearchParams(); if (estado) q.set('estado', estado); if (severidad) q.set('severidad', severidad); return apiRequest<Incidente[]>(`/api/v1/seguridad/incidentes${q.toString() ? `?${q}` : ''}`, { method: 'GET' }) }
export function crearIncidente(datos: DatosIncidente) { return apiRequest<Incidente>('/api/v1/seguridad/incidentes', { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarIncidente(id: string, datos: Partial<DatosIncidente>) { return apiRequest<Incidente>(`/api/v1/seguridad/incidentes/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarIncidente(id: string) { return apiRequest<Incidente>(`/api/v1/seguridad/incidentes/${id}`, { method: 'DELETE' }) }
