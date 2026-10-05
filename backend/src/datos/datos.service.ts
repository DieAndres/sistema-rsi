import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { Paquete, Registro } from './formato';
const MODULOS = {
  unidades: 'UnidadOrganizativa',
  trabajadores: 'Trabajador',
  procesos: 'Proceso',
  activos: 'Activo',
  raci: 'AsignacionRaci',
  riesgos: 'Riesgo',
  vulnerabilidades: 'Vulnerabilidad',
  incidentes: 'Incidente',
  historialIncidentes: 'AccionIncidente',
  politicas: 'Politica',
  procedimientos: 'Procedimiento',
  planes: 'Plan',
  hitos: 'HitoPlan',
  evidencias: 'Evidencia',
  evaluacionesSoa: 'EvaluacionSoa',
  brechasMcu: 'BrechaMcu',
} as const;
type Delegado = { findMany(args: unknown): Promise<Registro[]> };
function delegado(tx: Prisma.TransactionClient, modelo: string): Delegado {
  return (tx as unknown as Record<string, Delegado>)[
    modelo[0].toLowerCase() + modelo.slice(1)
  ];
}
const modeloDe = (nombre: string) =>
  Prisma.dmmf.datamodel.models.find((m) => m.name === nombre)!;
@Injectable()
export class DatosService {
  constructor(private readonly prisma: PrismaService) {}

  async exportar(id: string, actor: string): Promise<Paquete> {
    return this.prisma.$transaction(
      async (tx) => {
        if (!(await tx.organizacion.findUnique({ where: { id } })))
          throw new NotFoundException('Organización inexistente.');
        const datos: Record<string, Registro[]> = {};
        for (const [modulo, nombre] of Object.entries(MODULOS)) {
          let where: unknown;
          if (
            nombre === 'UnidadOrganizativa' ||
            modeloDe(nombre).fields.some((f) => f.name === 'organizacionId')
          )
            where = { organizacionId: id };
          else if (nombre === 'Trabajador' || nombre === 'Activo')
            where = { unidadOrganizativa: { organizacionId: id } };
          else if (nombre === 'AsignacionRaci')
            where = { proceso: { organizacionId: id } };
          else if (nombre === 'HitoPlan')
            where = { plan: { organizacionId: id } };
          else if (nombre === 'AccionIncidente')
            where = {
              incidente: {
                activo: { unidadOrganizativa: { organizacionId: id } },
              },
            };
          else
            where = { activo: { unidadOrganizativa: { organizacionId: id } } };
          const filas = await delegado(tx, nombre).findMany({
            where,
            orderBy: { id: 'asc' },
            ...(nombre === 'Activo'
              ? { include: { procesos: { select: { id: true } } } }
              : {}),
          });
          datos[modulo] = filas.map((f) => {
            const fila = { ...f };
            if (nombre === 'Activo') {
              fila.procesoIds = (fila.procesos as { id: string }[]).map(
                (p) => p.id,
              );
              delete fila.procesos;
            }
            // El histórico se conserva sin transportar identidades de cuentas del sistema origen.
            if (nombre === 'AccionIncidente') {
              delete fila.usuarioId;
              delete fila.usuarioCorreo;
            }
            return fila;
          });
        }
        await this.auditar(tx, id, actor, datos);
        return JSON.parse(JSON.stringify({ version: 1, datos })) as Paquete;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        timeout: 60000,
      },
    );
  }

  private auditar(
    tx: Prisma.TransactionClient,
    id: string,
    actor: string,
    datos: Record<string, Registro[]>,
  ) {
    return tx.auditEvent.create({
      data: {
        eventType: 'DATOS_EXPORT',
        entityType: 'ORGANIZACION',
        entityId: id,
        action: 'EXPORT',
        actorUserId: actor,
        result: 'EXITOSO',
        metadata: {
          cantidades: Object.fromEntries(
            Object.entries(datos).map(([k, v]) => [k, v.length]),
          ),
        },
      },
    });
  }
}
