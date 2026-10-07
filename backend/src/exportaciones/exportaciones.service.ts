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

  async politicaSeguridad(organizacionId: string): Promise<string> {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
      select: { nombre: true },
    });
    if (!organizacion) {
      throw new NotFoundException('Organización no encontrada');
    }
    const politicas = await this.prisma.politica.findMany({
      where: { organizacionId },
      include: { responsable: true },
      orderBy: [{ titulo: 'asc' }, { id: 'asc' }],
    });
    const documentos = politicas.flatMap((politica) => [
      `## ${celda(politica.titulo)}`,
      '| Campo | Valor |',
      '|---|---|',
      `| ID | ${celda(politica.id)} |`,
      `| Versión | ${celda(politica.version)} |`,
      `| Estado registrado | ${celda(politica.estado)} |`,
      `| Responsable | ${celda(politica.responsable?.nombre || 'Pendiente de asignar')} |`,
      `| Próxima revisión | ${politica.fechaRevision?.toISOString().slice(0, 10) || 'Pendiente de definir'} |`,
      '',
      '### Contenido registrado',
      ...(politica.descripcion
        ? politica.descripcion.split(/\r?\n/).map(celda)
        : ['Pendiente de redactar.']),
      '',
    ]);
    return [
      '# Política de Seguridad de la Información',
      `Organización: ${celda(organizacion.nombre)}`,
      'Código de plantilla: SI-POL-01',
      `Fecha de generación: ${new Date().toISOString().slice(0, 10)}`,
      'Documento en revisión. El estado registrado no sustituye la aprobación formal ni las firmas.',
      '',
      ...(documentos.length
        ? documentos
        : ['No hay políticas registradas para esta organización.', '']),
    ].join('\n');
  }

  async inventarioActivos(organizacionId: string): Promise<string> {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: organizacionId },
      select: { nombre: true },
    });
    if (!organizacion) {
      throw new NotFoundException('Organización no encontrada');
    }
    const activos = await this.prisma.activo.findMany({
      where: { unidadOrganizativa: { organizacionId } },
      include: { responsable: true, procesos: true },
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
    const procesos = await this.prisma.proceso.findMany({
      where: { organizacionId },
      include: { activos: true },
      orderBy: { nombre: 'asc' },
    });
    const filasMatriz = procesos.flatMap((proceso) =>
      proceso.activos.map(
        (activo) =>
          `| ${celda(proceso.nombre)} | ${celda(activo.nombre)} | ${celda(activo.criticidad)} |`,
      ),
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
      '## Matriz crítica',
      '',
      '| Proceso | Activo que lo soporta | Criticidad |',
      '|---|---|---|',
      ...(filasMatriz.length
        ? filasMatriz
        : ['| Sin relaciones proceso-activo registradas |  |  |']),
      '',
    ].join('\n');
  }
}
