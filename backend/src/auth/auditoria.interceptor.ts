import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { from, lastValueFrom } from 'rxjs';
import { PrismaService, transaccionAuditoria } from '../prisma/prisma.service';
export const ENTIDADES_AUDITABLES = {
  ORGANIZACION: 'organizacion',
  UNIDAD: 'unidadOrganizativa',
  TRABAJADOR: 'trabajador',
  PROCESO: 'proceso',
  RACI: 'asignacionRaci',
  ACTIVO: 'activo',
  RIESGO: 'riesgo',
  VULNERABILIDAD: 'vulnerabilidad',
  INCIDENTE: 'incidente',
  POLITICA: 'politica',
  PROCEDIMIENTO: 'procedimiento',
  PLAN: 'plan',
  HITO: 'hitoPlan',
  EVIDENCIA: 'evidencia',
  INDICADOR_KPI: 'indicadorKpi',
  MEDICION_KPI: 'medicionKpi',
  EVALUACION_SOA: 'evaluacionSoa',
  BRECHA_MCU: 'brechaMcu',
  EVALUACION_MCU: 'evaluacionMcu',
  EVALUACION_BCU: 'evaluacionBcu',
  EVALUACION_COBIT: 'evaluacionCobit',
  BASE_PERSONAL: 'basePersonal',
  NOTIFICACION_URCDP: 'notificacionUrcdp',
} as const;
const recursos: Record<string, keyof typeof ENTIDADES_AUDITABLES> = {
  unidades: 'UNIDAD',
  trabajadores: 'TRABAJADOR',
  procesos: 'PROCESO',
  'asignaciones-raci': 'RACI',
  activos: 'ACTIVO',
  riesgos: 'RIESGO',
  vulnerabilidades: 'VULNERABILIDAD',
  incidentes: 'INCIDENTE',
  politicas: 'POLITICA',
  procedimientos: 'PROCEDIMIENTO',
  planes: 'PLAN',
  hitos: 'HITO',
  evidencias: 'EVIDENCIA',
  indicadores: 'INDICADOR_KPI',
  mediciones: 'MEDICION_KPI',
  controles: 'EVALUACION_SOA',
  brechas: 'BRECHA_MCU',
  'mcu-controles': 'EVALUACION_MCU',
  'bcu-controles': 'EVALUACION_BCU',
  'cobit-procesos': 'EVALUACION_COBIT',
  'bases-personales': 'BASE_PERSONAL',
  'notificaciones-urcdp': 'NOTIFICACION_URCDP',
};
// Solo campos escalares persistidos: excluye relaciones, respuestas calculadas y cuerpos enviados.
function valores(
  entidad: keyof typeof ENTIDADES_AUDITABLES,
  registro: unknown,
) {
  if (!registro || typeof registro !== 'object') {
    return null;
  }
  const nombre = ENTIDADES_AUDITABLES[entidad];
  const modelo = Prisma.dmmf.datamodel.models.find(
    (m) => m.name.toLowerCase() === nombre.toLowerCase(),
  )!;
  const campos = modelo.fields
    .filter((c) => c.kind !== 'object')
    .map((c) => c.name);
  const datos = registro as Record<string, unknown>;
  const resultado = Object.fromEntries(
    campos.filter((c) => c in datos).map((c) => [c, datos[c]]),
  );
  if (entidad === 'BASE_PERSONAL' || entidad === 'NOTIFICACION_URCDP') {
    delete resultado.datos;
    delete resultado.nombre;
  }
  if (entidad === 'ACTIVO' && Array.isArray(datos.procesos)) {
    resultado.procesoIds = (
      datos.procesos as {
        id: string;
      }[]
    )
      .map((p) => p.id)
      .sort();
  }
  return JSON.parse(JSON.stringify(resultado)) as Record<
    string,
    Prisma.JsonValue
  >;
}

