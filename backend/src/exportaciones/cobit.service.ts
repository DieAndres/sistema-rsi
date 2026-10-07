import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AREAS_COBIT } from './objetivos-cobit';
function celda(valor?: string | null) {
  return (valor?.trim() || 'Pendiente')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/[\r\n]+/g, ' ');
}

@Injectable()
export class CobitService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(organizacionId: string) {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
    });
    if (!organizacion) {
      throw new NotFoundException('Organización no encontrada');
    }
    const procesos = await this.prisma.proceso.findMany({
      where: { organizacionId },
      include: { responsable: true },
      orderBy: { nombre: 'asc' },
    });
    const evaluaciones = await this.prisma.evaluacionCobit.findMany({
      where: { organizacionId },
      orderBy: [{ procesoId: 'asc' }, { controlId: 'asc' }],
    });
    return { organizacion, areas: AREAS_COBIT, procesos, evaluaciones };
  }

  async guardar(
    organizacionId: string,
    controlId: string,
    datos: Record<string, unknown>,
  ) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      throw new BadRequestException('Datos no válidos');
    }
    if (!AREAS_COBIT.includes(controlId)) {
      throw new BadRequestException('Área COBIT no válida');
    }
    if (typeof datos.procesoId !== 'string') {
      throw new BadRequestException('Seleccioná un proceso');
    }
    const procesoId = datos.procesoId;
    const proceso = await this.prisma.proceso.findFirst({
      where: { id: procesoId, organizacionId },
    });
    if (!proceso) {
      throw new BadRequestException(
        'El proceso no pertenece a esta organización',
      );
    }
    const campos: Record<string, string | null> = {};
    for (const campo of ['evaluacion', 'evidencia', 'indicador']) {
      const valor = datos[campo];
      if (
        valor != null &&
        (typeof valor !== 'string' || valor.length > 10000)
      ) {
        throw new BadRequestException(
          `${campo} debe ser texto de hasta 10000 caracteres`,
        );
      }
      campos[campo] = typeof valor === 'string' ? valor.trim() || null : null;
    }
    const evaluacion = {
      evaluacion: campos.evaluacion,
      evidencia: campos.evidencia,
      indicador: campos.indicador,
    };
    return this.prisma.evaluacionCobit.upsert({
      where: {
        organizacionId_procesoId_controlId: {
          organizacionId,
          procesoId,
          controlId,
        },
      },
      create: { organizacionId, procesoId, controlId, ...evaluacion },
      update: evaluacion,
    });
  }

  async exportar(organizacionId: string) {
    const datos = await this.listar(organizacionId);
    const contenido = [
      '# COBIT 2019 — Alineación y evaluación de procesos',
      `Organización: ${celda(datos.organizacion.nombre)}`,
      'Borrador basado en las relaciones seleccionadas por el RSI. Plantilla del proyecto con selección manual de áreas COBIT. No constituye una evaluación formal de capacidad o madurez COBIT.',
      'Alcance formal de la evaluación: pendiente de definición.',
      '',
      '| Área COBIT | Proceso | Responsable | Evaluación registrada | Evidencia | Indicador / resultado |',
      '|---|---|---|---|---|---|',
    ];
    for (const e of datos.evaluaciones) {
      const area = AREAS_COBIT.includes(e.controlId)
        ? e.controlId
        : `${e.controlId.replace(/\d+$/, '')} (registro anterior: ${e.controlId})`;
      const proceso = datos.procesos.find((p) => p.id === e.procesoId);
      contenido.push(
        `| ${celda(area)} | ${celda(proceso?.nombre)} | ${celda(proceso?.responsable?.nombre)} | ${celda(e.evaluacion)} | ${celda(e.evidencia)} | ${celda(e.indicador)} |`,
      );
    }
    if (!datos.evaluaciones.length) {
      contenido.push(
        'Todavía no hay relaciones COBIT registradas. Completá la evaluación para seleccionar un proceso y su área COBIT.',
      );
    }
    const pendientes = datos.procesos.filter(
      (p) => !datos.evaluaciones.some((e) => e.procesoId === p.id),
    );
    if (pendientes.length) {
      contenido.push(
        '',
        '## Procesos sin área COBIT vinculada',
        ...pendientes.map((p) => celda(p.nombre)),
      );
    }
    return contenido.join('\n');
  }
}
