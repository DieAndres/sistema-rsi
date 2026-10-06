import { BcuService } from './bcu.service';
import { BcuController } from './bcu.controller';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';

it('exporta 18 requerimientos pendientes y valida evaluaciones por organización', async () => {
  const prisma = {
    organizacion: {
      findUnique: jest.fn().mockResolvedValue({ nombre: 'Demo' }),
    },
    evaluacionBcu: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({}),
    },
  };
  const servicio = new BcuService(prisma as unknown as PrismaService);
  expect(await servicio.listar('org-1')).toHaveLength(18);
  expect(await servicio.exportar('org-1')).toContain('BCU-18');
  expect(await servicio.exportar('org-1')).toContain('Pendiente');
  await expect(
    servicio.guardar('org-1', 'BCU-01', { respuesta: 'NA' }),
  ).rejects.toThrow('justificación');
  await expect(
    servicio.guardar('org-1', 'BCU-01', {
      respuesta: 'CUMPLE',
      justificacion: 'Revisado',
    }),
  ).rejects.toThrow('evidencia');
  await servicio.guardar('org-1', 'BCU-01', {
    respuesta: 'PARCIAL',
    justificacion: 'Sin comunicar',
    evidencia: 'Política firmada',
    demostracion: 'Comunicar al personal',
  });
  expect(prisma.evaluacionBcu.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        organizacionId_controlId: {
          organizacionId: 'org-1',
          controlId: 'BCU-01',
        },
      },
    }),
  );
  const controller = new BcuController(servicio);
  expect(() =>
    controller.listar('org-2', {
      user: { rol: 'LECTOR', organizacionId: 'org-1' },
    } as unknown as Request),
  ).toThrow('No tenés permisos');
});
