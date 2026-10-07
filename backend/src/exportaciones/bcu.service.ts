import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REQUERIMIENTOS_BCU } from './requerimientos-bcu';
function celda(valor: string | null | undefined) {
  return (valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/[\r\n]+/g, ' ');
}

@Injectable()
export class BcuService {
  constructor(private readonly prisma: PrismaService) {}

  private async organizacion(id: string) {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id },
    });
    if (!organizacion) {
      throw new NotFoundException('Organización no encontrada');
    }
    return organizacion;
  }

  async listar(organizacionId: string) {
    await this.organizacion(organizacionId);
    const evaluaciones = await this.prisma.evaluacionBcu.findMany({
      where: { organizacionId },
    });
    return REQUERIMIENTOS_BCU.map((control) => ({
      ...control,
      evaluacion:
        evaluaciones.find((e) => e.controlId === control.controlId) ?? null,
    }));
  }

  async guardar(
    organizacionId: string,
    controlId: string,
    datos: Record<string, unknown>,
  ) {
    await this.organizacion(organizacionId);
    if (!REQUERIMIENTOS_BCU.some((c) => c.controlId === controlId)) {
      throw new BadRequestException('Requerimiento BCU no válido');
    }
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      throw new BadRequestException('Evaluación no válida');
    }
    if (
      datos.respuesta !== null &&
      !['CUMPLE', 'PARCIAL', 'NO', 'NA'].includes(String(datos.respuesta))
    ) {
      throw new BadRequestException('Respuesta no válida');
    }
    const campos: Record<string, string | null> = {};
    for (const campo of ['justificacion', 'evidencia', 'demostracion']) {
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
    if (datos.respuesta !== null && !campos.justificacion) {
      throw new BadRequestException('La evaluación requiere justificación');
    }
    if (
      ['CUMPLE', 'PARCIAL'].includes(String(datos.respuesta)) &&
      !campos.evidencia
    ) {
      throw new BadRequestException('Cumple o parcial requiere evidencia');
    }
    const evaluacion = {
      respuesta: datos.respuesta as string | null,
      justificacion: campos.justificacion,
      evidencia: campos.evidencia,
      demostracion: campos.demostracion,
    };
    return this.prisma.evaluacionBcu.upsert({
      where: { organizacionId_controlId: { organizacionId, controlId } },
      create: { organizacionId, controlId, ...evaluacion },
      update: evaluacion,
    });
  }

  async exportar(organizacionId: string) {
    const organizacion = await this.organizacion(organizacionId);
    const controles = await this.listar(organizacionId);
    const contenido = [
      '# BCU (GSI) — Informe de requerimientos mínimos',
      `Organización: ${celda(organizacion.nombre)}`,
      `Fecha: ${new Date().toISOString().slice(0, 10)}`,
      'Estado: borrador para revisión. Basado en la síntesis de 18 requerimientos de la plantilla del curso; no sustituye la GSI oficial ni acredita cumplimiento regulatorio.',
      'La aplicabilidad a la entidad y el alcance deben ser revisados por el RSI. No se infiere cumplimiento por la existencia de registros en la aplicación.',
      '',
      '| ID interno | Requerimiento | Evaluación | Justificación / aplicabilidad | Evidencia registrada | Acción pendiente |',
      '|---|---|---|---|---|---|',
    ];
    for (const c of controles) {
      const e = c.evaluacion;
      const estado =
        e?.respuesta === 'CUMPLE'
          ? 'Cumple'
          : e?.respuesta === 'PARCIAL'
            ? 'Parcial'
            : e?.respuesta === 'NO'
              ? 'No cumple'
              : e?.respuesta === 'NA'
                ? 'No aplica'
                : 'Pendiente';
      contenido.push(
        `| ${c.controlId} | ${celda(c.tema)} | ${estado} | ${celda(e?.justificacion)} | ${celda(e?.evidencia)} | ${celda(e?.demostracion)} |`,
      );
    }
    return contenido.join('\n');
  }
}