@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<
      Request & {
        user?: {
          id: string;
        };
      }
    >();
    const partes = request.path.split('/').filter(Boolean).slice(2);
    const modulo = partes[0];
    if (
      !request.user ||
      ![
        'organizaciones',
        'seguridad',
        'cumplimiento',
        'kpis',
        'exportaciones',
      ].includes(modulo)
    ) {
      return next.handle();
    }
    const exportacion =
      modulo === 'exportaciones' &&
      request.method === 'GET' &&
      [
        'soa',
        'mcu',
        'mcu-funciones',
        'bcu-gsi',
        'cobit',
        'inventario-activos',
        'politica-seguridad',
        'registro-urcdp',
        'medidas-urcdp',
        'brecha-urcdp',
      ].includes(partes.at(-1)!);
    if (
      !exportacion &&
      !['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method)
    ) {
      return next.handle();
    }
    const recurso = partes
      .slice(1)
      .filter((p) => p in recursos)
      .at(-1);
    const entidad = recurso ? recursos[recurso] : 'ORGANIZACION';
    let accion = 'UPDATE';
    if (exportacion) {
      accion = 'EXPORT';
    } else if (request.method === 'DELETE') {
      accion = 'DELETE';
    } else if (request.method === 'POST') {
      accion = 'CREATE';
    }
    const actorUserId = request.user.id;
    return from(
      this.prisma.$transaction(
        async (tx) =>
          transaccionAuditoria.run(tx, async () => {
            const modelo = tx[ENTIDADES_AUDITABLES[entidad]] as unknown as {
              findUnique(args: {
                where: Record<string, unknown>;
                include?: {
                  procesos: boolean;
                };
              }): Promise<unknown>;
            };
            let anterior: unknown = null;
            if (!exportacion && accion !== 'CREATE') {
              let where: Record<string, unknown> = { id: request.params.id };
              if (entidad === 'BASE_PERSONAL' || entidad === 'NOTIFICACION_URCDP') {
                where = { id: request.params.fichaId };
              }
              if (entidad === 'EVALUACION_COBIT') {
                where = {
                  organizacionId_procesoId_controlId: {
                    organizacionId: request.params.id,
                    procesoId: request.body?.procesoId,
                    controlId: request.params.controlId,
                  },
                };
              } else if (
                entidad === 'EVALUACION_SOA' ||
                entidad === 'EVALUACION_MCU' ||
                entidad === 'EVALUACION_BCU'
              ) {
                where = {
                  organizacionId_controlId: {
                    organizacionId: request.params.id,
                    controlId: request.params.controlId,
                  },
                };
              } else if (entidad === 'BRECHA_MCU') {
                where = {
                  organizacionId_funcion: {
                    organizacionId: request.params.id,
                    funcion: request.params.funcion,
                  },
                };
              }
              anterior = await modelo.findUnique({
                where,
                ...(entidad === 'ACTIVO' && { include: { procesos: true } }),
              });
            }
            const respuesta: unknown = await lastValueFrom(next.handle());
            const antes = valores(entidad, anterior);
            const despues =
              exportacion || accion === 'DELETE'
                ? null
                : valores(entidad, respuesta);
            const campos = [
              ...new Set([
                ...Object.keys(antes ?? {}),
                ...Object.keys(despues ?? {}),
              ]),
            ].filter(
              (campo) =>
                JSON.stringify(antes?.[campo]) !==
                JSON.stringify(despues?.[campo]),
            );
            const id =
              (
                respuesta as {
                  id?: string;
                } | null
              )?.id ??
              (
                anterior as {
                  id?: string;
                } | null
              )?.id ??
              request.params.id;
            let accionFinal = accion;
            if (accion === 'UPDATE' && !anterior) {
              accionFinal = 'CREATE';
            } else if (
              accion === 'UPDATE' &&
              antes?.estado !== despues?.estado &&
              despues?.estado === 'APROBADA'
            ) {
              accionFinal = 'APPROVE';
            }
            await tx.auditEvent.create({
              data: {
                eventType: `${exportacion ? 'EXPORTACION' : entidad}_${accionFinal}`,
                entityType: exportacion ? 'EXPORTACION' : entidad,
                entityId: typeof id === 'string' ? id : null,
                action: accionFinal,
                actorUserId,
                result: 'EXITOSO',
                metadata: exportacion
                  ? {
                      documento: partes.at(-1)!,
                      organizacionId: request.params.id as string,
                    }
                  : { campos, anterior: antes, nuevo: despues },
              },
            });
            return respuesta;
          }),
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          timeout: 15000,
        },
      ),
    );
  }
}
