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

@Injectable()
export class OrganizacionService {
  constructor(private readonly prisma: PrismaService) {}

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

  listarTrabajadores(unidadOrganizativaId?: string) {
    return this.prisma.trabajador.findMany({
      where: unidadOrganizativaId ? { unidadOrganizativaId } : undefined,
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
      if (!organizacion) {
        throw new BadRequestException('La organización no existe');
      }
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

  listarProcesos(organizacionId?: string) {
    return this.prisma.proceso.findMany({
      where: organizacionId ? { organizacionId } : undefined,
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
    if (datos.version !== undefined) {
      datosActualizados.version = datos.version.trim();
    }
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
    if (datos.fechaRevision !== undefined) {
      datosActualizados.fechaRevision = this.validarFecha(
        datos.fechaRevision || undefined,
        'fecha de revisión',
      );
    }
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
