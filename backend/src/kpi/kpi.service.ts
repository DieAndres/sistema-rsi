import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActualizarIndicadorKpiDto } from './dto/actualizar-indicador-kpi.dto';
import { CrearIndicadorKpiDto } from './dto/crear-indicador-kpi.dto';

const FORMULAS = [
  {
    codigo: 'ACTIVOS_TOTAL',
    nombre: 'Total de activos',
    unidad: 'CANTIDAD',
  },
  {
    codigo: 'ACTIVOS_CON_RESPONSABLE_PORCENTAJE',
    nombre: 'Activos con responsable (%)',
    unidad: 'PORCENTAJE',
  },
  {
    codigo: 'RIESGOS_ABIERTOS',
    nombre: 'Riesgos abiertos',
    unidad: 'CANTIDAD',
  },
  {
    codigo: 'VULNERABILIDADES_ABIERTAS',
    nombre: 'Vulnerabilidades abiertas',
    unidad: 'CANTIDAD',
  },
  {
    codigo: 'VULNERABILIDADES_CRITICAS',
    nombre: 'Vulnerabilidades críticas',
    unidad: 'CANTIDAD',
  },
  {
    codigo: 'INCIDENTES_ABIERTOS',
    nombre: 'Incidentes abiertos',
    unidad: 'CANTIDAD',
  },
] as const;

