import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

type UsuarioConAlcance = {
  rol?: string;
  organizacionId?: string | null;
  unidadOrganizativaId?: string | null;
};

@Injectable()
export class UnitScopeGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UsuarioConAlcance }>();
    const usuario = request.user;
    if (!usuario || !['DUENO_UNIDAD', 'LECTOR'].includes(usuario.rol ?? ''))
      return true;

    const body = request.body as Record<string, unknown> | undefined;
    const organizacionIds = [
      request.params.organizacionId,
      request.query.organizacionId,
      body?.organizacionId,
    ];
    const unidadIds = [
      request.params.unidadId,
      request.params.unidadOrganizativaId,
      request.query.unidadId,
      request.query.unidadOrganizativaId,
      body?.unidadId,
      body?.unidadOrganizativaId,
    ];
    const tieneOrganizacionAjena = organizacionIds.some(
      (valor) => typeof valor === 'string' && valor !== usuario.organizacionId,
    );
    const tieneUnidadAjena = unidadIds.some(
      (valor) =>
        typeof valor === 'string' && valor !== usuario.unidadOrganizativaId,
    );
    if (tieneOrganizacionAjena || tieneUnidadAjena)
      throw new ForbiddenException(
        'No tenés permisos sobre ese alcance organizativo.',
      );
    await this.validarRegistro(context, usuario);
    return true;
  }

  private async validarRegistro(
    context: ExecutionContext,
    usuario: UsuarioConAlcance,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    const rawId =
      request.params.id ?? request.params.trabajadorId ?? request.params.planId;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return;
    const ruta = request.path;
    let alcance: {
      unidadOrganizativaId?: string | null;
      organizacionId?: string | null;
    } | null = null;

    if (ruta.includes('/trabajadores/')) {
      alcance = await this.prisma.trabajador.findUnique({
        where: { id },
        select: { unidadOrganizativaId: true },
      });
    } else if (ruta.includes('/activos/')) {
      alcance = await this.prisma.activo.findUnique({
        where: { id },
        select: { unidadOrganizativaId: true },
      });
    } else if (ruta.includes('/vulnerabilidades/')) {
      alcance = await this.prisma.vulnerabilidad
        .findUnique({
          where: { id },
          include: { activo: { select: { unidadOrganizativaId: true } } },
        })
        .then((x) => x?.activo ?? null);
    } else if (ruta.includes('/riesgos/')) {
      alcance = await this.prisma.riesgo
        .findUnique({
          where: { id },
          include: { activo: { select: { unidadOrganizativaId: true } } },
        })
        .then((x) => x?.activo ?? null);
    } else if (ruta.includes('/incidentes/')) {
      alcance = await this.prisma.incidente
        .findUnique({
          where: { id },
          include: { activo: { select: { unidadOrganizativaId: true } } },
        })
        .then((x) => x?.activo ?? null);
    } else if (ruta.includes('/politicas/')) {
      alcance = await this.prisma.politica.findUnique({
        where: { id },
        select: { organizacionId: true },
      });
    } else if (ruta.includes('/evidencias/')) {
      alcance = await this.prisma.evidencia.findUnique({
        where: { id },
        select: { organizacionId: true },
      });
    } else if (ruta.includes('/planes/')) {
      alcance = await this.prisma.plan.findUnique({
        where: { id },
        select: { organizacionId: true },
      });
    } else if (ruta.includes('/procedimientos/')) {
      alcance = await this.prisma.procedimiento.findUnique({
        where: { id },
        select: { organizacionId: true },
      });
    }

    if (
      alcance?.unidadOrganizativaId &&
      alcance.unidadOrganizativaId !== usuario.unidadOrganizativaId
    ) {
      throw new ForbiddenException('No tenés permisos sobre ese registro.');
    }
    if (
      alcance?.organizacionId &&
      alcance.organizacionId !== usuario.organizacionId
    ) {
      throw new ForbiddenException('No tenés permisos sobre ese registro.');
    }
  }
}
