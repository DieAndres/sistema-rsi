import { apiRequest } from '../../organizacion/api/organizacionApi'
import type { Trabajador } from '../../organizacion/types/organizacion'

export type Politica = { id: string; organizacionId: string; titulo: string; descripcion?: string | null; version: string; estado: string; fechaRevision?: string | null; responsable?: Trabajador | null }
export type DatosPolitica = { titulo: string; descripcion?: string; version?: string; estado?: string; responsableId?: string; fechaRevision?: string }
export function listarPoliticas() { return apiRequest<Politica[]>('/api/v1/cumplimiento/politicas', { method: 'GET' }) }
export function crearPolitica(organizacionId: string, datos: DatosPolitica) { return apiRequest<Politica>(`/api/v1/cumplimiento/politicas/${organizacionId}`, { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarPolitica(id: string, datos: DatosPolitica) { return apiRequest<Politica>(`/api/v1/cumplimiento/politicas/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarPolitica(id: string) { return apiRequest<Politica>(`/api/v1/cumplimiento/politicas/${id}`, { method: 'DELETE' }) }
