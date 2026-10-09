import { BadRequestException } from '@nestjs/common';

export const columnasImportacion = {
  activos: [
    'unidadOrganizativaId',
    'nombre',
    'tipo',
    'clasificacion',
    'criticidad',
    'descripcion',
    'responsableId',
  ],
  vulnerabilidades: [
    'activoId',
    'nombre',
    'descripcion',
    'cvss',
    'sla',
    'planRemediacion',
    'responsableId',
  ],
  riesgos: [
    'activoId',
    'nombre',
    'probabilidad',
    'impacto',
    'tratamiento',
    'riesgoResidual',
    'aceptado',
    'descripcion',
    'responsableId',
  ],
  incidentes: [
    'activoId',
    'titulo',
    'severidad',
    'descripcion',
    'accionRealizada',
    'responsableId',
  ],
} as const;
export type TipoImportacion = keyof typeof columnasImportacion;
export function tipoImportacion(valor: string): TipoImportacion {
  if (!Object.hasOwn(columnasImportacion, valor))
    throw new BadRequestException('Sección inválida.');
  return valor as TipoImportacion;
}

// CSV con comillas, saltos de línea en celdas y separador de Excel (coma o punto y coma).
export function leerCsv(csv: unknown): string[][] {
  if (typeof csv !== 'string' || Buffer.byteLength(csv, 'utf8') > 64 * 1024) {
    throw new BadRequestException('El CSV debe ser texto de hasta 64 KB.');
  }
  const texto = csv.replace(/^\uFEFF/, '');
  const separador = texto
    .slice(
      0,
      texto.search(/[\r\n]/) < 0 ? texto.length : texto.search(/[\r\n]/),
    )
    .includes(';')
    ? ';'
    : ',';
  const filas: string[][] = [];
  let fila: string[] = [],
    celda = '',
    entreComillas = false,
    cerrada = false;
  const finalizarFila = () => {
    fila.push(celda.trim());
    if (fila.some((c) => c !== '')) filas.push(fila);
    if (filas.length > 501)
      throw new BadRequestException('Máximo 500 registros por archivo.');
    fila = [];
    celda = '';
    cerrada = false;
  };
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (entreComillas) {
      if (c === '"' && texto[i + 1] === '"') {
        celda += '"';
        i++;
      } else if (c === '"') {
        entreComillas = false;
        cerrada = true;
      } else celda += c;
    } else if (c === separador) {
      fila.push(celda.trim());
      celda = '';
      cerrada = false;
    } else if (c === '\r' || c === '\n') {
      finalizarFila();
      if (c === '\r' && texto[i + 1] === '\n') i++;
    } else if (c === '"' && !celda && !cerrada) entreComillas = true;
    else {
      if (cerrada || c === '"')
        throw new BadRequestException('CSV inválido: revisá las comillas.');
      celda += c;
    }
  }
  if (entreComillas)
    throw new BadRequestException('CSV inválido: comillas sin cerrar.');
  if (fila.length || celda || cerrada) finalizarFila();
  if (filas.length < 2)
    throw new BadRequestException(
      'El CSV debe incluir encabezados y al menos un registro.',
    );
  return filas;
}
