import { Test } from '@nestjs/testing';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import request from 'supertest';
import { RolesGuard } from '../auth/roles.guard';
import { AuditoriaInterceptor } from '../auth/auditoria.interceptor';
import { PrismaService } from '../prisma/prisma.service';
import { UrcdpController } from './urcdp.controller';
import { UrcdpService } from './urcdp.service';

function preparar() {
  const base = {
    id: 'base',
    organizacionId: 'org',
    nombre: '<Clientes>|',
    datos: { responsable: 'Responsable' },
    revision: 1,
    actualizadoEn: new Date(),
  };
  const ficha = {
    id: 'brecha',
    organizacionId: 'org',
    baseId: 'base',
    incidenteId: 'inc',
    datos: { conocimiento: '2026-01-01T00:00:00.000Z' },
    revision: 1,
    actualizadoEn: new Date(),
    base,
    incidente: {
      id: 'inc',
      titulo: '<Intrusión>|',
      descripcion: 'Detalle',
      estado: 'ABIERTO',
      activo: { nombre: 'CRM' },
      historial: [
        { fecha: new Date(), estado: 'CONTENIDO', descripcion: 'Aislado' },
      ],
      evidencias: [],
      leccionesAprendidas: null,
    },
  };
  const prisma = {
    organizacion: {
      findUnique: jest.fn().mockResolvedValue({ nombre: 'Demo' }),
    },
    basePersonal: {
      findFirst: jest.fn().mockResolvedValue(base),
      findUnique: jest.fn().mockResolvedValue(base),
      create: jest.fn().mockResolvedValue(base),
      update: jest.fn().mockResolvedValue(base),
      findMany: jest.fn().mockResolvedValue([base]),
    },
    notificacionUrcdp: {
      findFirst: jest.fn().mockResolvedValue(ficha),
      create: jest.fn().mockResolvedValue(ficha),
      update: jest.fn().mockResolvedValue(ficha),
      findMany: jest.fn().mockResolvedValue([ficha]),
    },
    incidente: {
      findFirst: jest.fn().mockResolvedValue({ id: 'inc' }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    auditEvent: { create: jest.fn().mockResolvedValue({}) },
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation(
    async (accion: (tx: typeof prisma) => Promise<unknown>) => accion(prisma),
  );
  return {
    prisma,
    base,
    ficha,
    servicio: new UrcdpService(prisma as unknown as PrismaService),
  };
}

it('guarda borradores y valida tipos, fechas y datos desconocidos', async () => {
  const { servicio, prisma } = preparar();
  await servicio.guardarBase('org', {
    nombre: 'Clientes',
    datos: { cantidad: '0' },
  });
  expect(prisma.basePersonal.create).toHaveBeenCalledWith({
    data: {
      organizacionId: 'org',
      nombre: 'Clientes',
      datos: { cantidad: '0' },
    },
  });
  for (const datos of [
    { cantidad: '-1' },
    { cantidad: '1.5' },
    { correo: 'inválido' },
    { secreto: 'contraseña' },
    { finalidad: 5 },
    { finalidad: 'a'.repeat(10001) },
  ]) {
    await expect(
      servicio.guardarBase('org', { nombre: 'Base', datos }),
    ).rejects.toThrow();
  }
  await servicio.guardarBrecha('org', {
    baseId: 'base',
    incidenteId: 'inc',
    datos: {},
  });
  for (const datos of [
    { conocimiento: 'ayer' },
    { conocimiento: '2026-02-31T00:00:00.000Z' },
    { conocimiento: '2999-01-01T00:00:00.000Z' },
    {
      conocimiento: '2026-01-02T00:00:00.000Z',
      envio: '2026-01-01T00:00:00.000Z',
      constancia: 'Ticket',
    },
    {
      conocimiento: '2026-01-01T00:00:00.000Z',
      envio: '2026-01-05T00:00:00.000Z',
      constancia: 'Ticket',
    },
  ]) {
    await expect(
      servicio.guardarBrecha('org', {
        baseId: 'base',
        incidenteId: 'inc',
        datos,
      }),
    ).rejects.toThrow();
  }
});

it('impide asociar bases, incidentes y fichas ajenas a la organización', async () => {
  const { servicio, prisma } = preparar();
  prisma.basePersonal.findFirst.mockResolvedValueOnce(null);
  await expect(
    servicio.guardarBrecha('org', {
      baseId: 'ajena',
      incidenteId: 'inc',
      datos: {},
    }),
  ).rejects.toThrow('pertenecer');
  prisma.incidente.findFirst.mockResolvedValueOnce(null);
  await expect(
    servicio.guardarBrecha('org', {
      baseId: 'base',
      incidenteId: 'ajeno',
      datos: {},
    }),
  ).rejects.toThrow('pertenecer');
  prisma.basePersonal.findFirst.mockResolvedValueOnce(null);
  await expect(
    servicio.guardarBase('org', { nombre: 'Base', datos: {} }, 'ajena'),
  ).rejects.toThrow('organización');
  prisma.notificacionUrcdp.findFirst.mockResolvedValueOnce(null);
  await expect(servicio.exportar('org', 'brecha', 'ajena')).rejects.toThrow(
    'organización',
  );
  await expect(servicio.exportar('org', 'registro', '')).rejects.toThrow(
    'Elegí',
  );
  expect(prisma.notificacionUrcdp.create).not.toHaveBeenCalled();
});

it('genera los tres documentos, marca pendientes, calcula 72 horas y escapa el contenido', async () => {
  const { servicio, ficha } = preparar();
  const registro = await servicio.exportar('org', 'registro', 'base');
  expect(registro).toContain('&lt;Clientes&gt;&#124;');
  expect(registro).toContain('PENDIENTE DE COMPLETAR');
  expect(registro).toContain('Finalidad');
  expect(await servicio.exportar('org', 'medidas', 'base')).toContain(
    'Respaldos',
  );
  const inicial = await servicio.exportar('org', 'brecha', 'brecha');
  expect(inicial).toContain('2026-01-04T00:00:00.000Z');
  expect(inicial).toContain('Sin presentación declarada');
  expect(inicial).toContain('&lt;Intrusión&gt;&#124;');
  expect(inicial).toContain('Aislado');
  expect(inicial).not.toContain('## Informe posterior');
  expect(await servicio.exportar('org', 'brecha', 'brecha', 'final')).toContain(
    '## Informe posterior',
  );
  ficha.datos.conocimiento = '';
  expect(await servicio.exportar('org', 'brecha', 'brecha')).toContain(
    'falta fecha de conocimiento',
  );
});

it('protege las rutas HTTP por rol y audita exportación y guardado sin registrar contenido sensible', async () => {
  const { prisma, servicio } = preparar();
  const modulo = await Test.createTestingModule({
    controllers: [UrcdpController],
    providers: [
      { provide: UrcdpService, useValue: servicio },
      { provide: PrismaService, useValue: prisma },
      { provide: APP_GUARD, useClass: RolesGuard },
      { provide: APP_INTERCEPTOR, useClass: AuditoriaInterceptor },
    ],
  }).compile();
  const app = modulo.createNestApplication();
  app.setGlobalPrefix('api/v1');
  app.use(
    (
      req: { headers: Record<string, string>; user: unknown },
      _res: unknown,
      next: () => void,
    ) => {
      req.user = { id: 'usuario', rol: req.headers['x-test-rol'] };
      next();
    },
  );
  await app.init();
  const ruta = '/api/v1/exportaciones/organizaciones/org/urcdp';
  try {
    await request(app.getHttpServer())
      .get(`${ruta}/registro-urcdp?fichaId=base`)
      .set('x-test-rol', 'LECTOR')
      .expect(403);
    await request(app.getHttpServer())
      .post(`${ruta}/bases-personales`)
      .set('x-test-rol', 'DUENO_UNIDAD')
      .send({ nombre: 'Base', datos: {} })
      .expect(403);
    await request(app.getHttpServer())
      .get(`${ruta}/registro-urcdp?fichaId=base`)
      .set('x-test-rol', 'RSI')
      .expect(200)
      .expect('Content-Type', /markdown/);
    expect(prisma.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ action: 'EXPORT' }),
      }),
    );
    await request(app.getHttpServer())
      .put(`${ruta}/bases-personales/base`)
      .set('x-test-rol', 'ADMINISTRADOR')
      .send({ nombre: 'Base', datos: { responsable: 'Dato privado' } })
      .expect(200);
    const eventos = JSON.stringify(prisma.auditEvent.create.mock.calls);
    expect(eventos).not.toContain('Dato privado');
    expect(eventos).not.toContain('Responsable');
    expect(prisma.basePersonal.findUnique).toHaveBeenCalledWith({
      where: { id: 'base' },
    });
  } finally {
    await app.close();
  }
});
