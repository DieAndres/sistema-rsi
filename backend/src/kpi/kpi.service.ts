import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

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
}
