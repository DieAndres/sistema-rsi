import { leerCsv, tipoImportacion } from './importacion-csv';

describe('CSV de importación', () => {
  it('lee BOM, comas, comillas escapadas y saltos de línea dentro de celdas', () => {
    expect(
      leerCsv(
        '\uFEFFnombre,descripcion\r\n"Servidor, central","Texto ""citado""\nsegunda línea"\r\n',
      ),
    ).toEqual([
      ['nombre', 'descripcion'],
      ['Servidor, central', 'Texto "citado"\nsegunda línea'],
    ]);
  });
  it('admite el separador punto y coma de Excel y filas vacías', () => {
    expect(leerCsv('nombre;cvss\r\n\r\nPrueba;7.5\r\n')).toEqual([
      ['nombre', 'cvss'],
      ['Prueba', '7.5'],
    ]);
  });
  it.each([
    'nombre\n"sin cierre',
    'nombre\n"cerrado"texto',
    'nombre\ncomilla"suelta',
    'nombre\n',
  ])('rechaza CSV mal formado o vacío', (csv) => {
    expect(() => leerCsv(csv)).toThrow();
  });
  it('limita el tamaño y las filas', () => {
    expect(() => leerCsv('x'.repeat(65537))).toThrow('64 KB');
    expect(() =>
      leerCsv('nombre\n' + Array(501).fill('registro').join('\n')),
    ).toThrow('500 registros');
    expect(
      leerCsv('nombre\n' + Array(500).fill('registro').join('\n')),
    ).toHaveLength(501);
  });
  it('rechaza tipos y secciones desconocidas', () => {
    expect(() => leerCsv(null)).toThrow();
    expect(() => tipoImportacion('usuarios')).toThrow();
    expect(() => tipoImportacion('__proto__')).toThrow();
  });
});
