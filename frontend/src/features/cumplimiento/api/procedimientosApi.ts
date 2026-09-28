import { apiRequest } from '../../organizacion/api/organizacionApi'
import type { Trabajador } from '../../organizacion/types/organizacion'
export type Procedimiento = { id: string; organizacionId: string; politicaId: string; nombre: string; descripcion?: string | null; version: string; estado: string; fechaRevision?: string | null; responsable?: Trabajador | null; politica?: { id: string; titulo: string } | null }
export type DatosProcedimiento = { politicaId: string; nombre: string; descripcion?: string; version?: string; estado?: string; responsableId?: string; fechaRevision?: string }
export function listarProcedimientos() { return apiRequest<Procedimiento[]>('/api/v1/cumplimiento/procedimientos', { method: 'GET' }) }
export function crearProcedimiento(organizacionId: string, datos: DatosProcedimiento) { return apiRequest<Procedimiento>(`/api/v1/cumplimiento/procedimientos/${organizacionId}`, { method: 'POST', body: JSON.stringify(datos) }) }
export function actualizarProcedimiento(id: string, datos: Partial<DatosProcedimiento>) { return apiRequest<Procedimiento>(`/api/v1/cumplimiento/procedimientos/${id}`, { method: 'PATCH', body: JSON.stringify(datos) }) }
export function eliminarProcedimiento(id: string) { return apiRequest<Procedimiento>(`/api/v1/cumplimiento/procedimientos/${id}`, { method: 'DELETE' }) }
