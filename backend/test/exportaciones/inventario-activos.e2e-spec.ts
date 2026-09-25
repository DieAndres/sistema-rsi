import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ExportacionesController } from '../../src/exportaciones/exportaciones.controller';
import { ExportacionesService } from '../../src/exportaciones/exportaciones.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { SoaService } from '../../src/exportaciones/soa.service';

describe('Exportación de inventario de activos (e2e)', () => {
  let app: INestApplication;
  const prisma = {
    organizacion: { findUnique: jest.fn() },
    activo: { findMany: jest.fn() },
  };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [ExportacionesController],
      providers: [
        ExportacionesService,
        { provide: SoaService, useValue: {} },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => app.close());

  it('descarga únicamente los activos de la organización y escapa texto no confiable', async () => {
    prisma.organizacion.findUnique.mockResolvedValue({
      nombre: 'Organización demo',
    });
    prisma.activo.findMany.mockResolvedValue([
      {
        id: 'a1',
        nombre: 'Servidor | <prueba>',
        tipo: 'HW',
        criticidad: 'ALTA',
        clasificacion: 'INTERNO',
        responsable: { nombre: 'Diego' },
      },
    ]);

    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/exportaciones/organizaciones/org-1/inventario-activos')
      .expect(200);

    expect(respuesta.headers['content-disposition']).toContain(
      'inventario-activos-borrador.md',
    );
    expect(respuesta.text).toContain('Servidor &#124; &lt;prueba&gt;');
    expect(respuesta.text).toContain('| S |');
    expect(respuesta.text).toContain('Estado: borrador');
    expect(prisma.activo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { unidadOrganizativa: { organizacionId: 'org-1' } },
      }),
    );
  });

  it('devuelve 404 si la organización no existe', async () => {
    prisma.organizacion.findUnique.mockResolvedValue(null);
    await request(app.getHttpServer())
      .get(
        '/api/v1/exportaciones/organizaciones/inexistente/inventario-activos',
      )
      .expect(404);
  });
});
