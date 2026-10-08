import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CONTROLES_MCU } from './controles-mcu';
import { CONTROLES_MCU_AGESIC } from './controles-mcu-agesic';

const FUNCIONES_MCU: Record<string, string> = {
  Gobernar: 'GV', Identificar: 'ID', Proteger: 'PR',
  Detectar: 'DE', Responder: 'RS', Recuperar: 'RC',
};
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
    if (!organizacion) {
      throw new NotFoundException('Organización no encontrada');
    }
    return organizacion;
  }

  async listar(organizacionId: string) {
    const organizacion = await this.organizacion(organizacionId);
    const evaluaciones = await this.prisma.evaluacionMcu.findMany({
      where: { organizacionId },
    });
    return CONTROLES_MCU_AGESIC.filter((control) => control.perfiles.includes(organizacion.perfilMcu)).map((control) => ({
      ...control,
      funcion: control.funciones[0],
      codigo: FUNCIONES_MCU[control.funciones[0]],
      evaluacion:
        evaluaciones.find((e) => e.controlId === control.controlId) ?? null,
    }));
  }

  async guardar(
    organizacionId: string,
    controlId: string,
    datos: Record<string, unknown>,
  ) {
    const organizacion = await this.organizacion(organizacionId);
    if (!CONTROLES_MCU_AGESIC.some((c) => c.controlId === controlId && c.perfiles.includes(organizacion.perfilMcu))) {
      throw new BadRequestException('Control MCU no válido para el perfil de la organización');
    }
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      throw new BadRequestException('Evaluación no válida');
    }
    if (
      datos.respuesta !== null &&
      !['SI', 'NO', 'NA'].includes(String(datos.respuesta))
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
    if (datos.respuesta === 'NA' && !campos.justificacion) {
      throw new BadRequestException('N.A. requiere justificación');
    }
    if (
      datos.respuesta === 'SI' &&
      (!campos.evidencia || !campos.demostracion)
    ) {
      throw new BadRequestException(
        'Sí requiere evidencia y cómo se demuestra',
      );
    }
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
      `Perfil objetivo de la organización: ${celda(organizacion.perfilMcu)}`,
      'Perfil requerido para la entrega del curso: Avanzado.',
      `Fecha: ${new Date().toISOString().slice(0, 10)}`,
      `Línea base AGESIC: ${controles.length} controles únicos marcados como Sí en la planilla del perfil ${celda(organizacion.perfilMcu)}.`,
      'Fuente: https://www.gub.uy/agencia-gobierno-electronico-sociedad-informacion-conocimiento/comunicacion/publicaciones/marco-ciberseguridad-50',
      'Un control puede estar asociado a varias funciones y aparecer en más de una sección. Las cantidades por función no deben sumarse para obtener el total único. Este reporte muestra la línea base, no todos los controles del marco ni una certificación de cumplimiento.',
      'Las respuestas y referencias requieren revisión; una justificación N.A. registrada no implica aceptación.',
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
      const grupo = controles.filter((c) => c.funciones.includes(funcion));
      contenido.push(
        `## ${FUNCIONES_MCU[funcion]} — ${funcion}`,
        `Controles: ${grupo.length}. Pendientes: ${grupo.filter((c) => !c.evaluacion?.respuesta).length}.`,
        '| ID AGESIC | Control esperado | Aplica (Sí/No/N.A.) | Justificación si N.A. | Evidencia registrada | Cómo se demuestra |',
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
    const anteriores = await this.prisma.evaluacionMcu.findMany({ where: { organizacionId } });
    const legado = anteriores.filter((e) => CONTROLES_MCU.some((c) => c.controlId === e.controlId));
    if (legado.length) {
      contenido.push('## Antecedentes del catálogo de apoyo del curso',
        'Evaluaciones conservadas de los controles internos anteriores. No se trasladan a controles oficiales ni se cuentan como evaluación de la línea base seleccionada.',
        '| ID interno | Control de apoyo | Respuesta | Justificación | Evidencia | Demostración |', '|---|---|---|---|---|---|');
      for (const e of legado) {
        const control = CONTROLES_MCU.find((c) => c.controlId === e.controlId);
        contenido.push(`| ${celda(e.controlId)} | ${celda(control?.tema)} | ${celda(e.respuesta)} | ${celda(e.justificacion)} | ${celda(e.evidencia)} | ${celda(e.demostracion)} |`);
      }
    }
    return contenido.join('\n');
  }
}
