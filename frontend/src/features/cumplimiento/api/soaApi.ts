import { apiRequest } from '../../organizacion/api/organizacionApi'

export type SoaControl = { controlId: string; tema: string; evaluacion: { aplica: boolean | null; justificacion: string | null; insumos: string | null; estado: string | null; evidenciaId: string | null; planId: string | null } | null }
export type SoaDatos = { aplica: boolean | null; justificacion: string; insumos: string; estado: string; evidenciaId?: string; planId?: string }
export function listarControlesSoa(organizacionId: string) { return apiRequest<SoaControl[]>(`/api/v1/exportaciones/organizaciones/${organizacionId}/soa/controles`, { method: 'GET' }) }
export function guardarEvaluacionSoa(organizacionId: string, controlId: string, datos: SoaDatos) { return apiRequest(`/api/v1/exportaciones/organizaciones/${organizacionId}/soa/controles/${controlId}`, { method: 'PUT', body: JSON.stringify(datos) }) }
