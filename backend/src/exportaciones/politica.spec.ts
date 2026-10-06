import { ExportacionesService } from './exportaciones.service';
import { ExportacionesController } from './exportaciones.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SoaService } from './soa.service';
import type { Request, Response } from 'express';

it('exporta políticas de la organización, conserva texto y señala faltantes', async () => {
  const prisma = {
    organizacion: {
      findUnique: jest.fn().mockResolvedValue({ nombre: 'Empresa' }),
    },
    politica: {
      findMany: jest
        .fn()
        .mockResolvedValue([
          {
            id: 'p1',
            titulo: 'Acceso | <seguro>',
            version: '2',
            estado: 'BORRADOR',
            descripcion: 'Primera línea\nSegunda línea',
            responsable: { nombre: 'Ana' },
            fechaRevision: new Date('2026-12-01'),
          },
        ]),
    },
  };
  const servicio = new ExportacionesService(prisma as unknown as PrismaService);
  const texto = await servicio.politicaSeguridad('org-1');
  expect(prisma.politica.findMany).toHaveBeenCalledWith(
    expect.objectContaining({ where: { organizacionId: 'org-1' } }),
  );
  expect(texto).toContain('Acceso &#124; &lt;seguro&gt;');
  expect(texto).toContain('Primera línea\nSegunda línea');
  expect(texto).toContain('| Responsable | Ana |');
  expect(texto).toContain('2026-12-01');
  expect(texto).toContain('no sustituye la aprobación formal');
  const controller = new ExportacionesController(servicio, {} as SoaService);
  await expect(
    controller.politicaSeguridad(
      'org-2',
      {
        user: { rol: 'LECTOR', organizacionId: 'org-1' },
      } as unknown as Request,
      {} as Response,
    ),
  ).rejects.toThrow('No tenés permisos');
  prisma.politica.findMany.mockResolvedValue([]);
  expect(await servicio.politicaSeguridad('org-1')).toContain(
    'No hay políticas registradas',
  );
  prisma.organizacion.findUnique.mockResolvedValue(null);
  await expect(servicio.politicaSeguridad('inexistente')).rejects.toThrow(
    'Organización no encontrada',
  );
});
