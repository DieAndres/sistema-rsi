import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarOrganizacionDto } from './dto/organizacion/actualizar-organizacion.dto';
import { ActualizarUnidadOrganizativaDto } from './dto/unidad-organizativa/actualizar-unidad-organizativa.dto';
import { ActualizarTrabajadorDto } from './dto/trabajador/actualizar-trabajador.dto';
import { ActualizarProcesoDto } from './dto/proceso/actualizar-proceso.dto';
import { CrearOrganizacionDto } from './dto/organizacion/crear-organizacion.dto';
import { CrearUnidadOrganizativaDto } from './dto/unidad-organizativa/crear-unidad-organizativa.dto';
import { CrearTrabajadorDto } from './dto/trabajador/crear-trabajador.dto';
import { CrearProcesoDto } from './dto/proceso/crear-proceso.dto';
import { ActualizarAsignacionRaciDto } from './dto/raci/actualizar-asignacion-raci.dto';
import { CrearAsignacionRaciDto } from './dto/raci/crear-asignacion-raci.dto';
import { CrearVulnerabilidadDto } from '../seguridad/dto/vulnerabilidad/crear-vulnerabilidad.dto';
import { ActualizarVulnerabilidadDto } from '../seguridad/dto/vulnerabilidad/actualizar-vulnerabilidad.dto';
import { CrearRiesgoDto } from '../seguridad/dto/riesgo/crear-riesgo.dto';
import { ActualizarRiesgoDto } from '../seguridad/dto/riesgo/actualizar-riesgo.dto';
import { CrearIncidenteDto } from '../seguridad/dto/incidente/crear-incidente.dto';
import { ActualizarIncidenteDto } from '../seguridad/dto/incidente/actualizar-incidente.dto';
import { CrearPoliticaDto } from '../cumplimiento/dto/politica/crear-politica.dto';
import { ActualizarPoliticaDto } from '../cumplimiento/dto/politica/actualizar-politica.dto';
import { CrearEvidenciaDto } from '../cumplimiento/dto/evidencia/crear-evidencia.dto';
import { ActualizarEvidenciaDto } from '../cumplimiento/dto/evidencia/actualizar-evidencia.dto';
import { CrearPlanDto } from '../cumplimiento/dto/plan/crear-plan.dto';
import { ActualizarPlanDto } from '../cumplimiento/dto/plan/actualizar-plan.dto';
import { CrearProcedimientoDto } from '../cumplimiento/dto/procedimiento/crear-procedimiento.dto';
import { ActualizarProcedimientoDto } from '../cumplimiento/dto/procedimiento/actualizar-procedimiento.dto';
import { ActualizarActivoDto } from '../seguridad/dto/activo/actualizar-activo.dto';
import { CrearActivoDto } from '../seguridad/dto/activo/crear-activo.dto';
import { CrearHitoDto } from '../cumplimiento/dto/hito/crear-hito.dto';
import { ActualizarHitoDto } from '../cumplimiento/dto/hito/actualizar-hito.dto';

@Injectable()
export class OrganizacionService {
  constructor(private readonly prisma: PrismaService) {}

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

