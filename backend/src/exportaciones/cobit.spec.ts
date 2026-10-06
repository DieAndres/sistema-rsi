import { CobitService } from './cobit.service';
import { CobitController } from './cobit.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AREAS_COBIT } from './objetivos-cobit';
import type { Request } from 'express';

it('guarda relaciones COBIT por proceso y organización, exporta datos y rechaza cruces', async () => {
  const prisma = {
    organizacion: {
      findUnique: jest.fn().mockResolvedValue({ nombre: 'Demo' }),
    },
    proceso: {
      findFirst: jest.fn().mockResolvedValue({ id: 'proceso-1' }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'proceso-1',
          nombre: 'Incidentes',
          responsable: { nombre: 'RSI' },
        },
      ]),
    },
    evaluacionCobit: {
      findMany: jest.fn().mockResolvedValue([
        {
          procesoId: 'proceso-1',
          controlId: 'DSS',
          evaluacion: 'En revisión',
          evidencia: 'Registro | 2026',
          indicador: 'Tiempo: 3 horas',
        },
      ]),
      upsert: jest.fn().mockResolvedValue({}),
    },
  };
  const servicio = new CobitService(prisma as unknown as PrismaService);
  expect(AREAS_COBIT).toEqual(['EDM', 'APO', 'BAI', 'DSS', 'MEA']);
  await servicio.guardar('org-1', 'DSS', {
    procesoId: 'proceso-1',
    evaluacion: ' En revisión ',
  });
  expect(prisma.evaluacionCobit.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        organizacionId_procesoId_controlId: {
          organizacionId: 'org-1',
          procesoId: 'proceso-1',
          controlId: 'DSS',
        },
      },
      update: { evaluacion: 'En revisión', evidencia: null, indicador: null },
    }),
  );
  const informe = await servicio.exportar('org-1');
  expect(informe).toContain('DSS');
  expect(informe).toContain('Incidentes');
  expect(informe).toContain('Registro &#124; 2026');
  expect(prisma.evaluacionCobit.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ where: { organizacionId: 'org-1' } }),
  );
  await expect(
    servicio.guardar('org-1', 'INVALIDO', { procesoId: 'proceso-1' }),
  ).rejects.toThrow('Área COBIT');
  await expect(
    servicio.guardar('org-1', 'DSS', {
      procesoId: 'proceso-1',
      indicador: 123,
    }),
  ).rejects.toThrow('texto');
  await expect(
    servicio.guardar('org-1', 'EDM01', { procesoId: 'proceso-1' }),
  ).rejects.toThrow('Área COBIT');
  prisma.evaluacionCobit.findMany.mockResolvedValueOnce([
    { procesoId: 'proceso-1', controlId: 'DSS02', evaluacion: 'Anterior' },
  ]);
  expect(await servicio.exportar('org-1')).toContain(
    'registro anterior: DSS02',
  );
  prisma.proceso.findFirst.mockResolvedValueOnce(null);
  await expect(
    servicio.guardar('org-2', 'DSS', { procesoId: 'proceso-1' }),
  ).rejects.toThrow('no pertenece');
  const controller = new CobitController(servicio);
  expect(() =>
    controller.listar('org-2', {
      user: { rol: 'LECTOR', organizacionId: 'org-1' },
    } as unknown as Request),
  ).toThrow('No tenés permisos');
});
