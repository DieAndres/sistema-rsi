import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CATEGORIAS = [
  { numero: 5, nombre: 'Organizacionales', total: 37 },
  { numero: 6, nombre: 'Personas', total: 8 },
  { numero: 7, nombre: 'Físicos', total: 14 },
  { numero: 8, nombre: 'Tecnológicos', total: 34 },
] as const;
const FUNCIONES = [
  'Gobernar',
  'Identificar',
  'Proteger',
  'Detectar',
  'Responder',
  'Recuperar',
];

// Denominaciones orientativas propias; no reproducen el texto oficial de ISO/IEC 27001.
const TEMAS_CONTROLES: Record<number, string[]> = {
  5: [
    'Políticas de seguridad de la información',
    'Responsabilidades de seguridad',
    'Separación de funciones',
    'Responsabilidad de la dirección',
    'Contacto con autoridades',
    'Contacto con comunidades especializadas',
    'Información sobre amenazas',
    'Seguridad en proyectos',
    'Inventario de información y activos',
    'Uso aceptable de activos',
    'Devolución de activos',
    'Clasificación de la información',
    'Etiquetado de información',
    'Transferencia de información',
    'Reglas de control de acceso',
    'Gestión de identidades',
    'Protección de credenciales',
    'Gestión de permisos de acceso',
    'Seguridad en relaciones con proveedores',
    'Seguridad en acuerdos con proveedores',
    'Seguridad en la cadena de suministro TIC',
    'Revisión de servicios de proveedores',
    'Seguridad de servicios en la nube',
    'Preparación para gestionar incidentes',
    'Evaluación de eventos de seguridad',
    'Respuesta a incidentes',
    'Aprendizaje de incidentes',
    'Preservación de evidencias',
    'Seguridad durante interrupciones',
    'Continuidad de servicios TIC',
    'Obligaciones legales y contractuales',
    'Protección de propiedad intelectual',
    'Protección de registros',
    'Privacidad de datos personales',
    'Revisión independiente de seguridad',
    'Verificación de cumplimiento interno',
    'Procedimientos operativos documentados',
  ],
  6: [
    'Verificación previa del personal',
    'Condiciones de empleo sobre seguridad',
    'Formación y concientización en seguridad',
    'Proceso disciplinario',
    'Responsabilidades al cambiar o terminar el vínculo',
    'Acuerdos de confidencialidad',
    'Seguridad del trabajo remoto',
    'Reporte de eventos de seguridad',
  ],
  7: [
    'Perímetros físicos de seguridad',
    'Control de ingreso físico',
    'Seguridad de oficinas e instalaciones',
    'Vigilancia física',
    'Protección frente a riesgos ambientales',
    'Trabajo en áreas protegidas',
    'Escritorio y pantalla despejados',
    'Ubicación y protección de equipos',
    'Protección de activos fuera de las instalaciones',
    'Gestión de medios de almacenamiento',
    'Continuidad de servicios auxiliares',
    'Protección del cableado',
    'Mantenimiento de equipos',
    'Eliminación o reutilización segura de equipos',
  ],
  8: [
    'Protección de dispositivos de usuario',
    'Control de privilegios elevados',
    'Restricción de acceso a información',
    'Control de acceso al código fuente',
    'Autenticación segura',
    'Gestión de capacidad',
    'Protección contra programas maliciosos',
    'Gestión de vulnerabilidades técnicas',
    'Configuración segura de sistemas',
    'Eliminación de información',
    'Enmascaramiento de datos',
    'Prevención de fugas de información',
    'Respaldo de información',
    'Redundancia de servicios',
    'Registro de eventos',
    'Monitoreo de actividades',
    'Sincronización de relojes',
    'Uso controlado de herramientas privilegiadas',
    'Instalación controlada de software',
    'Seguridad de redes',
    'Seguridad de servicios de red',
    'Segmentación de redes',
    'Filtrado de navegación web',
    'Uso de criptografía y gestión de claves',
    'Seguridad en el ciclo de desarrollo',
    'Requisitos de seguridad de aplicaciones',
    'Diseño y arquitectura seguros',
    'Prácticas de programación segura',
    'Pruebas de seguridad antes de aceptación',
    'Seguridad del desarrollo tercerizado',
    'Separación de entornos',
    'Gestión de cambios técnicos',
    'Protección de datos de prueba',
    'Protección durante pruebas de auditoría',
  ],
};

function celda(valor: string | number | null | undefined): string {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '&#124;')
    .replace(/[\r\n]+/g, ' ');
}