const codigosFormula = new Set<string>(FORMULAS.map(({ codigo }) => codigo));

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  listarFormulas() {
    return FORMULAS;
  }

  async crearIndicador(datos: CrearIndicadorKpiDto) {
    if (!datos || typeof datos !== 'object') {
      throw new BadRequestException(
        'Los datos del indicador son obligatorios.',
      );
    }
    if (typeof datos.codigo !== 'string' || typeof datos.nombre !== 'string') {
      throw new BadRequestException('El código y el nombre deben ser texto.');
    }

    const codigo = datos.codigo?.trim();
    const nombre = datos.nombre?.trim();

    if (!codigo || !/^[A-Z][A-Z0-9_]{1,49}$/.test(codigo)) {
      throw new BadRequestException(
        'El código debe tener entre 2 y 50 caracteres: mayúsculas, números o guion bajo.',
      );
    }
    if (!nombre || nombre.length > 120) {
      throw new BadRequestException(
        'El nombre es obligatorio (máximo 120 caracteres).',
      );
    }
    const codigoExistente = await this.prisma.indicadorKpi.findUnique({
      where: { codigo },
      select: { id: true },
    });
    if (codigoExistente) {
      throw new ConflictException('Ya existe un indicador con ese código.');
    }
    this.validarFormula(datos.formula);
    this.validarMeta(datos.meta);
    if (datos.descripcion !== undefined) {
      this.validarDescripcion(datos.descripcion);
    }

    return this.prisma.indicadorKpi.create({
      data: {
        codigo,
        nombre,
        descripcion: datos.descripcion?.trim() || null,
        formula: datos.formula,
        meta: datos.meta,
      },
    });
  }

  listarIndicadores() {
    return this.prisma.indicadorKpi.findMany({
      orderBy: [{ activo: 'desc' }, { nombre: 'asc' }],
    });
  }

  async actualizarIndicador(id: string, datos: ActualizarIndicadorKpiDto) {
    if (!datos || typeof datos !== 'object') {
      throw new BadRequestException(
        'Los datos de actualización son obligatorios.',
      );
    }

    const indicador = await this.prisma.indicadorKpi.findUnique({
      where: { id },
    });
    if (!indicador) throw new NotFoundException('Indicador KPI no encontrado');

    if (
      datos.nombre !== undefined &&
      (typeof datos.nombre !== 'string' ||
        !datos.nombre.trim() ||
        datos.nombre.length > 120)
    ) {
      throw new BadRequestException(
        'El nombre es obligatorio (máximo 120 caracteres).',
      );
    }
    if (datos.formula !== undefined) this.validarFormula(datos.formula);
    if (datos.meta !== undefined) this.validarMeta(datos.meta);
    if (datos.descripcion !== undefined && datos.descripcion !== null) {
      this.validarDescripcion(datos.descripcion);
    }
    if (datos.activo !== undefined && typeof datos.activo !== 'boolean') {
      throw new BadRequestException('El estado activo debe ser booleano.');
    }

    const cambios: ActualizarIndicadorKpiDto = {};
    if (datos.nombre !== undefined) cambios.nombre = datos.nombre.trim();
    if (datos.descripcion !== undefined) {
      cambios.descripcion = datos.descripcion?.trim() || null;
    }
    if (datos.formula !== undefined) cambios.formula = datos.formula;
    if (datos.meta !== undefined) cambios.meta = datos.meta;
    if (datos.activo !== undefined) cambios.activo = datos.activo;

    return this.prisma.indicadorKpi.update({ where: { id }, data: cambios });
  }

  async registrarMedicion(id: string) {
    const indicador = await this.prisma.indicadorKpi.findUnique({
      where: { id },
    });
    if (!indicador) throw new NotFoundException('Indicador KPI no encontrado');
    if (!indicador.activo) {
      throw new BadRequestException(
        'No se pueden registrar mediciones de un indicador inactivo.',
      );
    }

    const valor = await this.calcular(indicador.formula);
    return this.prisma.medicionKpi.create({
      data: { indicadorId: id, valor },
    });
  }

  async consultarHistorico(id: string) {
    const existe = await this.prisma.indicadorKpi.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existe) throw new NotFoundException('Indicador KPI no encontrado');

    return this.prisma.medicionKpi.findMany({
      where: { indicadorId: id },
      orderBy: [{ fechaRegistro: 'desc' }, { id: 'desc' }],
    });
  }

  async resumen() {
    const [
      activos,
      activosConResponsable,
      riesgosAbiertos,
      vulnerabilidadesAbiertas,
      vulnerabilidadesCriticas,
      incidentes,
    ] = await Promise.all([
      this.prisma.activo.count(),
      this.prisma.activo.count({ where: { responsableId: { not: null } } }),
      this.prisma.riesgo.count({ where: { estado: 'ABIERTO' } }),
      this.prisma.vulnerabilidad.count({ where: { estado: 'ABIERTA' } }),
      this.prisma.vulnerabilidad.count({ where: { cvss: { gte: 9 } } }),
      this.prisma.incidente.groupBy({ by: ['estado'], _count: { _all: true } }),
    ]);

    return {
      activos: {
        total: activos,
        conResponsable: activosConResponsable,
        porcentajeConResponsable: activos
          ? Math.round((activosConResponsable / activos) * 100)
          : 0,
      },
      riesgos: { abiertos: riesgosAbiertos },
      vulnerabilidades: {
        abiertas: vulnerabilidadesAbiertas,
        criticas: vulnerabilidadesCriticas,
      },
      incidentes: Object.fromEntries(
        incidentes.map((incidente) => [
          incidente.estado,
          incidente._count._all,
        ]),
      ),
    };
  }

  private validarFormula(formula: string) {
    if (!codigosFormula.has(formula)) {
      throw new BadRequestException(
        'La fórmula seleccionada no está disponible.',
      );
    }
  }

  private validarMeta(meta: number) {
    if (typeof meta !== 'number' || !Number.isFinite(meta) || meta < 0) {
      throw new BadRequestException(
        'La meta debe ser un número válido mayor o igual a cero.',
      );
    }
  }

  private validarDescripcion(descripcion: string) {
    if (typeof descripcion !== 'string' || descripcion.length > 500) {
      throw new BadRequestException(
        'La descripción no puede superar 500 caracteres.',
      );
    }
  }

  private async calcular(formula: string): Promise<number> {
    switch (formula) {
      case 'ACTIVOS_TOTAL':
        return this.prisma.activo.count();
      case 'ACTIVOS_CON_RESPONSABLE_PORCENTAJE': {
        const [total, conResponsable] = await Promise.all([
          this.prisma.activo.count(),
          this.prisma.activo.count({ where: { responsableId: { not: null } } }),
        ]);
        return total ? Math.round((conResponsable / total) * 100) : 0;
      }
      case 'RIESGOS_ABIERTOS':
        return this.prisma.riesgo.count({ where: { estado: 'ABIERTO' } });
      case 'VULNERABILIDADES_ABIERTAS':
        return this.prisma.vulnerabilidad.count({
          where: { estado: 'ABIERTA' },
        });
      case 'VULNERABILIDADES_CRITICAS':
        return this.prisma.vulnerabilidad.count({
          where: { cvss: { gte: 9 } },
        });
      case 'INCIDENTES_ABIERTOS':
        return this.prisma.incidente.count({ where: { estado: 'ABIERTO' } });
      default:
        throw new BadRequestException(
          'La fórmula seleccionada no está disponible.',
        );
    }
  }
}
