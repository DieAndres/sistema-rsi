import { apiRequest } from '../../organizacion/api/organizacionApi'
import type { Trabajador } from '../../organizacion/types/organizacion'

export type Evidencia = { id: string; organizacionId: string; nombre: string; descripcion?: string | null; tipo: string; ubicacion?: string | null; responsable?: Trabajador | null; politica?: { id: string; titulo: string } | null }
export type DatosEvidencia = { nombre: string; descripcion?: string; tipo: string; ubicacion?: string; responsableId?: string; politicaId?: string }
export function listarEvidencias() { return apiRequest<Evidencia[]>('/api/v1/cumplimiento/evidencias', { method: 'GET' }) }
export function crearEvidencia(organizacionId: string, datos: DatosEvidencia) { return apiRequest<Evidencia>(`/api/v1/cumplimiento/evidencias/${organizacionId}`, { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarEvidencia(id: string, datos: Partial<DatosEvidencia>) { return apiRequest<Evidencia>(`/api/v1/cumplimiento/evidencias/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarEvidencia(id: string) { return apiRequest<Evidencia>(`/api/v1/cumplimiento/evidencias/${id}`, { method: 'DELETE' }) }
