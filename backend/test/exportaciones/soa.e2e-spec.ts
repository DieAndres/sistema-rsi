import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { ExportacionesController } from '../../src/exportaciones/exportaciones.controller';
import { ExportacionesService } from '../../src/exportaciones/exportaciones.service';
import { SoaService } from '../../src/exportaciones/soa.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('SoA (e2e)', () => {
  let app: INestApplication;
  const prisma = {
    organizacion: { findUnique: jest.fn() },
    unidadOrganizativa: { count: jest.fn() },
    trabajador: { count: jest.fn() },
    activo: { count: jest.fn() },
    riesgo: { count: jest.fn() },
    vulnerabilidad: { count: jest.fn() },
    incidente: { count: jest.fn() },
    politica: { count: jest.fn() },
    proceso: { count: jest.fn() },
    procedimiento: { count: jest.fn() },
    plan: { findFirst: jest.fn(), count: jest.fn() },
    evidencia: { findFirst: jest.fn(), count: jest.fn() },
    evaluacionSoa: { findMany: jest.fn(), upsert: jest.fn() },
    brechaMcu: { findMany: jest.fn(), upsert: jest.fn() },
  };

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [ExportacionesController],
      providers: [
        SoaService,
        { provide: ExportacionesService, useValue: {} },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.organizacion.findUnique.mockResolvedValue({
      nombre: 'Organización demo',
      alcanceSgsi: 'Escenario simulado de demostración; datos sintéticos para demostración.',
    });
    prisma.evaluacionSoa.findMany.mockResolvedValue([]);
    prisma.brechaMcu.findMany.mockResolvedValue([]);
    prisma.unidadOrganizativa.count.mockResolvedValue(0);
    prisma.trabajador.count.mockResolvedValue(0);
    prisma.activo.count.mockResolvedValue(0);
    prisma.riesgo.count.mockResolvedValue(0);
    prisma.vulnerabilidad.count.mockResolvedValue(0);
    prisma.incidente.count.mockResolvedValue(0);
    prisma.politica.count.mockResolvedValue(0);
    prisma.proceso.count.mockResolvedValue(0);
    prisma.procedimiento.count.mockResolvedValue(0);
    prisma.plan.count.mockResolvedValue(0);
    prisma.evidencia.count.mockResolvedValue(0);
  });

  afterAll(async () => app.close());

  it('genera 93 filas pendientes sin afirmar cumplimiento', async () => {
    const controles = await request(app.getHttpServer())
      .get('/api/v1/exportaciones/organizaciones/org-1/soa/controles')
      .expect(200);
    expect(controles.body).toHaveLength(93);
    expect(controles.body[0]).toMatchObject({
      controlId: 'A.5.1',
      tema: 'Políticas de seguridad de la información',
    });

    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/exportaciones/organizaciones/org-1/soa')
      .expect(200);
    expect(respuesta.text).toContain('Estado: en revisión');
    expect(respuesta.text).toContain(
      'Informe generado con datos de un escenario simulado.',
    );
    expect(respuesta.text).toContain('A.8.34');
    expect(respuesta.text).toContain('| A.6 Personas | 8 | 0 | 0 |');
    expect(respuesta.text).toContain(
      '| A.8.34 | Protección durante pruebas de auditoría | Pendiente |',
    );
    expect(respuesta.text).not.toContain('Título pendiente de verificar');
    expect(respuesta.text).toContain(
      'Controles con aplicabilidad pendiente: 93',
    );
    expect(respuesta.text).toContain(
      'Controles aplicables sin referencia de evidencia: 0',
    );
  });

  it('incluye una evaluación y la brecha MCU sin ocultar los controles pendientes', async () => {
    prisma.evaluacionSoa.findMany.mockResolvedValue([
      {
        controlId: 'A.5.9',
        titulo: 'Inventario de activos',
        aplica: true,
        justificacion: 'El inventario de la organización incluye activos',
        insumos: 'Registro de activos',
        estado: 'EN_REVISION',
        evidencia: null,
        plan: null,
      },
    ]);
    prisma.brechaMcu.findMany.mockResolvedValue([
      {
        funcion: 'Identificar',
        perfilObjetivo: 'Básico',
        evidencia: 'Inventario',
        madurez: 1,
        acciones: 'Completar cobertura',
      },
    ]);

    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/exportaciones/organizaciones/org-1/soa')
      .expect(200);
    expect(respuesta.text).toContain('| A.5 Organizacionales | 37 | 1 | 0 |');
    expect(respuesta.text).toContain(
      'Controles con aplicabilidad pendiente: 92',
    );
    expect(respuesta.text).toContain(
      '| Identificar | Básico | Inventario | 1 | Completar cobertura |',
    );
  });

  it('no exige evidencia para controles no aplicables', async () => {
    prisma.evaluacionSoa.findMany.mockResolvedValue([
      {
        controlId: 'A.5.1',
        aplica: false,
        justificacion: 'No aplica en el escenario simulado',
        insumos: 'Supuesto del escenario',
        estado: 'NO_APLICA_SIMULADO',
        evidenciaId: null,
        evidencia: null,
        plan: null,
      },
      {
        controlId: 'A.5.2',
        aplica: true,
        justificacion: 'Aplica en el escenario simulado',
        insumos: 'Supuesto del escenario',
        estado: 'REFERENCIA_SIMULADA',
        evidenciaId: null,
        evidencia: null,
        plan: null,
      },
    ]);

    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/exportaciones/organizaciones/org-1/soa')
      .expect(200);

    expect(respuesta.text).toContain(
      'Controles aplicables sin referencia de evidencia: 1',
    );
    expect(respuesta.text).toContain(
      '| A.5.1 | Políticas de seguridad de la información | No | No aplica en el escenario simulado | Supuesto del escenario | No requiere evidencia; revisar justificación de no aplicabilidad | NO_APLICA_SIMULADO |',
    );
  });

  it('rechaza evaluaciones sin justificación y evidencia de otra organización', async () => {
    const ruta =
      '/api/v1/exportaciones/organizaciones/org-1/soa/controles/A.5.9';
    await request(app.getHttpServer())
      .put(ruta)
      .send({ aplica: true, justificacion: null })
      .expect(400);

    prisma.evidencia.findFirst.mockResolvedValue(null);
    await request(app.getHttpServer())
      .put(ruta)
      .send({
        aplica: true,
        justificacion: 'Necesario para gestionar activos',
        evidenciaId: 'evidencia-externa',
      })
      .expect(400);
    expect(prisma.evaluacionSoa.upsert).not.toHaveBeenCalled();
  });

  it('guarda una evaluación justificada de la organización', async () => {
    prisma.evidencia.findFirst.mockResolvedValue({ id: 'e1' });
    prisma.evaluacionSoa.upsert.mockResolvedValue({
      controlId: 'A.5.9',
      aplica: true,
    });
    await request(app.getHttpServer())
      .put('/api/v1/exportaciones/organizaciones/org-1/soa/controles/A.5.9')
      .send({
        titulo: 'Inventario de activos',
        aplica: true,
        justificacion: 'Los activos registrados pertenecen al alcance evaluado',
        evidenciaId: 'e1',
        insumos: 'Registro de activos',
        estado: 'EN_REVISION',
        planId: null,
      })
      .expect(200);
    expect(prisma.evaluacionSoa.upsert).toHaveBeenCalled();
  });
});
