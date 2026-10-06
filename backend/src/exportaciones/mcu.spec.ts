import { McuService } from './mcu.service';
import { McuController } from './mcu.controller';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';

it('reporta las seis funciones, persiste evaluaciones y rechaza entradas inválidas', async () => {
  const prisma = {
    organizacion: {
      findUnique: jest.fn().mockResolvedValue({ nombre: 'Demo' }),
    },
    evaluacionMcu: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({}),
    },
  };
  const servicio = new McuService(prisma as unknown as PrismaService);
  expect(await servicio.listar('org-1')).toHaveLength(47);
  const reporte = await servicio.exportar('org-1');
  for (const codigo of ['GV', 'ID', 'PR', 'DE', 'RS', 'RC'])
    expect(reporte).toContain(`## ${codigo} —`);
  expect(reporte).toContain('Pendiente');
  expect(prisma.evaluacionMcu.findMany).toHaveBeenCalledWith({
    where: { organizacionId: 'org-1' },
  });
  await expect(
    servicio.guardar('org-1', 'GV-01', { respuesta: 'NA' }),
  ).rejects.toThrow('justificación');
  await expect(
    servicio.guardar('org-1', 'GV-01', { respuesta: 'SI' }),
  ).rejects.toThrow('evidencia');
  await expect(
    servicio.guardar('org-1', 'inventado', { respuesta: null }),
  ).rejects.toThrow('Control MCU');
  await servicio.guardar('org-1', 'GV-01', {
    respuesta: 'SI',
    evidencia: 'Documento firmado',
    demostracion: 'Revisar firma',
  });
  expect(prisma.evaluacionMcu.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        organizacionId_controlId: {
          organizacionId: 'org-1',
          controlId: 'GV-01',
        },
      },
    }),
  );
  prisma.evaluacionMcu.findMany.mockResolvedValue([
    {
      controlId: 'GV-01',
      respuesta: 'SI',
      evidencia: '<prueba>|',
      demostracion: 'Revisar firma',
    },
  ]);
  expect(await servicio.exportar('org-1')).toContain('&lt;prueba&gt;&#124;');
  const controller = new McuController(servicio);
  expect(() =>
    controller.listar('org-2', {
      user: { rol: 'LECTOR', organizacionId: 'org-1' },
    } as unknown as Request),
  ).toThrow('No tenés permisos');
});
