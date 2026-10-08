import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CAMPOS_BASE, CAMPOS_BRECHA, type CampoUrcdp } from './urcdp-campos';

function texto(valor: string) {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/[\r\n]+/g, ' ');
}
function campos(valor: unknown, definiciones: CampoUrcdp[]) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor))
    throw new BadRequestException('La ficha debe ser un objeto');
  const datos: Record<string, string> = {};
  for (const [clave, contenido] of Object.entries(valor)) {
    const campo = definiciones.find((c) => c.id === clave);
    if (!campo || typeof contenido !== 'string' || contenido.length > 10000)
      throw new BadRequestException(
        'Campo de ficha no válido o demasiado extenso',
      );
    const limpio = contenido.trim();
    if (
      limpio &&
      campo.tipo === 'number' &&
      (!/^\d+$/.test(limpio) || !Number.isSafeInteger(Number(limpio)))
    )
      throw new BadRequestException(
        `${campo.etiqueta}: ingresar un entero no negativo`,
      );
    if (
      limpio &&
      campo.tipo === 'email' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)
    )
      throw new BadRequestException('Correo no válido');
    if (
      limpio &&
      campo.tipo === 'datetime-local' &&
      (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(limpio) ||
        !Number.isFinite(Date.parse(limpio)) ||
        new Date(limpio).toISOString() !== limpio)
    )
      throw new BadRequestException(
        'Fecha no válida: debe incluir hora y zona UTC',
      );
    datos[clave] = limpio;
  }
  return datos;
}
function tabla(datos: Record<string, string>, definiciones: CampoUrcdp[]) {
  return [
    '| Campo | Información declarada |',
    '|---|---|',
    ...definiciones.map(
      (c) =>
        `| ${texto(c.tipo === 'datetime-local' ? c.etiqueta.replace('hora local', 'UTC') : c.etiqueta)} | ${texto(datos[c.id] || (c.opcional ? 'No informado / no corresponde' : 'PENDIENTE DE COMPLETAR'))} |`,
    ),
  ];
}

@Injectable()
export class UrcdpService {
  constructor(private readonly prisma: PrismaService) {}

  private async organizacion(id: string) {
    const org = await this.prisma.organizacion.findUnique({ where: { id } });
    if (!org) throw new NotFoundException('Organización no encontrada');
    return org;
  }

