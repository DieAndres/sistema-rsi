import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPoliticaDto } from './dto/politica/crear-politica.dto';
import { ActualizarPoliticaDto } from './dto/politica/actualizar-politica.dto';
import { CrearEvidenciaDto } from './dto/evidencia/crear-evidencia.dto';
import { ActualizarEvidenciaDto } from './dto/evidencia/actualizar-evidencia.dto';
import { CrearPlanDto } from './dto/plan/crear-plan.dto';
import { ActualizarPlanDto } from './dto/plan/actualizar-plan.dto';
import { CrearProcedimientoDto } from './dto/procedimiento/crear-procedimiento.dto';
import { ActualizarProcedimientoDto } from './dto/procedimiento/actualizar-procedimiento.dto';
import { CrearHitoDto } from './dto/hito/crear-hito.dto';
import { ActualizarHitoDto } from './dto/hito/actualizar-hito.dto';

@Injectable()
export class CumplimientoService {
  constructor(private readonly prisma: PrismaService) {}

  // Políticas

  async crearPolitica(organizacionId: string, datos: CrearPoliticaDto) {
    const titulo = datos.titulo?.trim();
    if (!titulo) {
      throw new BadRequestException('El título es obligatorio');
    }
    if (
      !(await this.prisma.organizacion.findUnique({
        where: { id: organizacionId },
      }))
    ) {
      throw new BadRequestException('La organización no existe');
    }
    await this.validarResponsableDeOrganizacion(
      datos.responsableId,
      organizacionId,
    );
    return this.prisma.politica.create({
      data: {
        organizacionId,
        titulo,
        descripcion: datos.descripcion?.trim() || null,
        version: datos.version?.trim() || '1.0',
        estado: datos.estado?.trim() || 'BORRADOR',
        responsableId: datos.responsableId,
        fechaRevision: this.validarFecha(
          datos.fechaRevision,
          'fecha de revisión',
        ),
      },
      include: { organizacion: true, responsable: true },
    });
  }

  listarPoliticas(organizacionId?: string) {
    return this.prisma.politica.findMany({
      where: organizacionId ? { organizacionId } : undefined,
      include: { organizacion: true, responsable: true },
      orderBy: { titulo: 'asc' },
    });
  }

  consultarPolitica(id: string) {
    return this.prisma.politica.findUnique({
      where: { id },
      include: { organizacion: true, responsable: true },
    });
  }