  listarProcedimientos() {
    return this.prisma.procedimiento.findMany({
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
    if (!procedimiento) return null;
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        procedimiento.organizacionId,
      );
    }
    const datosActualizados: Prisma.ProcedimientoUncheckedUpdateInput = {};

    if (datos.nombre !== undefined)
      datosActualizados.nombre = datos.nombre.trim();
    if (datos.descripcion !== undefined)
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    if (datos.version !== undefined)
      datosActualizados.version = datos.version.trim();
    if (datos.estado !== undefined)
      datosActualizados.estado = datos.estado.trim();
    if (datos.responsableId !== undefined)
      datosActualizados.responsableId = datos.responsableId || null;
    if (datos.fechaRevision !== undefined)
      datosActualizados.fechaRevision = this.validarFecha(
        datos.fechaRevision || undefined,
        'fecha de revisión',
      );

    return this.prisma.procedimiento.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, politica: true, responsable: true },
    });
  }

  eliminarProcedimiento(id: string) {
    return this.prisma.procedimiento.delete({ where: { id } });
  }

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

  listarPlanes() {
    return this.prisma.plan.findMany({
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
    if (!plan) return null;
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        plan.organizacionId,
      );
    }
    const datosActualizados: Prisma.PlanUncheckedUpdateInput = {};

    if (datos.nombre !== undefined)
      datosActualizados.nombre = datos.nombre.trim();
    if (datos.descripcion !== undefined)
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    if (datos.tipo !== undefined) datosActualizados.tipo = datos.tipo.trim();
    if (datos.fechaInicio !== undefined)
      datosActualizados.fechaInicio = this.validarFecha(
        datos.fechaInicio,
        'fecha de inicio',
      );
    if (datos.fechaFin !== undefined)
      datosActualizados.fechaFin = this.validarFecha(
        datos.fechaFin,
        'fecha de fin',
      );
    if (datos.estado !== undefined)
      datosActualizados.estado = datos.estado.trim();
    if (datos.responsableId !== undefined)
      datosActualizados.responsableId = datos.responsableId || null;
    if (datos.riesgoId !== undefined)
      datosActualizados.riesgoId = datos.riesgoId || null;

    return this.prisma.plan.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, responsable: true, riesgo: true },
    });
  }

  eliminarPlan(id: string) {
    return this.prisma.plan.delete({ where: { id } });
  }

  async crearHito(planId: string, datos: CrearHitoDto) {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new BadRequestException('El plan no existe');
    const nombre = datos.nombre?.trim();
    if (!nombre) throw new BadRequestException('El nombre es obligatorio');
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
    if (!hito) return null;
    if (datos.responsableId) {
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        hito.plan.organizacionId,
      );
    }
    const data: Prisma.HitoPlanUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      const nombre = datos.nombre.trim();
      if (!nombre)
        throw new BadRequestException('El nombre no puede estar vacío');
      data.nombre = nombre;
    }
    if (datos.descripcion !== undefined)
      data.descripcion = datos.descripcion?.trim() || null;
    if (datos.fechaObjetivo !== undefined)
      data.fechaObjetivo = this.validarFecha(
        datos.fechaObjetivo || undefined,
        'fecha objetivo',
      );
    if (datos.estado !== undefined) data.estado = datos.estado.trim();
    if (datos.responsableId !== undefined)
      data.responsableId = datos.responsableId || null;
    return this.prisma.hitoPlan.update({
      where: { id },
      data,
      include: { responsable: true },
    });
  }

  eliminarHito(id: string) {
    return this.prisma.hitoPlan.delete({ where: { id } });
  }

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

  listarEvidencias() {
    return this.prisma.evidencia.findMany({
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

    if (datos.nombre !== undefined)
      datosActualizados.nombre = datos.nombre.trim();
    if (datos.descripcion !== undefined)
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    if (datos.tipo !== undefined) datosActualizados.tipo = datos.tipo.trim();
    if (datos.ubicacion !== undefined)
      datosActualizados.ubicacion = datos.ubicacion?.trim() || null;
    if (datos.responsableId !== undefined)
      datosActualizados.responsableId = datos.responsableId || null;

    return this.prisma.evidencia.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, responsable: true },
    });
  }

  eliminarEvidencia(id: string) {
    return this.prisma.evidencia.delete({ where: { id } });
  }

  async crearPolitica(organizacionId: string, d: CrearPoliticaDto) {
    const titulo = d.titulo?.trim();
    if (!titulo) throw new BadRequestException('El título es obligatorio');
    if (
      !(await this.prisma.organizacion.findUnique({
        where: { id: organizacionId },
      }))
    )
      throw new BadRequestException('La organización no existe');
    await this.validarResponsableDeOrganizacion(
      d.responsableId,
      organizacionId,
    );
    return this.prisma.politica.create({
      data: {
        organizacionId,
        titulo,
        descripcion: d.descripcion?.trim() || null,
        version: d.version?.trim() || '1.0',
        estado: d.estado?.trim() || 'BORRADOR',
        responsableId: d.responsableId,
        fechaRevision: this.validarFecha(d.fechaRevision, 'fecha de revisión'),
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

  async actualizarPolitica(id: string, d: ActualizarPoliticaDto) {
    const politica = await this.prisma.politica.findUnique({ where: { id } });
    if (!politica) return null;
    if (d.responsableId) {
      await this.validarResponsableDeOrganizacion(
        d.responsableId,
        politica.organizacionId,
      );
    }
    const datosActualizados: Prisma.PoliticaUncheckedUpdateInput = {};

    if (d.titulo !== undefined) datosActualizados.titulo = d.titulo.trim();
    if (d.descripcion !== undefined)
      datosActualizados.descripcion = d.descripcion.trim() || null;
    if (d.version !== undefined) datosActualizados.version = d.version.trim();
    if (d.estado !== undefined) datosActualizados.estado = d.estado.trim();
    if (d.responsableId !== undefined)
      datosActualizados.responsableId = d.responsableId || null;
    if (d.fechaRevision !== undefined)
      datosActualizados.fechaRevision = d.fechaRevision
        ? this.validarFecha(d.fechaRevision, 'fecha de revisión')
        : null;

    return this.prisma.politica.update({
      where: { id },
      data: datosActualizados,
      include: { organizacion: true, responsable: true },
    });
  }

  eliminarPolitica(id: string) {
    return this.prisma.politica.delete({ where: { id } });
  }

  private async validarActivoYResponsable(
    activoId: string,
    responsableId?: string,
  ) {
    if (!(await this.prisma.activo.findUnique({ where: { id: activoId } })))
      throw new BadRequestException('El activo no existe');
    if (
      responsableId &&
      !(await this.prisma.trabajador.findUnique({
        where: { id: responsableId },
      }))
    )
      throw new BadRequestException('El responsable no existe');
  }

  async crearVulnerabilidad(d: CrearVulnerabilidadDto) {
    const nombre = d.nombre?.trim();
    if (!nombre) throw new BadRequestException('El nombre es obligatorio');
    this.validarSla(d.sla);
    await this.validarActivoYResponsable(d.activoId, d.responsableId);
    return this.prisma.vulnerabilidad.create({
      data: {
        activoId: d.activoId,
        nombre,
        descripcion: d.descripcion?.trim() || null,
        cvss: d.cvss,
        sla: d.sla ?? null,
        planRemediacion: d.planRemediacion?.trim() || null,
        responsableId: d.responsableId,
      },
      include: { activo: true, responsable: true },
    });
  }

  listarVulnerabilidades(estado?: string, cvssMin?: string) {
    return this.prisma.vulnerabilidad.findMany({
      where: {
        ...(estado ? { estado } : {}),
        ...(cvssMin !== undefined ? { cvss: { gte: Number(cvssMin) } } : {}),
      },
      include: { activo: true, responsable: true },
      orderBy: { nombre: 'asc' },
    });
  }

  consultarVulnerabilidad(id: string) {
    return this.prisma.vulnerabilidad.findUnique({
      where: { id },
      include: { activo: true, responsable: true },
    });
  }

  actualizarVulnerabilidad(id: string, d: ActualizarVulnerabilidadDto) {
    const datosActualizados: Prisma.VulnerabilidadUncheckedUpdateInput = {};

    if (d.nombre !== undefined) datosActualizados.nombre = d.nombre.trim();
    if (d.descripcion !== undefined)
      datosActualizados.descripcion = d.descripcion.trim() || null;
    if (d.cvss !== undefined) datosActualizados.cvss = d.cvss;
    if (d.sla !== undefined) {
      this.validarSla(d.sla);
      datosActualizados.sla = d.sla;
    }
    if (d.planRemediacion !== undefined)
      datosActualizados.planRemediacion = d.planRemediacion?.trim() || null;
    if (d.estado !== undefined) datosActualizados.estado = d.estado.trim();
    if (d.responsableId !== undefined)
      datosActualizados.responsableId = d.responsableId || null;

    return this.prisma.vulnerabilidad.update({
      where: { id },
      data: datosActualizados,
      include: { activo: true, responsable: true },
    });
  }

  eliminarVulnerabilidad(id: string) {
    return this.prisma.vulnerabilidad.delete({ where: { id } });
  }

  async crearRiesgo(d: CrearRiesgoDto) {
    const nombre = d.nombre?.trim();
    if (!nombre || d.probabilidad === undefined || d.impacto === undefined)
      throw new BadRequestException(
        'Nombre, probabilidad e impacto son obligatorios',
      );
    this.validarEscalaRiesgo(d.probabilidad, 'probabilidad');
    this.validarEscalaRiesgo(d.impacto, 'impacto');
    const tratamiento = this.validarTratamiento(d.tratamiento);
    await this.validarActivoYResponsable(d.activoId, d.responsableId);
    const riesgo = await this.prisma.riesgo.create({
      data: {
        activoId: d.activoId,
        nombre,
        descripcion: d.descripcion?.trim() || null,
        probabilidad: d.probabilidad,
        impacto: d.impacto,
        tratamiento,
        riesgoResidual: d.riesgoResidual?.trim() || null,
        aceptado: d.aceptado ?? false,
        responsableId: d.responsableId,
      },
      include: { activo: true, responsable: true },
    });
    return this.conPuntajeRiesgo(riesgo);
  }

  async listarRiesgos(estado?: string) {
    const riesgos = await this.prisma.riesgo.findMany({
      where: estado ? { estado } : undefined,
      include: { activo: true, responsable: true },
      orderBy: { nombre: 'asc' },
    });
    return riesgos.map((riesgo) => this.conPuntajeRiesgo(riesgo));
  }

  async consultarRiesgo(id: string) {
    const riesgo = await this.prisma.riesgo.findUnique({
      where: { id },
      include: { activo: true, responsable: true },
    });
    return riesgo ? this.conPuntajeRiesgo(riesgo) : null;
  }

  async actualizarRiesgo(id: string, d: ActualizarRiesgoDto) {
    const datosActualizados: Prisma.RiesgoUncheckedUpdateInput = {};

    if (d.nombre !== undefined) datosActualizados.nombre = d.nombre.trim();
    if (d.descripcion !== undefined)
      datosActualizados.descripcion = d.descripcion.trim() || null;
    if (d.probabilidad !== undefined) {
      this.validarEscalaRiesgo(d.probabilidad, 'probabilidad');
      datosActualizados.probabilidad = d.probabilidad;
    }
    if (d.impacto !== undefined) {
      this.validarEscalaRiesgo(d.impacto, 'impacto');
      datosActualizados.impacto = d.impacto;
    }
    if (d.tratamiento !== undefined)
      datosActualizados.tratamiento = this.validarTratamiento(d.tratamiento);
    if (d.riesgoResidual !== undefined)
      datosActualizados.riesgoResidual = d.riesgoResidual?.trim() || null;
    if (d.aceptado !== undefined) datosActualizados.aceptado = d.aceptado;
    if (d.estado !== undefined) datosActualizados.estado = d.estado.trim();
    if (d.responsableId !== undefined)
      datosActualizados.responsableId = d.responsableId || null;

    const riesgo = await this.prisma.riesgo.update({
      where: { id },
      data: datosActualizados,
      include: { activo: true, responsable: true },
    });
    return this.conPuntajeRiesgo(riesgo);
  }

  private validarEscalaRiesgo(valor: number, campo: string): void {
    if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
      throw new BadRequestException(
        `La ${campo} debe ser un valor entero entre 1 y 5`,
      );
    }
  }

  private conPuntajeRiesgo<T extends { probabilidad: number; impacto: number }>(
    riesgo: T,
  ) {
    return {
      ...riesgo,
      puntajeInherente: riesgo.probabilidad * riesgo.impacto,
    };
  }

  eliminarRiesgo(id: string) {
    return this.prisma.riesgo.delete({ where: { id } });
  }

  private validarTratamiento(tratamiento?: string | null): string | null {
    if (!tratamiento?.trim()) {
      return null;
    }

    const valor = tratamiento.trim().toUpperCase();
    const permitidos = ['MITIGAR', 'TRANSFERIR', 'EVITAR', 'ACEPTAR'];

    if (!permitidos.includes(valor)) {
      throw new BadRequestException(
        'El tratamiento debe ser MITIGAR, TRANSFERIR, EVITAR o ACEPTAR',
      );
    }

    return valor;
  }

  private validarSla(sla?: number | null): void {
    if (
      sla !== undefined &&
      sla !== null &&
      (!Number.isInteger(sla) || sla < 0)
    ) {
      throw new BadRequestException(
        'El SLA debe ser un número entero mayor o igual a cero',
      );
    }
  }

  async crearIncidente(d: CrearIncidenteDto) {
    const titulo = d.titulo?.trim();
    if (!titulo || !d.severidad?.trim())
      throw new BadRequestException('Título y severidad son obligatorios');
    await this.validarActivoYResponsable(d.activoId, d.responsableId);
    return this.prisma.incidente.create({
      data: {
        activoId: d.activoId,
        titulo,
        descripcion: d.descripcion?.trim() || null,
        severidad: d.severidad.trim(),
        estado: d.estado?.trim() || 'ABIERTO',
        leccionesAprendidas: d.leccionesAprendidas?.trim() || null,
        responsableId: d.responsableId,
      },
      include: { activo: true, responsable: true },
    });
  }

  listarIncidentes(estado?: string, severidad?: string) {
    return this.prisma.incidente.findMany({
      where: {
        ...(estado ? { estado } : {}),
        ...(severidad ? { severidad } : {}),
      },
      include: { activo: true, responsable: true },
      orderBy: { titulo: 'asc' },
    });
  }

  consultarIncidente(id: string) {
    return this.prisma.incidente.findUnique({
      where: { id },
      include: { activo: true, responsable: true },
    });
  }

  actualizarIncidente(id: string, d: ActualizarIncidenteDto) {
    const datosActualizados: Prisma.IncidenteUncheckedUpdateInput = {};

    if (d.titulo !== undefined) datosActualizados.titulo = d.titulo.trim();
    if (d.descripcion !== undefined)
      datosActualizados.descripcion = d.descripcion.trim() || null;
    if (d.severidad !== undefined)
      datosActualizados.severidad = d.severidad.trim();
    if (d.estado !== undefined) datosActualizados.estado = d.estado.trim();
    if (d.leccionesAprendidas !== undefined)
      datosActualizados.leccionesAprendidas =
        d.leccionesAprendidas?.trim() || null;
    if (d.responsableId !== undefined)
      datosActualizados.responsableId = d.responsableId || null;

    return this.prisma.incidente.update({
      where: { id },
      data: datosActualizados,
      include: { activo: true, responsable: true },
    });
  }

  eliminarIncidente(id: string) {
    return this.prisma.incidente.delete({ where: { id } });
  }

  async crearActivo(unidadOrganizativaId: string, datos: CrearActivoDto) {
    const nombre = datos.nombre?.trim();
    const tipo = datos.tipo?.trim().toUpperCase();
    const criticidad = datos.criticidad?.trim().toUpperCase() || 'MEDIA';
    const clasificacion = datos.clasificacion?.trim().toUpperCase();

    if (!nombre || !tipo || !clasificacion) {
      throw new BadRequestException(
        'Nombre, tipo y clasificación son obligatorios',
      );
    }

    this.validarClasificacionDeActivo(tipo, criticidad, clasificacion);
    const unidad = await this.prisma.unidadOrganizativa.findUnique({
      where: { id: unidadOrganizativaId },
    });
    if (!unidad)
      throw new BadRequestException('La unidad organizativa no existe');
    await this.validarResponsableDeUnidad(
      datos.responsableId,
      unidadOrganizativaId,
    );
    return this.prisma.activo.create({
      data: {
        nombre,
        tipo,
        unidadOrganizativaId,
        descripcion: datos.descripcion?.trim() || null,
        criticidad,
        clasificacion,
        responsableId: datos.responsableId,
      },
      include: { unidadOrganizativa: true, responsable: true },
    });
  }

  async listarActivos(unidadId?: string) {
    let idsUnidad: string[] | undefined;
    if (unidadId) {
      const unidad = await this.prisma.unidadOrganizativa.findUnique({
        where: { id: unidadId },
        select: { id: true },
      });
      if (!unidad) throw new BadRequestException('La unidad no existe');
      idsUnidad = [unidadId];
      for (let inicio = 0; inicio < idsUnidad.length;) {
        const actuales = idsUnidad.slice(inicio);
        const hijos = await this.prisma.unidadOrganizativa.findMany({
          where: { unidadPadreId: { in: actuales } },
          select: { id: true },
        });
        const nuevos = hijos
          .map(({ id }) => id)
          .filter((id) => !idsUnidad!.includes(id));
        idsUnidad.push(...nuevos);
        inicio = idsUnidad.length;
      }
    }
    return this.prisma.activo.findMany({
      where: idsUnidad
        ? { unidadOrganizativaId: { in: idsUnidad } }
        : undefined,
      include: { unidadOrganizativa: true, responsable: true },
      orderBy: { nombre: 'asc' },
    });
  }

  consultarActivo(id: string) {
    return this.prisma.activo.findUnique({
      where: { id },
      include: { unidadOrganizativa: true, responsable: true },
    });
  }

  async actualizarActivo(id: string, datos: ActualizarActivoDto) {
    const activo = await this.prisma.activo.findUnique({ where: { id } });

    if (!activo) {
      throw new BadRequestException('El activo no existe');
    }

    if (datos.responsableId) {
      await this.validarResponsableDeUnidad(
        datos.responsableId,
        activo.unidadOrganizativaId,
      );
    }
    if (datos.nombre !== undefined && !datos.nombre.trim())
      throw new BadRequestException('El nombre no puede estar vacío');

    const tipo = datos.tipo?.trim().toUpperCase();
    const criticidad = datos.criticidad?.trim().toUpperCase();
    const clasificacion = datos.clasificacion?.trim().toUpperCase();

    if (datos.tipo !== undefined && !tipo) {
      throw new BadRequestException('El tipo no puede estar vacío');
    }

    if (tipo || criticidad || clasificacion) {
      this.validarClasificacionDeActivo(tipo, criticidad, clasificacion);
    }

    const datosActualizados: Prisma.ActivoUncheckedUpdateInput = {};

    if (datos.nombre !== undefined)
      datosActualizados.nombre = datos.nombre.trim();
    if (datos.descripcion !== undefined)
      datosActualizados.descripcion = datos.descripcion.trim() || null;
    if (tipo !== undefined) datosActualizados.tipo = tipo;
    if (datos.criticidad !== undefined)
      datosActualizados.criticidad = criticidad;
    if (clasificacion !== undefined)
      datosActualizados.clasificacion = clasificacion;
    if (datos.responsableId !== undefined)
      datosActualizados.responsableId = datos.responsableId || null;

    return this.prisma.activo.update({
      where: { id },
      data: datosActualizados,
      include: { unidadOrganizativa: true, responsable: true },
    });
  }

  eliminarActivo(id: string) {
    return this.prisma.activo.delete({ where: { id } });
  }

  private async validarResponsableDeUnidad(
    responsableId: string | undefined,
    unidadOrganizativaId: string,
  ): Promise<void> {
    if (!responsableId) {
      return;
    }

    const responsable = await this.prisma.trabajador.findUnique({
      where: { id: responsableId },
    });

    if (!responsable) {
      throw new BadRequestException('El responsable no existe');
    }

    if (responsable.unidadOrganizativaId !== unidadOrganizativaId) {
      throw new BadRequestException(
        'El responsable debe pertenecer a la unidad organizativa del activo',
      );
    }
  }

  private async validarResponsableExistente(
    responsableId?: string,
  ): Promise<void> {
    if (
      responsableId &&
      !(await this.prisma.trabajador.findUnique({
        where: { id: responsableId },
      }))
    ) {
      throw new BadRequestException('El responsable no existe');
    }
  }

  private validarClasificacionDeActivo(
    tipo: string | undefined,
    criticidad: string | undefined,
    clasificacion?: string,
  ): void {
    const tiposPermitidos = ['HW', 'SW', 'DATO', 'SERVICIO'];
    const criticidadesPermitidas = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

    if (tipo && !tiposPermitidos.includes(tipo)) {
      throw new BadRequestException('El tipo debe ser HW, SW, DATO o SERVICIO');
    }

    if (criticidad && !criticidadesPermitidas.includes(criticidad)) {
      throw new BadRequestException(
        'La criticidad debe ser BAJA, MEDIA, ALTA o CRITICA',
      );
    }
    if (
      clasificacion &&
      !['PUBLICO', 'INTERNO', 'CONFIDENCIAL', 'SECRETO'].includes(clasificacion)
    ) {
      throw new BadRequestException(
        'La clasificación debe ser PUBLICO, INTERNO, CONFIDENCIAL o SECRETO',
      );
    }
  }

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

  listar() {
    return this.prisma.organizacion.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  crear(datos: CrearOrganizacionDto) {
    const nombre = datos.nombre?.trim();

    if (!nombre) {
      throw new BadRequestException(
        'El nombre de la organización es obligatorio',
      );
    }

    const alcanceSgsi = this.validarAlcanceSgsi(datos.alcanceSgsi);

    return this.prisma.organizacion.create({
      data: { nombre, alcanceSgsi },
    });
  }

  consultar(id: string) {
    return this.prisma.organizacion.findUnique({
      where: { id },
    });
  }

  consultarMapa(id: string) {
    return this.prisma.organizacion.findUnique({
      where: { id },
      include: {
        unidades: {
          include: { responsable: true },
          orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
        },
        procesos: {
          include: {
            responsable: { include: { unidadOrganizativa: true } },
            asignacionesRaci: {
              include: {
                trabajador: { include: { unidadOrganizativa: true } },
              },
              orderBy: { tipoResponsabilidad: 'asc' },
            },
          },
          orderBy: { nombre: 'asc' },
        },
      },
    });
  }

  async actualizar(id: string, datos: ActualizarOrganizacionDto) {
    const organizacion = await this.consultar(id);

    if (!organizacion) {
      return null;
    }

    const nombre = datos.nombre?.trim();

    if (datos.nombre !== undefined && !nombre) {
      throw new BadRequestException(
        'El nombre de la organización no puede estar vacío',
      );
    }

    const datosActualizados: Prisma.OrganizacionUncheckedUpdateInput = {};

    if (nombre !== undefined) {
      datosActualizados.nombre = nombre;
    }

    if (datos.alcanceSgsi !== undefined) {
      datosActualizados.alcanceSgsi = this.validarAlcanceSgsi(
        datos.alcanceSgsi,
      );
    }

    return this.prisma.organizacion.update({
      where: { id },
      data: datosActualizados,
    });
  }

  private validarAlcanceSgsi(valor: string | null | undefined) {
    if (valor === undefined || valor === null) {
      return valor ?? null;
    }
    const alcance = valor.trim();
    if (!alcance || alcance.length > 2000) {
      throw new BadRequestException(
        'El alcance del SGSI debe tener entre 1 y 2000 caracteres',
      );
    }
    return alcance;
  }

  async crearUnidad(organizacionId: string, datos: CrearUnidadOrganizativaDto) {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
    });

    if (!organizacion) {
      throw new BadRequestException('La organización no existe');
    }

    const nombre = datos.nombre?.trim();

    if (!nombre) {
      throw new BadRequestException('El nombre de la unidad es obligatorio');
    }

    await this.validarResponsableDeOrganizacion(
      datos.responsableId,
      organizacionId,
    );
    if (datos.unidadPadreId) {
      const padre = await this.prisma.unidadOrganizativa.findUnique({
        where: { id: datos.unidadPadreId },
      });
      if (!padre || padre.organizacionId !== organizacionId) {
        throw new BadRequestException(
          'La unidad padre no pertenece a la organización',
        );
      }
    }

    return this.prisma.unidadOrganizativa.create({
      data: {
        organizacionId,
        unidadPadreId: datos.unidadPadreId,
        tipo: datos.tipo,
        nombre,
        responsableId: datos.responsableId,
      },
    });
  }

  listarUnidades(organizacionId: string) {
    return this.prisma.unidadOrganizativa.findMany({
      where: { organizacionId },
      orderBy: { nombre: 'asc' },
      include: { responsable: true },
    });
  }

  consultarUnidad(id: string) {
    return this.prisma.unidadOrganizativa.findUnique({
      where: { id },
      include: {
        organizacion: true,
        unidadPadre: true,
        unidadesHijas: true,
        responsable: true,
      },
    });
  }

  async actualizarUnidad(id: string, datos: ActualizarUnidadOrganizativaDto) {
    const unidad = await this.consultarUnidad(id);

    if (!unidad) {
      return null;
    }

    const nombre = datos.nombre?.trim();

    if (datos.nombre !== undefined && !nombre) {
      throw new BadRequestException(
        'El nombre de la unidad no puede estar vacío',
      );
    }

    const datosActualizados: Prisma.UnidadOrganizativaUncheckedUpdateInput = {
      unidadPadreId: datos.unidadPadreId,
      tipo: datos.tipo,
    };

    if (nombre !== undefined) {
      datosActualizados.nombre = nombre;
    }

    if (datos.responsableId !== undefined) {
      if (datos.responsableId) {
        await this.validarResponsableDeOrganizacion(
          datos.responsableId,
          unidad.organizacionId,
        );
      }
      datosActualizados.responsableId = datos.responsableId;
    }

    return this.prisma.unidadOrganizativa.update({
      where: { id },
      data: datosActualizados,
      include: { responsable: true },
    });
  }

  async eliminarUnidad(id: string) {
    const unidad = await this.prisma.unidadOrganizativa.findUnique({
      where: { id },
    });

    if (!unidad) {
      return null;
    }

    return this.prisma.unidadOrganizativa.delete({
      where: { id },
    });
  }

  async crearTrabajador(
    unidadOrganizativaId: string,
    datos: CrearTrabajadorDto,
  ) {
    const unidad = await this.prisma.unidadOrganizativa.findUnique({
      where: { id: unidadOrganizativaId },
    });

    if (!unidad) {
      throw new BadRequestException('La unidad organizativa no existe');
    }

    const nombre = datos.nombre?.trim();
    const cargo = datos.cargo?.trim();

    if (!nombre || !cargo) {
      throw new BadRequestException('El nombre y el cargo son obligatorios');
    }

    return this.prisma.trabajador.create({
      data: {
        unidadOrganizativaId,
        nombre,
        cargo,
        correo: datos.correo?.trim() || null,
      },
    });
  }

  listarTrabajadores() {
    return this.prisma.trabajador.findMany({
      orderBy: { nombre: 'asc' },
      include: { unidadOrganizativa: true },
    });
  }

  consultarTrabajador(id: string) {
    return this.prisma.trabajador.findUnique({
      where: { id },
      include: { unidadOrganizativa: true },
    });
  }

  async actualizarTrabajador(id: string, datos: ActualizarTrabajadorDto) {
    const trabajador = await this.consultarTrabajador(id);

    if (!trabajador) {
      return null;
    }

    const nombre = datos.nombre?.trim();
    const cargo = datos.cargo?.trim();

    if (datos.nombre !== undefined && !nombre) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }

    if (datos.cargo !== undefined && !cargo) {
      throw new BadRequestException('El cargo no puede estar vacío');
    }

    const datosActualizados: Prisma.TrabajadorUncheckedUpdateInput = {};

    if (nombre !== undefined) {
      datosActualizados.nombre = nombre;
    }

    if (cargo !== undefined) {
      datosActualizados.cargo = cargo;
    }

    if (datos.correo !== undefined) {
      datosActualizados.correo = datos.correo?.trim() || null;
    }

    return this.prisma.trabajador.update({
      where: { id },
      data: datosActualizados,
    });
  }

  async eliminarTrabajador(id: string) {
    const trabajador = await this.prisma.trabajador.findUnique({
      where: { id },
    });

    if (!trabajador) {
      return null;
    }

    return this.prisma.trabajador.delete({
      where: { id },
    });
  }

  async crearProceso(datos: CrearProcesoDto) {
    const nombre = datos.nombre?.trim();

    if (!nombre) {
      throw new BadRequestException('El nombre del proceso es obligatorio');
    }

    if (datos.organizacionId) {
      const organizacion = await this.prisma.organizacion.findUnique({
        where: { id: datos.organizacionId },
      });
      if (!organizacion)
        throw new BadRequestException('La organización no existe');
      await this.validarResponsableDeOrganizacion(
        datos.responsableId,
        datos.organizacionId,
      );
    } else {
      await this.validarResponsableExistente(datos.responsableId);
    }
    return this.prisma.proceso.create({
      data: {
        organizacionId: datos.organizacionId,
        nombre,
        descripcion: datos.descripcion?.trim() || null,
        version: datos.version?.trim() || '1.0',
        estado: datos.estado?.trim() || 'BORRADOR',
        responsableId: datos.responsableId,
        fechaRevision: this.validarFecha(
          datos.fechaRevision,
          'fecha de revisión',
        ),
      },
      include: { responsable: { include: { unidadOrganizativa: true } } },
    });
  }

  listarProcesos() {
    return this.prisma.proceso.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        responsable: { include: { unidadOrganizativa: true } },
        asignacionesRaci: {
          include: {
            trabajador: { include: { unidadOrganizativa: true } },
          },
          orderBy: { tipoResponsabilidad: 'asc' },
        },
      },
    });
  }

  consultarProceso(id: string) {
    return this.prisma.proceso.findUnique({
      where: { id },
      include: {
        responsable: { include: { unidadOrganizativa: true } },
        asignacionesRaci: {
          include: {
            trabajador: { include: { unidadOrganizativa: true } },
          },
          orderBy: { tipoResponsabilidad: 'asc' },
        },
      },
    });
  }

  async actualizarProceso(id: string, datos: ActualizarProcesoDto) {
    const proceso = await this.consultarProceso(id);

    if (!proceso) {
      return null;
    }

    const nombre = datos.nombre?.trim();

    if (datos.nombre !== undefined && !nombre) {
      throw new BadRequestException(
        'El nombre del proceso no puede estar vacío',
      );
    }

    const datosActualizados: Prisma.ProcesoUncheckedUpdateInput = {};

    if (nombre !== undefined) {
      datosActualizados.nombre = nombre;
    }

    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion?.trim() || null;
    }

    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado;
    }

    if (datos.version !== undefined)
      datosActualizados.version = datos.version.trim();
    if (datos.responsableId !== undefined) {
      if (proceso.organizacionId) {
        await this.validarResponsableDeOrganizacion(
          datos.responsableId || undefined,
          proceso.organizacionId,
        );
      } else {
        await this.validarResponsableExistente(
          datos.responsableId || undefined,
        );
      }
      datosActualizados.responsableId = datos.responsableId || null;
    }
    if (datos.fechaRevision !== undefined)
      datosActualizados.fechaRevision = this.validarFecha(
        datos.fechaRevision || undefined,
        'fecha de revisión',
      );

    return this.prisma.proceso.update({
      where: { id },
      data: datosActualizados,
      include: { responsable: { include: { unidadOrganizativa: true } } },
    });
  }

  async eliminarProceso(id: string) {
    const proceso = await this.consultarProceso(id);

    if (!proceso) {
      return null;
    }

    return this.prisma.proceso.delete({
      where: { id },
    });
  }

  async crearAsignacionRaci(datos: CrearAsignacionRaciDto) {
    const [proceso, trabajador] = await Promise.all([
      this.prisma.proceso.findUnique({ where: { id: datos.procesoId } }),
      this.prisma.trabajador.findUnique({ where: { id: datos.trabajadorId } }),
    ]);

    if (!proceso) {
      throw new BadRequestException('El proceso no existe');
    }

    if (!trabajador) {
      throw new BadRequestException('El trabajador no existe');
    }

    return this.prisma.asignacionRaci.create({
      data: {
        procesoId: datos.procesoId,
        trabajadorId: datos.trabajadorId,
        tipoResponsabilidad: datos.tipoResponsabilidad,
      },
      include: { proceso: true, trabajador: true },
    });
  }

  listarAsignacionesRaci() {
    return this.prisma.asignacionRaci.findMany({
      include: { proceso: true, trabajador: true },
      orderBy: { tipoResponsabilidad: 'asc' },
    });
  }

  consultarAsignacionRaci(id: string) {
    return this.prisma.asignacionRaci.findUnique({
      where: { id },
      include: { proceso: true, trabajador: true },
    });
  }

  async actualizarAsignacionRaci(
    id: string,
    datos: ActualizarAsignacionRaciDto,
  ) {
    const asignacion = await this.consultarAsignacionRaci(id);

    if (!asignacion) {
      return null;
    }

    return this.prisma.asignacionRaci.update({
      where: { id },
      data: { tipoResponsabilidad: datos.tipoResponsabilidad },
      include: { proceso: true, trabajador: true },
    });
  }

  async eliminarAsignacionRaci(id: string) {
    const asignacion = await this.consultarAsignacionRaci(id);

    if (!asignacion) {
      return null;
    }

    return this.prisma.asignacionRaci.delete({ where: { id } });
  }
}
