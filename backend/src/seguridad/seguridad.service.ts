import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CrearVulnerabilidadDto } from './dto/vulnerabilidad/crear-vulnerabilidad.dto';
import { ActualizarVulnerabilidadDto } from './dto/vulnerabilidad/actualizar-vulnerabilidad.dto';
import { CrearRiesgoDto } from './dto/riesgo/crear-riesgo.dto';
import { ActualizarRiesgoDto } from './dto/riesgo/actualizar-riesgo.dto';
import { CrearIncidenteDto } from './dto/incidente/crear-incidente.dto';
import { ActualizarIncidenteDto } from './dto/incidente/actualizar-incidente.dto';
import { ActualizarActivoDto } from './dto/activo/actualizar-activo.dto';
import { CrearActivoDto } from './dto/activo/crear-activo.dto';

@Injectable()
export class SeguridadService {
  constructor(private readonly prisma: PrismaService) {}

  // Activos

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
    if (!unidad) {
      throw new BadRequestException('La unidad organizativa no existe');
    }
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
        procesos: datos.procesoIds?.length
          ? { connect: datos.procesoIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { unidadOrganizativa: true, responsable: true, procesos: true },
    });
  }

  async listarActivos(unidadId?: string) {
    let idsUnidad: string[] | undefined;
    if (unidadId) {
      const unidad = await this.prisma.unidadOrganizativa.findUnique({
        where: { id: unidadId },
        select: { id: true },
      });
      if (!unidad) {
        throw new BadRequestException('La unidad no existe');
      }
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
      include: { unidadOrganizativa: true, responsable: true, procesos: true },
      orderBy: { nombre: 'asc' },
    });
  }

  consultarActivo(id: string) {
    return this.prisma.activo.findUnique({
      where: { id },
      include: { unidadOrganizativa: true, responsable: true, procesos: true },
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
    if (datos.nombre !== undefined && !datos.nombre.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }
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
    if (datos.nombre !== undefined) {
      datosActualizados.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion.trim() || null;
    }
    if (tipo !== undefined) {
      datosActualizados.tipo = tipo;
    }
    if (datos.criticidad !== undefined) {
      datosActualizados.criticidad = criticidad;
    }
    if (clasificacion !== undefined) {
      datosActualizados.clasificacion = clasificacion;
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    if (datos.procesoIds !== undefined) {
      datosActualizados.procesos = {
        set: datos.procesoIds.map((procesoId) => ({ id: procesoId })),
      };
    }
    return this.prisma.activo.update({
      where: { id },
      data: datosActualizados,
      include: { unidadOrganizativa: true, responsable: true, procesos: true },
    });
  }

  eliminarActivo(id: string) {
    return this.prisma.activo.delete({ where: { id } });
  }

  // Riesgos

  async crearRiesgo(datos: CrearRiesgoDto) {
    const nombre = datos.nombre?.trim();
    if (
      !nombre ||
      datos.probabilidad === undefined ||
      datos.impacto === undefined
    ) {
      throw new BadRequestException(
        'Nombre, probabilidad e impacto son obligatorios',
      );
    }
    this.validarEscalaRiesgo(datos.probabilidad, 'probabilidad');
    this.validarEscalaRiesgo(datos.impacto, 'impacto');
    const tratamiento = this.validarTratamiento(datos.tratamiento);
    await this.validarActivoYResponsable(datos.activoId, datos.responsableId);
    const riesgo = await this.prisma.riesgo.create({
      data: {
        activoId: datos.activoId,
        nombre,
        descripcion: datos.descripcion?.trim() || null,
        probabilidad: datos.probabilidad,
        impacto: datos.impacto,
        tratamiento,
        riesgoResidual: datos.riesgoResidual?.trim() || null,
        aceptado: datos.aceptado ?? false,
        responsableId: datos.responsableId,
      },
      include: { activo: true, responsable: true },
    });
    return this.conPuntajeRiesgo(riesgo);
  }

  async listarRiesgos(estado?: string, unidadId?: string) {
    const riesgos = await this.prisma.riesgo.findMany({
      where: {
        ...(estado ? { estado } : {}),
        ...(unidadId ? { activo: { unidadOrganizativaId: unidadId } } : {}),
      },
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

  async actualizarRiesgo(id: string, datos: ActualizarRiesgoDto) {
    const datosActualizados: Prisma.RiesgoUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      datosActualizados.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion.trim() || null;
    }
    if (datos.probabilidad !== undefined) {
      this.validarEscalaRiesgo(datos.probabilidad, 'probabilidad');
      datosActualizados.probabilidad = datos.probabilidad;
    }
    if (datos.impacto !== undefined) {
      this.validarEscalaRiesgo(datos.impacto, 'impacto');
      datosActualizados.impacto = datos.impacto;
    }
    if (datos.tratamiento !== undefined) {
      datosActualizados.tratamiento = this.validarTratamiento(
        datos.tratamiento,
      );
    }
    if (datos.riesgoResidual !== undefined) {
      datosActualizados.riesgoResidual = datos.riesgoResidual?.trim() || null;
    }
    if (datos.aceptado !== undefined) {
      datosActualizados.aceptado = datos.aceptado;
    }
    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado.trim();
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    const riesgo = await this.prisma.riesgo.update({
      where: { id },
      data: datosActualizados,
      include: { activo: true, responsable: true },
    });
    return this.conPuntajeRiesgo(riesgo);
  }

  eliminarRiesgo(id: string) {
    return this.prisma.riesgo.delete({ where: { id } });
  }

  // Vulnerabilidades

  async crearVulnerabilidad(datos: CrearVulnerabilidadDto) {
    const nombre = datos.nombre?.trim();
    if (!nombre) {
      throw new BadRequestException('El nombre es obligatorio');
    }
    this.validarSla(datos.sla);
    await this.validarActivoYResponsable(datos.activoId, datos.responsableId);
    return this.prisma.vulnerabilidad.create({
      data: {
        activoId: datos.activoId,
        nombre,
        descripcion: datos.descripcion?.trim() || null,
        cvss: datos.cvss,
        sla: datos.sla ?? null,
        planRemediacion: datos.planRemediacion?.trim() || null,
        responsableId: datos.responsableId,
      },
      include: { activo: true, responsable: true },
    });
  }

  listarVulnerabilidades(estado?: string, cvssMin?: string, unidadId?: string) {
    return this.prisma.vulnerabilidad.findMany({
      where: {
        ...(unidadId ? { activo: { unidadOrganizativaId: unidadId } } : {}),
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

  actualizarVulnerabilidad(id: string, datos: ActualizarVulnerabilidadDto) {
    const datosActualizados: Prisma.VulnerabilidadUncheckedUpdateInput = {};
    if (datos.nombre !== undefined) {
      datosActualizados.nombre = datos.nombre.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion.trim() || null;
    }
    if (datos.cvss !== undefined) {
      datosActualizados.cvss = datos.cvss;
    }
    if (datos.sla !== undefined) {
      this.validarSla(datos.sla);
      datosActualizados.sla = datos.sla;
    }
    if (datos.planRemediacion !== undefined) {
      datosActualizados.planRemediacion = datos.planRemediacion?.trim() || null;
    }
    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado.trim();
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    return this.prisma.vulnerabilidad.update({
      where: { id },
      data: datosActualizados,
      include: { activo: true, responsable: true },
    });
  }

  eliminarVulnerabilidad(id: string) {
    return this.prisma.vulnerabilidad.delete({ where: { id } });
  }

  // Incidentes

  async crearIncidente(
    datos: CrearIncidenteDto,
    usuario: {
      id: string;
      correo: string;
    },
  ) {
    const titulo = datos.titulo?.trim();
    if (!titulo || !datos.severidad?.trim()) {
      throw new BadRequestException('Título y severidad son obligatorios');
    }
    if (datos.estado && datos.estado !== 'ABIERTO') {
      throw new BadRequestException('El incidente debe comenzar ABIERTO');
    }
    if (
      datos.accionRealizada !== undefined &&
      (typeof datos.accionRealizada !== 'string' ||
        datos.accionRealizada.length > 2000)
    ) {
      throw new BadRequestException('Acción inválida (máximo 2000 caracteres)');
    }
    await this.validarActivoYResponsable(datos.activoId, datos.responsableId);
    return this.prisma.incidente.create({
      data: {
        activoId: datos.activoId,
        titulo,
        descripcion: datos.descripcion?.trim() || null,
        severidad: datos.severidad.trim(),
        estado: 'ABIERTO',
        historial: {
          create: {
            estado: 'ABIERTO',
            descripcion:
              datos.accionRealizada?.trim() ||
              'Detección: incidente registrado.',
            usuarioId: usuario.id,
            usuarioCorreo: usuario.correo,
          },
        },
        leccionesAprendidas: datos.leccionesAprendidas?.trim() || null,
        responsableId: datos.responsableId,
      },
      include: {
        activo: true,
        responsable: true,
        historial: { orderBy: { fecha: 'asc' } },
      },
    });
  }

  listarIncidentes(estado?: string, severidad?: string, unidadId?: string) {
    return this.prisma.incidente.findMany({
      where: {
        ...(unidadId ? { activo: { unidadOrganizativaId: unidadId } } : {}),
        ...(estado ? { estado } : {}),
        ...(severidad ? { severidad } : {}),
      },
      include: {
        activo: true,
        responsable: true,
        historial: { orderBy: { fecha: 'asc' } },
      },
      orderBy: { titulo: 'asc' },
    });
  }

  consultarIncidente(id: string) {
    return this.prisma.incidente.findUnique({
      where: { id },
      include: {
        activo: true,
        responsable: true,
        historial: { orderBy: { fecha: 'asc' } },
      },
    });
  }

  async actualizarIncidente(
    id: string,
    datos: ActualizarIncidenteDto,
    usuario: {
      id: string;
      correo: string;
    },
  ) {
    for (const campo of ['titulo', 'severidad', 'estado'] as const) {
      if (
        datos[campo] !== undefined &&
        (typeof datos[campo] !== 'string' || !datos[campo]?.trim())
      ) {
        throw new BadRequestException(`${campo} debe ser texto no vacío`);
      }
    }
    if (
      datos.leccionesAprendidas !== undefined &&
      datos.leccionesAprendidas !== null &&
      typeof datos.leccionesAprendidas !== 'string'
    ) {
      throw new BadRequestException('Lecciones inválidas');
    }
    const actual = await this.prisma.incidente.findUnique({ where: { id } });
    if (!actual) {
      throw new NotFoundException('Incidente inexistente');
    }
    const etapas = [
      'ABIERTO',
      'CONTENIDO',
      'ERRADICADO',
      'RECUPERADO',
      'CERRADO',
    ];
    const estado = datos.estado ?? actual.estado;
    const paso = etapas.indexOf(estado) - etapas.indexOf(actual.estado);
    if (!etapas.includes(estado) || ![0, 1].includes(paso)) {
      throw new BadRequestException(
        'Solo se permite mantener la etapa o avanzar a la siguiente',
      );
    }
    if (
      datos.accionRealizada !== undefined &&
      (typeof datos.accionRealizada !== 'string' ||
        datos.accionRealizada.length > 2000)
    ) {
      throw new BadRequestException('Acción inválida (máximo 2000 caracteres)');
    }
    const accion = datos.accionRealizada?.trim();
    if (paso === 1 && !accion) {
      throw new BadRequestException(
        'Describí la acción realizada para avanzar',
      );
    }
    if (
      estado === 'CERRADO' &&
      !(
        datos.leccionesAprendidas !== undefined
          ? datos.leccionesAprendidas
          : actual.leccionesAprendidas
      )?.trim()
    ) {
      throw new BadRequestException(
        'Las lecciones aprendidas son obligatorias para cerrar',
      );
    }
    await this.validarActivoYResponsable(
      actual.activoId,
      datos.responsableId || actual.responsableId || undefined,
    );
    const datosActualizados: Prisma.IncidenteUncheckedUpdateInput = {};
    if (datos.titulo !== undefined) {
      datosActualizados.titulo = datos.titulo.trim();
    }
    if (datos.descripcion !== undefined) {
      datosActualizados.descripcion = datos.descripcion.trim() || null;
    }
    if (datos.severidad !== undefined) {
      datosActualizados.severidad = datos.severidad.trim();
    }
    if (datos.estado !== undefined) {
      datosActualizados.estado = datos.estado.trim();
    }
    if (datos.leccionesAprendidas !== undefined) {
      datosActualizados.leccionesAprendidas =
        datos.leccionesAprendidas?.trim() || null;
    }
    if (datos.responsableId !== undefined) {
      datosActualizados.responsableId = datos.responsableId || null;
    }
    if (accion) {
      datosActualizados.historial = {
        create: {
          estado,
          descripcion: accion,
          usuarioId: usuario.id,
          usuarioCorreo: usuario.correo,
        },
      };
    }
    return this.prisma.incidente.update({
      where: { id },
      data: datosActualizados,
      include: {
        activo: true,
        responsable: true,
        historial: { orderBy: { fecha: 'asc' } },
      },
    });
  }

  eliminarIncidente(id: string) {
    return this.prisma.incidente.delete({ where: { id } });
  }

  // Validaciones usadas por las operaciones anteriores

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

  private async validarActivoYResponsable(
    activoId: string,
    responsableId?: string,
  ) {
    if (!(await this.prisma.activo.findUnique({ where: { id: activoId } }))) {
      throw new BadRequestException('El activo no existe');
    }
    if (
      responsableId &&
      !(await this.prisma.trabajador.findUnique({
        where: { id: responsableId },
      }))
    ) {
      throw new BadRequestException('El responsable no existe');
    }
  }

  private validarEscalaRiesgo(valor: number, campo: string): void {
    if (!Number.isInteger(valor) || valor < 1 || valor > 5) {
      throw new BadRequestException(
        `La ${campo} debe ser un valor entero entre 1 y 5`,
      );
    }
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

  private conPuntajeRiesgo<
    T extends {
      probabilidad: number;
      impacto: number;
    },
  >(riesgo: T) {
    return {
      ...riesgo,
      puntajeInherente: riesgo.probabilidad * riesgo.impacto,
    };
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
}
