import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CONTROLES_MCU } from './controles-mcu';

function celda(valor: string | null | undefined) {
  return (valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/[\r\n]+/g, ' ');
}

@Injectable()
export class McuService {
  constructor(private readonly prisma: PrismaService) {}
  private async organizacion(id: string) {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id },
    });
    if (!organizacion)
      throw new NotFoundException('Organización no encontrada');
    return organizacion;
  }
  async listar(organizacionId: string) {
    await this.organizacion(organizacionId);
    const evaluaciones = await this.prisma.evaluacionMcu.findMany({
      where: { organizacionId },
    });
    return CONTROLES_MCU.map((control) => ({
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
    if (!CONTROLES_MCU.some((c) => c.controlId === controlId))
      throw new BadRequestException('Control MCU no válido');
    if (!datos || typeof datos !== 'object' || Array.isArray(datos))
      throw new BadRequestException('Evaluación no válida');
    if (
      datos.respuesta !== null &&
      !['SI', 'NO', 'NA'].includes(String(datos.respuesta))
    )
      throw new BadRequestException('Respuesta no válida');
    const campos: Record<string, string | null> = {};
    for (const campo of ['justificacion', 'evidencia', 'demostracion']) {
      const valor = datos[campo];
      if (valor != null && (typeof valor !== 'string' || valor.length > 10000))
        throw new BadRequestException(
          `${campo} debe ser texto de hasta 10000 caracteres`,
        );
      campos[campo] = typeof valor === 'string' ? valor.trim() || null : null;
    }
    if (datos.respuesta === 'NA' && !campos.justificacion)
      throw new BadRequestException('N.A. requiere justificación');
    if (datos.respuesta === 'SI' && (!campos.evidencia || !campos.demostracion))
      throw new BadRequestException(
        'Sí requiere evidencia y cómo se demuestra',
      );
    const evaluacion = {
      respuesta: datos.respuesta as string | null,
      justificacion: campos.justificacion,
      evidencia: campos.evidencia,
      demostracion: campos.demostracion,
    };
    return this.prisma.evaluacionMcu.upsert({
      where: { organizacionId_controlId: { organizacionId, controlId } },
      create: { organizacionId, controlId, ...evaluacion },
      update: evaluacion,
    });
  }
  async exportar(organizacionId: string) {
    const organizacion = await this.organizacion(organizacionId);
    const controles = await this.listar(organizacionId);
    const contenido = [
      '# MCU 5.0 — Reporte por funciones',
      `Organización: ${celda(organizacion.nombre)}`,
      'Perfil objetivo de la tarea: Avanzado',
      `Fecha: ${new Date().toISOString().slice(0, 10)}`,
      'Catálogo de apoyo del curso (47 controles). Los IDs son internos y no sustituyen los identificadores oficiales AGESIC. Las respuestas y referencias requieren revisión; una justificación N.A. registrada no implica aceptación.',
      '',
    ];
    for (const funcion of [
      'Gobernar',
      'Identificar',
      'Proteger',
      'Detectar',
      'Responder',
      'Recuperar',
    ]) {
      const grupo = controles.filter((c) => c.funcion === funcion);
      contenido.push(
        `## ${grupo[0].codigo} — ${funcion}`,
        `Controles: ${grupo.length}. Pendientes: ${grupo.filter((c) => !c.evaluacion?.respuesta).length}.`,
        '| ID interno | Resultado/Control esperado | Aplica (Sí/No/N.A.) | Justificación si N.A. | Evidencia registrada | Cómo se demuestra |',
        '|---|---|---|---|---|---|',
      );
      for (const c of grupo) {
        const e = c.evaluacion;
        const respuesta =
          e?.respuesta === 'SI'
            ? 'Sí'
            : e?.respuesta === 'NO'
              ? 'No'
              : e?.respuesta === 'NA'
                ? 'N.A.'
                : 'Pendiente';
        contenido.push(
          `| ${c.controlId} | ${celda(c.tema)} | ${respuesta} | ${celda(e?.justificacion)} | ${celda(e?.evidencia)} | ${celda(e?.demostracion)} |`,
        );
      }
      contenido.push('');
    }
    return contenido.join('\n');
  }
}