  async listar(id: string) {
    await this.organizacion(id);
    const [bases, brechas, incidentes] = await Promise.all([
      this.prisma.basePersonal.findMany({
        where: { organizacionId: id },
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.notificacionUrcdp.findMany({
        where: { organizacionId: id },
        orderBy: { actualizadoEn: 'desc' },
        include: {
          base: { select: { nombre: true } },
          incidente: { select: { titulo: true } },
        },
      }),
      this.prisma.incidente.findMany({
        where: { activo: { unidadOrganizativa: { organizacionId: id } } },
        select: { id: true, titulo: true },
        orderBy: { titulo: 'asc' },
      }),
    ]);
    return {
      bases,
      brechas,
      incidentes,
      camposBase: CAMPOS_BASE,
      camposBrecha: CAMPOS_BRECHA,
    };
  }

  async guardarBase(
    orgId: string,
    cuerpo: Record<string, unknown>,
    id?: string,
  ) {
    await this.organizacion(orgId);
    if (
      !cuerpo ||
      typeof cuerpo !== 'object' ||
      Array.isArray(cuerpo) ||
      typeof cuerpo.nombre !== 'string' ||
      !cuerpo.nombre.trim() ||
      cuerpo.nombre.length > 200
    )
      throw new BadRequestException(
        'Nombre de base obligatorio, hasta 200 caracteres',
      );
    if (
      id &&
      !(await this.prisma.basePersonal.findFirst({
        where: { id, organizacionId: orgId },
      }))
    )
      throw new NotFoundException('Base no encontrada en la organización');
    const datos = {
      nombre: cuerpo.nombre.trim(),
      datos: campos(cuerpo.datos, CAMPOS_BASE),
    };
    return id
      ? this.prisma.basePersonal.update({
          where: { id },
          data: { ...datos, revision: { increment: 1 } },
        })
      : this.prisma.basePersonal.create({
          data: { organizacionId: orgId, ...datos },
        });
  }

  async guardarBrecha(
    orgId: string,
    cuerpo: Record<string, unknown>,
    id?: string,
  ) {
    await this.organizacion(orgId);
    if (
      !cuerpo ||
      typeof cuerpo !== 'object' ||
      Array.isArray(cuerpo) ||
      typeof cuerpo.baseId !== 'string' ||
      typeof cuerpo.incidenteId !== 'string'
    )
      throw new BadRequestException('Elegí una base y un incidente');
    if (
      id &&
      !(await this.prisma.notificacionUrcdp.findFirst({
        where: { id, organizacionId: orgId },
      }))
    )
      throw new NotFoundException(
        'Notificación no encontrada en la organización',
      );
    const base = await this.prisma.basePersonal.findFirst({
      where: { id: cuerpo.baseId, organizacionId: orgId },
    });
    const incidente = await this.prisma.incidente.findFirst({
      where: {
        id: cuerpo.incidenteId,
        activo: { unidadOrganizativa: { organizacionId: orgId } },
      },
    });
    if (!base || !incidente)
      throw new BadRequestException(
        'La base y el incidente deben pertenecer a la organización',
      );
    const datos = campos(cuerpo.datos, CAMPOS_BRECHA);
    if (datos.conocimiento && Date.parse(datos.conocimiento) > Date.now())
      throw new BadRequestException(
        'La fecha de conocimiento no puede ser futura',
      );
    for (const campo of ['envio', 'resolucion']) {
      if (datos[campo] && Date.parse(datos[campo]) > Date.now())
        throw new BadRequestException(
          'Una fecha de presentación o resolución realizada no puede ser futura',
        );
      if (
        datos[campo] &&
        datos.conocimiento &&
        Date.parse(datos[campo]) < Date.parse(datos.conocimiento)
      )
        throw new BadRequestException(
          'La presentación o resolución no puede ser anterior al conocimiento',
        );
    }
    if (datos.envio && !datos.constancia)
      throw new BadRequestException(
        'La presentación requiere canal y referencia de constancia',
      );
    if (
      datos.envio &&
      datos.conocimiento &&
      Date.parse(datos.envio) - Date.parse(datos.conocimiento) > 72 * 3600000 &&
      !datos.demora
    )
      throw new BadRequestException(
        'Completá los motivos de presentación tardía',
      );
    const ficha = { baseId: base.id, incidenteId: incidente.id, datos };
    return id
      ? this.prisma.notificacionUrcdp.update({
          where: { id },
          data: { ...ficha, revision: { increment: 1 } },
        })
      : this.prisma.notificacionUrcdp.create({
          data: { organizacionId: orgId, ...ficha },
        });
  }

  async exportar(
    orgId: string,
    tipo: string,
    fichaId: string,
    etapa = 'inicial',
  ) {
    const org = await this.organizacion(orgId);
    if (typeof fichaId !== 'string' || !fichaId.trim())
      throw new BadRequestException('Elegí una ficha para exportar');
    if (
      !['registro', 'medidas', 'brecha'].includes(tipo) ||
      !['inicial', 'final'].includes(etapa)
    )
      throw new BadRequestException('Documento no válido');
    const cabecera = [
      `# URCDP — ${tipo === 'registro' ? 'Registro de base de datos personales' : tipo === 'medidas' ? 'Informe de medidas de seguridad' : etapa === 'final' ? 'Informe posterior de vulneración de seguridad' : 'Comunicación inicial de vulneración de seguridad'}`,
      `Organización: ${texto(org.nombre)}`,
      `Generado: ${new Date().toISOString()}`,
      'BORRADOR PARA REVISIÓN. Los campos pendientes requieren completar. No es un formulario oficial validado, una certificación ni una constancia de presentación. La descarga no envía información a la URCDP.',
      'Fuente de registro: https://www.gub.uy/tramites/inscripcion-bases-datos-personales',
      'Fuente de brechas: https://www.gub.uy/unidad-reguladora-control-datos-personales/comunicacion/publicaciones/guia-para-gestion-documentacion-comunicacion-vulneraciones-seguridad',
      '',
    ];
    if (tipo !== 'brecha') {
      const base = await this.prisma.basePersonal.findFirst({
        where: { id: fichaId, organizacionId: orgId },
      });
      if (!base)
        throw new NotFoundException('Base no encontrada en la organización');
      const datos = base.datos as Record<string, string>;
      cabecera.push(
        `Base: ${texto(base.nombre)}`,
        `Revisión: ${base.revision}. Actualizada: ${base.actualizadoEn.toISOString()}`,
        'Las medidas describen lo declarado por la organización; no se deduce su implementación a partir de las funcionalidades del sistema.',
      );
      const seleccion = CAMPOS_BASE.filter(
        (c) =>
          tipo === 'registro' ||
          c.grupo === 'Responsables' ||
          c.grupo === 'Medidas de seguridad' ||
          ['ubicacion', 'soporte', 'datosPersonales', 'finalidad'].includes(
            c.id,
          ),
      );
      for (const grupo of [...new Set(seleccion.map((c) => c.grupo))])
        cabecera.push(
          `## ${grupo}`,
          ...tabla(
            datos,
            seleccion.filter((c) => c.grupo === grupo),
          ),
          '',
        );
    } else {
      const ficha = await this.prisma.notificacionUrcdp.findFirst({
        where: { id: fichaId, organizacionId: orgId },
        include: {
          base: true,
          incidente: {
            include: {
              activo: true,
              historial: { orderBy: { fecha: 'asc' } },
              evidencias: {
                where: { organizacionId: orgId },
                select: { nombre: true, descripcion: true },
              },
            },
          },
        },
      });
      if (!ficha)
        throw new NotFoundException(
          'Notificación no encontrada en la organización',
        );
      const datos = ficha.datos as Record<string, string>;
      cabecera.push(
        `Revisión: ${ficha.revision}. Actualizada: ${ficha.actualizadoEn.toISOString()}`,
        `Base: ${texto(ficha.base.nombre)}`,
        '## Identificación de la base y responsables',
        ...tabla(
          ficha.base.datos as Record<string, string>,
          CAMPOS_BASE.filter(
            (c) =>
              c.grupo === 'Responsables' ||
              [
                'ubicacion',
                'inscripcion',
                'cantidad',
                'datosPersonales',
                'titulares',
              ].includes(c.id),
          ),
        ),
        '## Incidente vinculado',
        `Referencia: ${texto(ficha.incidente.id)}`,
        `Título: ${texto(ficha.incidente.titulo)}`,
        `Descripción: ${texto(ficha.incidente.descripcion ?? 'Pendiente')}`,
        `Activo: ${texto(ficha.incidente.activo.nombre)}. Estado registrado: ${texto(ficha.incidente.estado)}`,
      );
      if (datos.conocimiento) {
        const limite = new Date(Date.parse(datos.conocimiento) + 72 * 3600000);
        const referencia = datos.envio ? Date.parse(datos.envio) : Date.now();
        cabecera.push(
          `Límite orientativo de 72 horas: ${limite.toISOString()} (UTC).`,
          `${datos.envio ? 'Presentación declarada' : 'Sin presentación declarada'}: ${referencia > limite.getTime() ? 'plazo superado' : 'dentro del plazo de referencia'}.`,
        );
      } else
        cabecera.push(
          'Plazo de 72 horas: PENDIENTE; falta fecha de conocimiento por el responsable.',
        );
      cabecera.push(
        'Referencia normativa: Decreto 64/020, artículos 3 y 4. El cálculo usa la fecha de conocimiento declarada, no la creación del registro. Revisar las obligaciones y comunicaciones aplicables.',
      );
      const seleccion = CAMPOS_BRECHA.filter(
        (c) => etapa === 'final' || c.grupo !== 'Informe posterior',
      );
      for (const grupo of [...new Set(seleccion.map((c) => c.grupo))])
        cabecera.push(
          `## ${grupo}`,
          ...tabla(
            datos,
            seleccion.filter((c) => c.grupo === grupo),
          ),
          '',
        );
      cabecera.push(
        '## Acciones registradas',
        '| Fecha UTC | Estado | Acción |',
        '|---|---|---|',
        ...ficha.incidente.historial.map(
          (a) =>
            `| ${a.fecha.toISOString()} | ${texto(a.estado)} | ${texto(a.descripcion)} |`,
        ),
      );
      if (!ficha.incidente.historial.length)
        cabecera.push('Sin acciones registradas.');
      cabecera.push(
        '## Referencias de evidencia',
        ...ficha.incidente.evidencias.map(
          (e) =>
            `${texto(e.nombre)}: ${texto(e.descripcion ?? 'Sin descripción')}`,
        ),
      );
      if (!ficha.incidente.evidencias.length)
        cabecera.push('Sin evidencias vinculadas.');
      if (etapa === 'final')
        cabecera.push(
          '## Lecciones registradas',
          texto(ficha.incidente.leccionesAprendidas ?? 'Pendiente'),
        );
    }
    return cabecera.join('\n');
  }
}
