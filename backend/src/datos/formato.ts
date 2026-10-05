export type Registro = Record<string, unknown>;
export type Paquete = { version: 1; datos: Record<string, Registro[]> };

// CSV RFC 4180: dos columnas; el JSON conserva tipos, textos multilínea y relaciones.
export function aCsv(paquete: Paquete): string {
  const celda = (v: string) => `"${v.replaceAll('"', '""')}"`;
  return [
    'modulo,datos',
    ...Object.entries(paquete.datos).flatMap(([modulo, filas]) =>
      filas.map((fila) => `${celda(modulo)},${celda(JSON.stringify(fila))}`),
    ),
  ].join('\r\n');
}