function textoOpcional(valor: unknown, campo: string): string | null {
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== 'string' || valor.length > 1000) {
    throw new BadRequestException(
      `${campo} debe ser texto de hasta 1000 caracteres`,
    );
  }
  return valor.trim() || null;
}

export const CONTROLES_SOA = CATEGORIAS.flatMap(({ numero, total }) => {
  if (TEMAS_CONTROLES[numero].length !== total) {
    throw new Error(`Catálogo SoA incompleto para A.${numero}`);
  }
  return TEMAS_CONTROLES[numero].map((tema, indice) => ({
    controlId: `A.${numero}.${indice + 1}`,
    tema,
  }));
});

@Injectable()
export class SoaService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(organizacionId: string) {
    await this.exigirOrganizacion(organizacionId);
    const evaluaciones = await this.prisma.evaluacionSoa.findMany({
      where: { organizacionId },
    });
    const porControl = new Map(
      evaluaciones.map((item) => [item.controlId, item]),
    );
    return CONTROLES_SOA.map(({ controlId, tema }) => ({
      controlId,
      tema,
      evaluacion: porControl.get(controlId) ?? null,
    }));
  }

  async guardarEvaluacion(
    organizacionId: string,
    controlId: string,
    datos: Record<string, unknown>,
  ) {
    await this.exigirOrganizacion(organizacionId);
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      throw new BadRequestException('La evaluación debe ser un objeto');
    }
    if (!CONTROLES_SOA.some((control) => control.controlId === controlId)) {
      throw new BadRequestException('Control ISO no válido');
    }
    if (typeof datos.aplica !== 'boolean' && datos.aplica !== null) {
      throw new BadRequestException('aplica debe ser verdadero, falso o null');
    }
    const justificacion = textoOpcional(datos.justificacion, 'justificacion');
    if (datos.aplica !== null && !justificacion) {
      throw new BadRequestException('La justificación es obligatoria');
    }
    const titulo = textoOpcional(datos.titulo, 'titulo');
    const insumos = textoOpcional(datos.insumos, 'insumos');
    const estado = textoOpcional(datos.estado, 'estado');
    const evidenciaId = textoOpcional(datos.evidenciaId, 'evidenciaId');
    const planId = textoOpcional(datos.planId, 'planId');
    if (estado?.toUpperCase() === 'IMPLEMENTADO' && !evidenciaId) {
      throw new BadRequestException(
        'IMPLEMENTADO requiere evidencia vinculada',
      );
    }

    if (evidenciaId) {
      const evidencia = await this.prisma.evidencia.findFirst({
        where: { id: evidenciaId, organizacionId },
        select: { id: true },
      });
      if (!evidencia)
        throw new BadRequestException('Evidencia fuera de la organización');
    }
    if (planId) {
      const plan = await this.prisma.plan.findFirst({
        where: { id: planId, organizacionId },
        select: { id: true },
      });
      if (!plan) throw new BadRequestException('Plan fuera de la organización');
    }

    const evaluacion = {
      titulo,
      aplica: datos.aplica as boolean | null,
      justificacion,
      insumos,
      estado,
      evidenciaId,
      planId,
    };
    return this.prisma.evaluacionSoa.upsert({
      where: { organizacionId_controlId: { organizacionId, controlId } },
      create: { organizacionId, controlId, ...evaluacion },
      update: evaluacion,
    });
  }

  async guardarBrecha(
    organizacionId: string,
    funcion: string,
    datos: Record<string, unknown>,
  ) {
    await this.exigirOrganizacion(organizacionId);
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      throw new BadRequestException('La brecha debe ser un objeto');
    }
    if (!FUNCIONES.includes(funcion)) {
      throw new BadRequestException('Función MCU no válida');
    }
    if (
      datos.madurez !== null &&
      (!Number.isInteger(datos.madurez) ||
        (datos.madurez as number) < 0 ||
        (datos.madurez as number) > 4)
    ) {
      throw new BadRequestException(
        'madurez debe estar entre 0 y 4, o ser null',
      );
    }
    const perfilObjetivo = textoOpcional(
      datos.perfilObjetivo,
      'perfilObjetivo',
    );
    if (
      perfilObjetivo &&
      !['Básico', 'Estándar', 'Avanzado'].includes(perfilObjetivo)
    ) {
      throw new BadRequestException('perfilObjetivo no válido');
    }
    const brecha = {
      perfilObjetivo,
      evidencia: textoOpcional(datos.evidencia, 'evidencia'),
      madurez: datos.madurez as number | null,
      acciones: textoOpcional(datos.acciones, 'acciones'),
    };
    return this.prisma.brechaMcu.upsert({
      where: { organizacionId_funcion: { organizacionId, funcion } },
      create: { organizacionId, funcion, ...brecha },
      update: brecha,
    });
  }

  async exportar(organizacionId: string): Promise<string> {
    const organizacion = await this.exigirOrganizacion(organizacionId);
    const [evaluaciones, brechas, registros] = await Promise.all([
      this.prisma.evaluacionSoa.findMany({
        where: { organizacionId },
        include: {
          evidencia: true,
          plan: { include: { responsable: true, riesgo: true } },
        },
      }),
      this.prisma.brechaMcu.findMany({ where: { organizacionId } }),
      this.contarRegistrosOrganizacion(organizacionId),
    ]);
    const porControl = new Map(
      evaluaciones.map((item) => [item.controlId, item]),
    );
    const porFuncion = new Map(brechas.map((item) => [item.funcion, item]));
    const pendientes =
      CONTROLES_SOA.length -
      evaluaciones.filter((item) => item.aplica !== null && item.justificacion)
        .length;
    const sinEvidencia = evaluaciones.filter(
      (item) => item.aplica === true && !item.evidenciaId,
    ).length;
    const esEscenarioSimulado = /datos sintéticos para demostración/i.test(
      organizacion.alcanceSgsi ?? '',
    );

    const resumen = CATEGORIAS.map(({ numero, nombre, total }) => {
      const delGrupo = evaluaciones.filter((item) =>
        item.controlId.startsWith(`A.${numero}.`),
      );
      const aplicables = delGrupo.filter((item) => item.aplica === true).length;
      const noAplicables = delGrupo.filter(
        (item) => item.aplica === false && item.justificacion,
      ).length;
      return `| A.${numero} ${nombre} | ${total} | ${aplicables} | ${noAplicables} |`;
    });
    const filasControles = CONTROLES_SOA.map(({ controlId, tema }) => {
      const item = porControl.get(controlId);
      const aplica =
        item?.aplica === null || item?.aplica === undefined
          ? 'Pendiente'
          : item.aplica
            ? 'Sí'
            : 'No';
      const insumos = item?.insumos || 'Pendiente de describir';
      const evidencia =
        item?.aplica === false
          ? 'No requiere evidencia; revisar justificación de no aplicabilidad'
          : item?.evidencia?.nombre || 'Pendiente de asociar';
      const estado =
        item?.aplica === false
          ? item.estado || 'No aplica'
          : item?.estado || item?.plan?.nombre || 'Pendiente';
      return `| ${controlId} | ${celda(tema)} | ${aplica} | ${celda(item?.justificacion)} | ${celda(insumos)} | ${celda(evidencia)} | ${celda(estado)} |`;
    });
    const filasBrecha = FUNCIONES.map((funcion) => {
      const item = porFuncion.get(funcion);
      return `| ${funcion} | ${celda(item?.perfilObjetivo)} | ${celda(item?.evidencia)} | ${celda(item?.madurez)} | ${celda(item?.acciones)} |`;
    });
    const filasPlan = evaluaciones
      .filter((item) => item.plan)
      .map((item) => {
        const riesgo = item.plan!.riesgo;
        const puntajeRiesgo = riesgo
          ? `${riesgo.probabilidad} × ${riesgo.impacto} = ${riesgo.probabilidad * riesgo.impacto}/25`
          : 'Sin riesgo asociado';
        const riesgoControl = `${item.controlId} / ${riesgo?.nombre || 'sin riesgo vinculado'}`;
        const accion = `${item.plan!.descripcion || item.plan!.nombre} (${item.plan!.estado})`;
        return `| ${celda(item.plan!.id)} | ${celda(riesgoControl)} | ${celda(accion)} | ${celda(puntajeRiesgo)} | ${celda(item.plan!.responsable?.nombre)} | ${celda(item.plan!.fechaFin?.toISOString().slice(0, 10))} |`;
      });

    return [
      '# Declaración de Aplicabilidad (SoA) y Plan de Tratamiento',
      '',
      ...(esEscenarioSimulado
        ? [
            'Informe generado con datos de un escenario simulado.',
            'Las referencias con prefijo “SIMULACIÓN” son ficticias, no tienen archivos adjuntos y no acreditan implementación.',
          ]
        : []),
      '',
      'Código: SI-SOA-11',
      `Fecha: ${new Date().toISOString().slice(0, 10)}`,
      'Estado: en revisión; no acredita cumplimiento ISO.',
      'Los nombres de controles son denominaciones orientativas, no títulos oficiales de la norma.',
      '“Sí” indica aplicabilidad preliminar al alcance; no significa que el control esté implementado.',
      '',
      '## 1. Organización y registros disponibles',
      `Organización evaluada: ${celda(organizacion.nombre)}`,
      `Alcance declarado para esta evaluación: ${celda(organizacion.alcanceSgsi || 'Pendiente de definir')}`,
      'Los siguientes registros organizacionales son insumos para la revisión; su existencia no demuestra por sí sola que un control aplique o esté implementado.',
      '',
      '| Tipo de registro | Cantidad |',
      '|---|---:|',
      ...registros.map(({ nombre, cantidad }) => `| ${nombre} | ${cantidad} |`),
      '',
      '## 2. Resumen de estado',
      '| Categoría | Total controles | Aplicables | N/A (con justif.) |',
      '|---|---:|---:|---:|',
      ...resumen,
      `Controles con aplicabilidad pendiente: ${pendientes}.`,
      `Controles aplicables sin referencia de evidencia: ${sinEvidencia}.`,
      '',
      '## 3. Declaración de aplicabilidad',
      '| ID ISO 27001 | Tema del control (orientativo) | ¿Aplica? | Justificación para la organización | Insumos organizacionales | Evidencia vinculada | Plan de tratamiento / Estado |',
      '|---|---|---|---|---|---|---|',
      ...filasControles,
      '',
      '## 4. Análisis de brecha MCU 5.0',
      `| Función MCU 5.0 | Perfil objetivo | ${esEscenarioSimulado ? 'Referencia simulada (no verificada)' : 'Evidencia que lo cumple'} | Madurez actual (0-4) | Acciones |`,
      '|---|---|---|---|---|',
      ...filasBrecha,
      '',
      '## 5. Plan de tratamiento (resumen)',
      '| ID | Riesgo/Control | Acción | Puntaje de riesgo (P × I) | Responsable | Fecha límite |',
      '|---|---|---|---|---|---|',
      ...filasPlan,
      '',
    ].join('\n');
  }

  private async contarRegistrosOrganizacion(organizacionId: string) {
    const porActivo = {
      activo: { unidadOrganizativa: { organizacionId } },
    };
    const [
      unidades,
      trabajadores,
      activos,
      riesgos,
      vulnerabilidades,
      incidentes,
      politicas,
      procesos,
      procedimientos,
      planes,
      evidencias,
    ] = await Promise.all([
      this.prisma.unidadOrganizativa.count({ where: { organizacionId } }),
      this.prisma.trabajador.count({
        where: { unidadOrganizativa: { organizacionId } },
      }),
      this.prisma.activo.count({
        where: { unidadOrganizativa: { organizacionId } },
      }),
      this.prisma.riesgo.count({ where: porActivo }),
      this.prisma.vulnerabilidad.count({ where: porActivo }),
      this.prisma.incidente.count({ where: porActivo }),
      this.prisma.politica.count({ where: { organizacionId } }),
      this.prisma.proceso.count({ where: { organizacionId } }),
      this.prisma.procedimiento.count({ where: { organizacionId } }),
      this.prisma.plan.count({ where: { organizacionId } }),
      this.prisma.evidencia.count({ where: { organizacionId } }),
    ]);
    return [
      { nombre: 'Unidades organizativas', cantidad: unidades },
      { nombre: 'Trabajadores', cantidad: trabajadores },
      { nombre: 'Activos', cantidad: activos },
      { nombre: 'Riesgos', cantidad: riesgos },
      { nombre: 'Vulnerabilidades', cantidad: vulnerabilidades },
      { nombre: 'Incidentes', cantidad: incidentes },
      { nombre: 'Políticas', cantidad: politicas },
      { nombre: 'Procesos', cantidad: procesos },
      { nombre: 'Procedimientos', cantidad: procedimientos },
      { nombre: 'Planes', cantidad: planes },
      {
        nombre: 'Evidencias registradas (relevancia por revisar)',
        cantidad: evidencias,
      },
    ];
  }

  private async exigirOrganizacion(id: string) {
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id },
      select: { nombre: true, alcanceSgsi: true },
    });
    if (!organizacion)
      throw new NotFoundException('Organización no encontrada');
    return organizacion;
  }
}