  async actualizarPolitica(id: string, datos: ActualizarPoliticaDto) {
    const politica = await this.prisma.politica.findUnique({ where: { id } });
    if (!politica) {
      return null;
    }
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        politica.organizacionId,
      );
    }
    const datosActualizados: Prisma.PoliticaUncheckedUpdateInput = {};
    if (datos.titulo !== undefined) {
      datosActualizados.titulo = datos.titulo.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion.trim() || null;
    }
    if (datos.version !== undefined) {
      datosActualizados.version = datos.version.trim();
    }
    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado.trim();
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    if (datos.fechaRevision !== undefined) {
      datosActualizados.fechaRevision = datos.fechaRevision
        ? this.validarFecha(datos.fechaRevision, 'fecha de revisión')
        : null;
    }
    return this.prisma.politica.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, responsable: true },
    });
  }

  eliminarPolitica(id: string) {
    return this.prisma.politica.delete({ where: { id } });
  }

  // Procedimientos

  async crearProcedimiento(
    organizacionId: string,
    datos: CrearProcedimientoDto,
  ) {
    const nombre = datos.nombre?.trim();
    const politica = await this.prisma.politica.findUnique({
      where: { id: datos.politicaId },
    });
    if (!nombre) {
      throw new BadRequestException('El nombre es obligatorio');
    }
    if (!politica || politica.organizacionId !== organizacionId) {
      throw new BadRequestException(
        'La política no pertenece a la organización',
      );
    }
    await this.validarResponsableDeOrganizacion(
      datos.responsableId,
      organizacionId,
    );
    const fechaRevision = this.validarFecha(
      datos.fechaRevision,
      'fecha de revisión',
    );
    return this.prisma.procedimiento.create({
      data: {
        organizacionId,
        politicaId: datos.politicaId,
        nombre,
        descripcion: datos.descripcion?.trim() || null,
        version: datos.version?.trim() || '1.0',
        estado: datos.estado?.trim() || 'BORRADOR',
        responsableId: datos.responsableId,
        fechaRevision,
      },
      include: { organizacion: true, politica: true, responsable: true },
    });
  }

  listarProcedimientos(organizacionId?: string) {
    return this.prisma.procedimiento.findMany({
      where: organizacionId ? { organizacionId } : undefined,
      include: { organizacion: true, politica: true, responsable: true },
      orderBy: { nombre: 'asc' },
    });
  }

  consultarProcedimiento(id: string) {
    return this.prisma.procedimiento.findUnique({
      where: { id },
      include: { organizacion: true, politica: true, responsable: true },
    });
  }

  async actualizarProcedimiento(id: string, datos: ActualizarProcedimientoDto) {
    const procedimiento = await this.prisma.procedimiento.findUnique({
      where: { id },
    });
    if (!procedimiento) {
      return null;
    }
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        procedimiento.organizacionId,
      );
    }
    const datosActualizados: Prisma.ProcedimientoUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      datosActualizados.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    }
    if (datos.version !== undefined) {
      datosActualizados.version = datos.version.trim();
    }
    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado.trim();
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    if (datos.fechaRevision !== undefined) {
      datosActualizados.fechaRevision = this.validarFecha(
        datos.fechaRevision || undefined,
        'fecha de revisión',
      );
    }
    return this.prisma.procedimiento.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, politica: true, responsable: true },
    });
  }

  eliminarProcedimiento(id: string) {
    return this.prisma.procedimiento.delete({ where: { id } });
  }

  // Planes

  async crearPlan(organizacionId: string, datos: CrearPlanDto) {
    const nombre = datos.nombre?.trim();
    const tipo = datos.tipo?.trim();
    if (!nombre || !tipo) {
      throw new BadRequestException('El nombre y el tipo son obligatorios');
    }
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
    });
    if (!organizacion) {
      throw new BadRequestException('La organización no existe');
    }
    await this.validarResponsableDeOrganizacion(
      datos.responsableId,
      organizacionId,
    );
    if (datos.riesgoId) {
      const riesgo = await this.prisma.riesgo.findUnique({
        where: { id: datos.riesgoId },
        include: { activo: { include: { unidadOrganizativa: true } } },
      });
      if (!riesgo) {
        throw new BadRequestException('El riesgo asociado no existe');
      }
      if (riesgo.activo.unidadOrganizativa.organizacionId !== organizacionId) {
        throw new BadRequestException(
          'El riesgo asociado no pertenece a la organización',
        );
      }
    }
    const fechaInicio = this.validarFecha(datos.fechaInicio, 'fecha de inicio');
    const fechaFin = this.validarFecha(datos.fechaFin, 'fecha de fin');
    return this.prisma.plan.create({
      data: {
        organizacionId,
        nombre,
        tipo,
        descripcion: datos.descripcion?.trim() || null,
        fechaInicio,
        fechaFin,
        responsableId: datos.responsableId,
        riesgoId: datos.riesgoId,
      },
      include: {
        organizacion: true,
        responsable: true,
        riesgo: true,
        hitos: true,
      },
    });
  }

  listarPlanes(organizacionId?: string) {
    return this.prisma.plan.findMany({
      where: organizacionId ? { organizacionId } : undefined,
      include: {
        organizacion: true,
        responsable: true,
        riesgo: true,
        hitos: true,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  consultarPlan(id: string) {
    return this.prisma.plan.findUnique({
      where: { id },
      include: {
        organizacion: true,
        responsable: true,
        riesgo: true,
        hitos: true,
      },
    });
  }

  async actualizarPlan(id: string, datos: ActualizarPlanDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      return null;
    }
    if (datos.nombre !== undefined && !datos.nombre?.trim()) {
      throw new BadRequestException('El nombre es obligatorio');
    }
    if (datos.tipo !== undefined && !datos.tipo?.trim()) {
      throw new BadRequestException('El tipo es obligatorio');
    }
    if (datos.riesgoId) {
      const riesgo = await this.prisma.riesgo.findUnique({
        where: { id: datos.riesgoId },
        include: { activo: { include: { unidadOrganizativa: true } } },
      });
      if (
        !riesgo ||
        riesgo.activo.unidadOrganizativa.organizacionId !== plan.organizacionId
      ) {
        throw new BadRequestException(
          'El riesgo asociado no pertenece a la organización',
        );
      }
    }
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        plan.organizacionId,
      );
    }
    const datosActualizados: Prisma.PlanUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      datosActualizados.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    }
    if (datos.tipo !== undefined) {
      datosActualizados.tipo = datos.tipo.trim();
    }
    if (datos.fechaInicio !== undefined) {
      datosActualizados.fechaInicio = this.validarFecha(
        datos.fechaInicio,
        'fecha de inicio',
      );
    }
    if (datos.fechaFin !== undefined) {
      datosActualizados.fechaFin = this.validarFecha(
        datos.fechaFin,
        'fecha de fin',
      );
    }
    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado.trim();
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    if (datos.riesgoId !== undefined) {
      datosActualizados.riesgoId = datos.riesgoId || null;
    }
    return this.prisma.plan.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, responsable: true, riesgo: true },
    });
  }

  eliminarPlan(id: string) {
    return this.prisma.plan.delete({ where: { id } });
  }

  // Hitos de planes

  async crearHito(planId: string, datos: CrearHitoDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      throw new BadRequestException('El plan no existe');
    }
    const nombre = datos.nombre?.trim();
    if (!nombre) {
      throw new BadRequestException('El nombre es obligatorio');
    }
    await this.validarResponsableDeOrganizacion(
      datos.responsableId,
      plan.organizacionId,
    );
    return this.prisma.hitoPlan.create({
      data: {
        planId,
        nombre,
        descripcion: datos.descripcion?.trim() || null,
        fechaObjetivo: this.validarFecha(datos.fechaObjetivo, 'fecha objetivo'),
        estado: datos.estado?.trim() || 'PENDIENTE',
        responsableId: datos.responsableId,
      },
      include: { responsable: true },
    });
  }

  listarHitos(planId: string) {
    return this.prisma.hitoPlan.findMany({
      where: { planId },
      include: { responsable: true },
      orderBy: [{ fechaObjetivo: 'asc' }, { nombre: 'asc' }],
    });
  }

  async actualizarHito(id: string, datos: ActualizarHitoDto) {
    const hito = await this.prisma.hitoPlan.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!hito) {
      return null;
    }
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        hito.plan.organizacionId,
      );
    }
    const data: Prisma.HitoPlanUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      const nombre = datos.nombre.trim();
      if (!nombre) {
        throw new BadRequestException('El nombre no puede estar vacío');
      }
      data.nombre = nombre;
    }
    if (datos.descripcion !== undefined) {
      data.descripcion = datos.descripcion?.trim() || null;
    }
    if (datos.fechaObjetivo !== undefined) {
      data.fechaObjetivo = this.validarFecha(
        datos.fechaObjetivo || undefined,
        'fecha objetivo',
      );
    }
    if (datos.estado !== undefined) {
      data.estado = datos.estado.trim();
    }
    if (datos.responsableId !== undefined) {
      data.responsableId = datos.responsableId || null;
    }
    return this.prisma.hitoPlan.update({
      where: { id },
      data,
      include: { responsable: true },
    });
  }

  eliminarHito(id: string) {
    return this.prisma.hitoPlan.delete({ where: { id } });
  }

  // Evidencias

  async crearEvidencia(organizacionId: string, datos: CrearEvidenciaDto) {
    const nombre = datos.nombre?.trim();
    const tipo = datos.tipo?.trim();
    if (!nombre || !tipo) {
      throw new BadRequestException('El nombre y el tipo son obligatorios');
    }
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
    });
    if (!organizacion) {
      throw new BadRequestException('La organización no existe');
    }
    await this.validarResponsableDeOrganizacion(
      datos.responsableId,
      organizacionId,
    );
    if (datos.riesgoId) {
      const riesgo = await this.prisma.riesgo.findUnique({
        where: { id: datos.riesgoId },
      });
      if (!riesgo) {
        throw new BadRequestException('El riesgo asociado no existe');
      }
      const activo = await this.prisma.activo.findUnique({
        where: { id: riesgo.activoId },
        include: { unidadOrganizativa: true },
      });
      if (activo?.unidadOrganizativa.organizacionId !== organizacionId) {
        throw new BadRequestException(
          'El riesgo asociado no pertenece a la organización',
        );
      }
    }
    if (
      datos.politicaId &&
      !(await this.prisma.politica.findUnique({
        where: { id: datos.politicaId },
      }))
    ) {
      throw new BadRequestException('La política asociada no existe');
    }
    if (datos.politicaId) {
      const politica = await this.prisma.politica.findUnique({
        where: { id: datos.politicaId },
      });
      if (politica?.organizacionId !== organizacionId) {
        throw new BadRequestException(
          'La política asociada no pertenece a la organización',
        );
      }
    }
    if (
      datos.vulnerabilidadId &&
      !(await this.prisma.vulnerabilidad.findUnique({
        where: { id: datos.vulnerabilidadId },
      }))
    ) {
      throw new BadRequestException('La vulnerabilidad asociada no existe');
    }
    if (
      datos.incidenteId &&
      !(await this.prisma.incidente.findUnique({
        where: { id: datos.incidenteId },
      }))
    ) {
      throw new BadRequestException('El incidente asociado no existe');
    }
    if (datos.vulnerabilidadId || datos.incidenteId) {
      const activoId = datos.vulnerabilidadId
        ? (
            await this.prisma.vulnerabilidad.findUnique({
              where: { id: datos.vulnerabilidadId },
            })
          )?.activoId
        : (
            await this.prisma.incidente.findUnique({
              where: { id: datos.incidenteId },
            })
          )?.activoId;
      if (activoId) {
        const activo = await this.prisma.activo.findUnique({
          where: { id: activoId },
          include: { unidadOrganizativa: true },
        });
        if (activo?.unidadOrganizativa.organizacionId !== organizacionId) {
          throw new BadRequestException(
            'La entidad asociada no pertenece a la organización',
          );
        }
      }
    }
    return this.prisma.evidencia.create({
      data: {
        organizacionId,
        nombre,
        tipo,
        descripcion: datos.descripcion?.trim() || null,
        ubicacion: datos.ubicacion?.trim() || null,
        responsableId: datos.responsableId,
        politicaId: datos.politicaId,
        riesgoId: datos.riesgoId,
        vulnerabilidadId: datos.vulnerabilidadId,
        incidenteId: datos.incidenteId,
      },
      include: {
        organizacion: true,
        responsable: true,
        politica: true,
        riesgo: true,
        vulnerabilidad: true,
        incidente: true,
      },
    });
  }

  listarEvidencias(organizacionId?: string) {
    return this.prisma.evidencia.findMany({
      where: organizacionId ? { organizacionId } : undefined,
      include: {
        organizacion: true,
        responsable: true,
        politica: true,
        riesgo: true,
        vulnerabilidad: true,
        incidente: true,
      },
      orderBy: { fechaRegistro: 'desc' },
    });
  }

  consultarEvidencia(id: string) {
    return this.prisma.evidencia.findUnique({
      where: { id },
      include: {
        organizacion: true,
        responsable: true,
        politica: true,
        riesgo: true,
        vulnerabilidad: true,
        incidente: true,
      },
    });
  }

  async actualizarEvidencia(id: string, datos: ActualizarEvidenciaDto) {
    const datosActualizados: Prisma.EvidenciaUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      datosActualizados.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    }
    if (datos.tipo !== undefined) {
      datosActualizados.tipo = datos.tipo.trim();
    }
    if (datos.ubicacion !== undefined) {
      datosActualizados.ubicacion = datos.ubicacion?.trim() || null;
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    return this.prisma.evidencia.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, responsable: true },
    });
  }

  eliminarEvidencia(id: string) {
    return this.prisma.evidencia.delete({ where: { id } });
  }

  // Validaciones usadas por las operaciones anteriores

  private async validarResponsableDeOrganizacion(
    responsableId: string | undefined,
    organizacionId: string,
  ): Promise<void> {
    if (!responsableId) {
      return;
    }
    const responsable = await this.prisma.trabajador.findUnique({
      where: { id: responsableId },
      include: { unidadOrganizativa: true },
    });
    if (!responsable) {
      throw new BadRequestException('El responsable no existe');
    }
    if (responsable.unidadOrganizativa.organizacionId !== organizacionId) {
      throw new BadRequestException(
        'El responsable no pertenece a la organización',
      );
    }
  }

  private validarFecha(valor: string | undefined, nombre: string): Date | null {
    if (!valor) {
      return null;
    }
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException(`La ${nombre} no es válida`);
    }
    return fecha;
  }
}
