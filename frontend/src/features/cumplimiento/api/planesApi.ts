import { apiRequest } from '../../organizacion/api/organizacionApi'
import type { Trabajador } from '../../organizacion/types/organizacion'
export type Hito = { id: string; nombre: string; estado: string; descripcion?: string | null; fechaObjetivo?: string | null; responsable?: Trabajador | null }
export type Plan = { id: string; organizacionId: string; nombre: string; descripcion?: string | null; tipo: string; estado: string; responsable?: Trabajador | null }
export function listarPlanes() { return apiRequest<Plan[]>('/api/v1/cumplimiento/planes', { method: 'GET' }) }
export function crearPlan(organizacionId: string, datos: Record<string, unknown>) { return apiRequest<Plan>(`/api/v1/cumplimiento/planes/${organizacionId}`, { method: 'POST', body: JSON.stringify(datos) }) }
export function eliminarPlan(id: string) { return apiRequest<Plan>(`/api/v1/cumplimiento/planes/${id}`, { method: 'DELETE' }) }
export function listarHitos(id: string) { return apiRequest<Hito[]>(`/api/v1/cumplimiento/planes/${id}/hitos`, { method: 'GET' }) }
export function crearHito(id: string, datos: Record<string, unknown>) { return apiRequest<Hito>(`/api/v1/cumplimiento/planes/${id}/hitos`, { method: 'POST', body: JSON.stringify(datos) }) }
export function eliminarHito(id: string) { return apiRequest<Hito>(`/api/v1/cumplimiento/hitos/${id}`, { method: 'DELETE' }) }
