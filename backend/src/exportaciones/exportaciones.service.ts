import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function celda(valor: string | null | undefined): string {
  return (valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/[\r\n]+/g, ' ');
}

@Injectable()
export class ExportacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async inventarioActivos(organizacionId: string): Promise<string> {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
      select: { nombre: true },
    });
    if (!organizacion) throw new NotFoundException('Organización no encontrada');

    const activos = await this.prisma.activo.findMany({
      where: { unidadOrganizativa: { organizacionId } },
      include: { responsable: true },
      orderBy: [{ nombre: 'asc' }, { id: 'asc' }],
    });

    const filas = activos.map((activo) =>
      [
        activo.id,
        activo.nombre,
        activo.tipo,
        '',
        activo.responsable?.nombre ?? '',
        activo.clasificacion ?? '',
        ['ALTA', 'CRITICA'].includes(activo.criticidad) ? 'S' : 'N',
        '',
      ]
        .map(celda)
        .join(' | '),
    );

    return [
      '# Inventario y clasificación de activos de información',
      '',
      `Organización: ${celda(organizacion.nombre)}`,
      'Código: SI-ACT-02',
      `Fecha de generación: ${new Date().toISOString().slice(0, 10)}`,
      'Estado: borrador; requiere revisión antes de presentarse como inventario completo.',
      '',
      '## Inventario de activos',
      '',
      '| ID | Nombre del activo | Tipo (HW/SW/Dato/Servicio) | Ubicación | Dueño | Clasificación | Crítico (S/N) | Software/versión |',
      '|---|---|---|---|---|---|---|---|',
      ...filas.map((fila) => `| ${fila} |`),
      '',
      `Activos registrados: ${activos.length}. Los campos vacíos no están disponibles en los registros de origen.`,
      'Crítico = S cuando la criticidad registrada es ALTA o CRITICA; en otro caso, N.',
      '',
      '## Matriz crítica (pendiente)',
      '',
      'No se genera: faltan las relaciones proceso-activo y el RTO en los registros de origen.',
      '',
    ].join('\n');
  }
}
