import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusquedaService {
  constructor(private readonly prisma: PrismaService) {}

  async buscar(filtros: {
    q?: string;
    unidadId?: string;
    estado?: string;
    severidad?: string;
  }) {
    const q = filtros.q?.trim();
    if (q && q.length > 100) {
      throw new BadRequestException(
        'La búsqueda no puede superar 100 caracteres',
      );
    }
    const unidadId = filtros.unidadId?.trim();
    const idsUnidad = unidadId
      ? await this.obtenerDescendientes(unidadId)
      : undefined;
    const idsOrganizacion = idsUnidad
      ? [
          ...new Set(
            (
              await this.prisma.unidadOrganizativa.findMany({
                where: { id: { in: idsUnidad } },
                select: { organizacionId: true },
              })
            ).map(({ organizacionId }) => organizacionId),
          ),
        ]
      : undefined;
    const contiene = q
      ? { contains: q, mode: 'insensitive' as const }
      : undefined;
    const texto = (campos: string[]) =>
      contiene ? { OR: campos.map((campo) => ({ [campo]: contiene })) } : {};
    const estado = filtros.estado ? { estado: filtros.estado } : {};

    const [
      activos,
      riesgos,
      vulnerabilidades,
      incidentes,
      trabajadores,
      procesos,
      politicas,
      procedimientos,
      planes,
      evidencias,
    ] = await Promise.all([
      this.prisma.activo.findMany({
        where: {
          ...texto(['nombre', 'descripcion']),
          ...(idsUnidad ? { unidadOrganizativaId: { in: idsUnidad } } : {}),
        },
        include: {
          unidadOrganizativa: true,
          responsable: { select: { id: true, nombre: true, cargo: true } },
        },
      }),
      this.prisma.riesgo.findMany({
        where: {
          ...texto(['nombre', 'descripcion']),
          ...estado,
          ...(idsUnidad
            ? { activo: { unidadOrganizativaId: { in: idsUnidad } } }
            : {}),
        },
        include: {
          activo: true,
          responsable: { select: { id: true, nombre: true, cargo: true } },
        },
      }),
      this.prisma.vulnerabilidad.findMany({
        where: {
          ...texto(['nombre', 'descripcion']),
          ...estado,
          ...(idsUnidad
            ? { activo: { unidadOrganizativaId: { in: idsUnidad } } }
            : {}),
        },
        include: {
          activo: true,
          responsable: { select: { id: true, nombre: true, cargo: true } },
        },
      }),
      this.prisma.incidente.findMany({
        where: {
          ...texto(['titulo', 'descripcion']),
          ...estado,
          ...(filtros.severidad ? { severidad: filtros.severidad } : {}),
          ...(idsUnidad
            ? { activo: { unidadOrganizativaId: { in: idsUnidad } } }
            : {}),
        },
        include: {
          activo: true,
          responsable: { select: { id: true, nombre: true, cargo: true } },
        },
      }),
      this.prisma.trabajador.findMany({
        where: {
          ...texto(['nombre', 'cargo', 'correo']),
          ...(idsUnidad ? { unidadOrganizativaId: { in: idsUnidad } } : {}),
        },
        select: {
          id: true,
          nombre: true,
          cargo: true,
          unidadOrganizativa: true,
        },
      }),
      this.prisma.proceso.findMany({
        where: {
          ...texto(['nombre', 'descripcion']),
          ...estado,
          ...(idsOrganizacion
            ? { organizacionId: { in: idsOrganizacion } }
            : {}),
        },
        include: {
          asignacionesRaci: {
            include: {
              trabajador: { select: { id: true, nombre: true, cargo: true } },
            },
          },
        },
      }),
      this.prisma.politica.findMany({
        where: {
          ...texto(['titulo', 'descripcion']),
          ...estado,
          ...(idsOrganizacion
            ? { organizacionId: { in: idsOrganizacion } }
            : {}),
        },
      }),
      this.prisma.procedimiento.findMany({
        where: {
          ...texto(['nombre', 'descripcion']),
          ...estado,
          ...(idsOrganizacion
            ? { organizacionId: { in: idsOrganizacion } }
            : {}),
        },
      }),
      this.prisma.plan.findMany({
        where: {
          ...texto(['nombre', 'descripcion']),
          ...estado,
          ...(idsOrganizacion
            ? { organizacionId: { in: idsOrganizacion } }
            : {}),
        },
      }),
      this.prisma.evidencia.findMany({
        where: {
          ...texto(['nombre', 'descripcion', 'tipo']),
          ...(idsOrganizacion
            ? { organizacionId: { in: idsOrganizacion } }
            : {}),
        },
      }),
    ]);

    return {
      activos,
      riesgos: riesgos.map((riesgo) => ({
        ...riesgo,
        puntajeInherente: riesgo.probabilidad * riesgo.impacto,
      })),
      vulnerabilidades,
      incidentes,
      trabajadores,
      procesos,
      politicas,
      procedimientos,
      planes,
      evidencias,
    };
  }

  private async obtenerDescendientes(unidadId: string): Promise<string[]> {
    const inicial = await this.prisma.unidadOrganizativa.findUnique({
      where: { id: unidadId },
      select: { id: true },
    });
    if (!inicial) throw new BadRequestException('La unidad no existe');
    const ids = [unidadId];
    for (let inicio = 0; inicio < ids.length;) {
      const hijos = await this.prisma.unidadOrganizativa.findMany({
        where: { unidadPadreId: { in: ids.slice(inicio) } },
        select: { id: true },
      });
      ids.push(...hijos.map(({ id }) => id).filter((id) => !ids.includes(id)));
      inicio = ids.length;
    }
    return ids;
  }
}
