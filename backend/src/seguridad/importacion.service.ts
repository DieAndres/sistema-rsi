import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeguridadService } from './seguridad.service';
import {
  columnasImportacion,
  leerCsv,
  type TipoImportacion,
} from './importacion-csv';
import type { UsuarioAutenticado } from '../auth/usuario-autenticado';
import type { CrearActivoDto } from './dto/activo/crear-activo.dto';
import type { CrearRiesgoDto } from './dto/riesgo/crear-riesgo.dto';
import type { CrearVulnerabilidadDto } from './dto/vulnerabilidad/crear-vulnerabilidad.dto';
import type { CrearIncidenteDto } from './dto/incidente/crear-incidente.dto';

export type DatosImportacion = { organizacionId: string; csv: string };
type Fila = { fila: number; datos: Record<string, string>; errores: string[] };

@Injectable()
export class ImportacionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly seguridad: SeguridadService,
  ) {}

  async validar(tipo: TipoImportacion, entrada: DatosImportacion) {
    if (
      !entrada ||
      typeof entrada.organizacionId !== 'string' ||
      !entrada.organizacionId.trim()
    ) {
      throw new BadRequestException('Seleccioná una organización.');
    }
    const tabla = leerCsv(entrada.csv);
    const encabezados = tabla[0];
    const permitidos: readonly string[] = columnasImportacion[tipo];
    if (
      new Set(encabezados).size !== encabezados.length ||
      encabezados.some((c) => !permitidos.includes(c))
    ) {
      throw new BadRequestException(
        'Encabezados repetidos o desconocidos. Usá la plantilla de esta sección.',
      );
    }
    const requeridos =
      tipo === 'activos'
        ? ['unidadOrganizativaId', 'nombre', 'tipo', 'clasificacion']
        : tipo === 'riesgos'
          ? ['activoId', 'nombre', 'probabilidad', 'impacto']
          : tipo === 'incidentes'
            ? ['activoId', 'titulo', 'severidad']
            : ['activoId', 'nombre'];
    if (requeridos.some((c) => !encabezados.includes(c)))
      throw new BadRequestException(
        `Columnas obligatorias: ${requeridos.join(', ')}.`,
      );
    const organizacion = await this.prisma.organizacion.findUnique({
      where: { id: entrada.organizacionId },
      select: { id: true },
    });
    if (!organizacion)
      throw new BadRequestException('La organización no existe.');
    const [unidades, activos, trabajadores] = await Promise.all([
      this.prisma.unidadOrganizativa.findMany({
        where: { organizacionId: entrada.organizacionId },
        select: { id: true },
      }),
      this.prisma.activo.findMany({
        where: {
          unidadOrganizativa: { organizacionId: entrada.organizacionId },
        },
        select: { id: true, nombre: true, unidadOrganizativaId: true },
      }),
      this.prisma.trabajador.findMany({
        where: {
          unidadOrganizativa: { organizacionId: entrada.organizacionId },
        },
        select: { id: true, unidadOrganizativaId: true },
      }),
    ]);
    const existentes =
      tipo === 'activos'
        ? activos.map((a) => ({
            referencia: a.unidadOrganizativaId,
            nombre: a.nombre,
          }))
        : tipo === 'riesgos'
          ? (
              await this.prisma.riesgo.findMany({
                where: { activoId: { in: activos.map((a) => a.id) } },
                select: { activoId: true, nombre: true },
              })
            ).map((r) => ({ referencia: r.activoId, nombre: r.nombre }))
          : tipo === 'vulnerabilidades'
            ? (
                await this.prisma.vulnerabilidad.findMany({
                  where: { activoId: { in: activos.map((a) => a.id) } },
                  select: { activoId: true, nombre: true },
                })
              ).map((v) => ({ referencia: v.activoId, nombre: v.nombre }))
            : (
                await this.prisma.incidente.findMany({
                  where: { activoId: { in: activos.map((a) => a.id) } },
                  select: { activoId: true, titulo: true },
                })
              ).map((i) => ({ referencia: i.activoId, nombre: i.titulo }));
    const clave = (referencia: string, nombre: string) =>
      JSON.stringify([referencia, nombre.toLocaleLowerCase()]);
    const vistos = new Set(
      existentes.map((e) => clave(e.referencia, e.nombre)),
    );
    const filas: Fila[] = tabla.slice(1).map((celdas, indice) => {
      const datos = Object.fromEntries(
        encabezados.map((c, i) => [c, celdas[i] ?? '']),
      );
      const errores: string[] = [];
      if (celdas.length !== encabezados.length)
        errores.push('Cantidad de columnas incorrecta.');
      for (const campo of requeridos)
        if (!datos[campo]) errores.push(`${campo} es obligatorio.`);
      for (const [campo, valor] of Object.entries(datos))
        if (valor.length > (campo === 'accionRealizada' ? 2000 : 4000))
          errores.push(`${campo}: texto demasiado largo.`);
      const unidadId =
        tipo === 'activos'
          ? datos.unidadOrganizativaId
          : activos.find((a) => a.id === datos.activoId)?.unidadOrganizativaId;
      if (tipo === 'activos' && !unidades.some((u) => u.id === unidadId))
        errores.push('La unidad no pertenece a la organización seleccionada.');
      if (tipo !== 'activos' && !unidadId)
        errores.push('El activo no pertenece a la organización seleccionada.');
      if (datos.responsableId) {
        const responsable = trabajadores.find(
          (t) => t.id === datos.responsableId,
        );
        if (!responsable)
          errores.push(
            'El responsable no pertenece a la organización seleccionada.',
          );
        else if (
          tipo === 'activos' &&
          responsable.unidadOrganizativaId !== unidadId
        )
          errores.push(
            'El responsable debe pertenecer a la unidad del activo.',
          );
      }
      const enumCampo = (
        campo: string,
        valores: string[],
        obligatorio = false,
      ) => {
        if (!datos[campo] && !obligatorio) return;
        datos[campo] = (datos[campo] ?? '').toUpperCase();
        if (!valores.includes(datos[campo]))
          errores.push(`${campo}: valores permitidos ${valores.join(', ')}.`);
      };
      const numero = (
        campo: string,
        min: number,
        max: number,
        entero = false,
      ) => {
        if (!datos[campo]) return;
        const valor = Number(datos[campo]);
        if (
          !Number.isFinite(valor) ||
          valor < min ||
          valor > max ||
          (entero && !Number.isInteger(valor))
        )
          errores.push(
            `${campo}: ${entero ? 'entero' : 'número'} entre ${min} y ${max}.`,
          );
      };
      if (tipo === 'activos') {
        enumCampo('tipo', ['HW', 'SW', 'DATO', 'SERVICIO'], true);
        enumCampo(
          'clasificacion',
          ['PUBLICO', 'INTERNO', 'CONFIDENCIAL', 'SECRETO'],
          true,
        );
        datos.criticidad ||= 'MEDIA';
        enumCampo('criticidad', ['BAJA', 'MEDIA', 'ALTA', 'CRITICA']);
      } else if (tipo === 'riesgos') {
        numero('probabilidad', 1, 5, true);
        numero('impacto', 1, 5, true);
        enumCampo('tratamiento', [
          'MITIGAR',
          'TRANSFERIR',
          'EVITAR',
          'ACEPTAR',
        ]);
        if (
          datos.aceptado &&
          !['true', 'false'].includes(datos.aceptado.toLowerCase())
        )
          errores.push('aceptado debe ser true o false.');
        datos.aceptado = datos.aceptado?.toLowerCase() || 'false';
      } else if (tipo === 'vulnerabilidades') {
        numero('cvss', 0, 10);
        numero('sla', 0, 2147483647, true);
      } else enumCampo('severidad', ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'], true);
      const identidad = clave(
        tipo === 'activos' ? datos.unidadOrganizativaId : datos.activoId,
        tipo === 'incidentes' ? datos.titulo : datos.nombre,
      );
      if (vistos.has(identidad))
        errores.push(
          'Registro duplicado: mismo nombre o título en la misma unidad o activo.',
        );
      vistos.add(identidad);
      return { fila: indice + 2, datos, errores };
    });
    return {
      filas,
      total: filas.length,
      validos: filas.filter((f) => !f.errores.length).length,
    };
  }

  async importar(
    tipo: TipoImportacion,
    entrada: DatosImportacion,
    usuario: UsuarioAutenticado,
  ) {
    const resultado = await this.validar(tipo, entrada);
    if (resultado.validos !== resultado.total)
      throw new BadRequestException(
        'El archivo contiene errores. Validalo nuevamente antes de importar.',
      );
    // AuditoriaInterceptor mantiene todo el lote y sus eventos en la misma transacción.
    const registros: unknown[] = [];
    for (const fila of resultado.filas) {
      const datos: Record<string, unknown> = Object.fromEntries(
        Object.entries(fila.datos).filter(([, v]) => v !== ''),
      );
      for (const campo of ['probabilidad', 'impacto', 'cvss', 'sla'])
        if (datos[campo] !== undefined) datos[campo] = Number(datos[campo]);
      if (tipo === 'riesgos') datos.aceptado = datos.aceptado === 'true';
      try {
        if (tipo === 'activos')
          registros.push(
            await this.seguridad.crearActivo(
              fila.datos.unidadOrganizativaId,
              datos as unknown as CrearActivoDto,
            ),
          );
        else if (tipo === 'riesgos')
          registros.push(
            await this.seguridad.crearRiesgo(
              datos as unknown as CrearRiesgoDto,
            ),
          );
        else if (tipo === 'vulnerabilidades')
          registros.push(
            await this.seguridad.crearVulnerabilidad(
              datos as unknown as CrearVulnerabilidadDto,
            ),
          );
        else
          registros.push(
            await this.seguridad.crearIncidente(
              datos as unknown as CrearIncidenteDto,
              usuario,
            ),
          );
      } catch (error) {
        if (error instanceof BadRequestException)
          throw new BadRequestException(`Fila ${fila.fila}: ${error.message}`);
        throw error;
      }
    }
    return registros;
  }
}
