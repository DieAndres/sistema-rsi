import { CumplimientoService } from './cumplimiento.service';
import { PrismaService } from '../prisma/prisma.service';

it('actualiza el plan, permite quitar relaciones y rechaza riesgos ajenos', async () => {
  const prisma = {
    plan: {
      findUnique: jest
        .fn()
        .mockResolvedValue({ id: 'plan-1', organizacionId: 'org-1' }),
      update: jest.fn().mockResolvedValue({ id: 'plan-1' }),
    },
    riesgo: { findUnique: jest.fn() },
  };
  const servicio = new CumplimientoService(prisma as unknown as PrismaService);
  prisma.riesgo.findUnique.mockResolvedValue({
    activo: { unidadOrganizativa: { organizacionId: 'org-1' } },
  });
  await servicio.actualizarPlan('plan-1', {
    nombre: ' Plan actualizado ',
    riesgoId: 'riesgo-1',
    fechaFin: '2026-12-31',
  });
  expect(prisma.plan.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        nombre: 'Plan actualizado',
        riesgoId: 'riesgo-1',
        fechaFin: new Date('2026-12-31'),
      }),
    }),
  );
  await servicio.actualizarPlan('plan-1', { riesgoId: '', responsableId: '' });
  expect(prisma.plan.update).toHaveBeenLastCalledWith(
    expect.objectContaining({ data: { riesgoId: null, responsableId: null } }),
  );
  prisma.plan.update.mockClear();
  prisma.riesgo.findUnique.mockResolvedValue({
    activo: { unidadOrganizativa: { organizacionId: 'org-2' } },
  });
  await expect(
    servicio.actualizarPlan('plan-1', { riesgoId: 'riesgo-ajeno' }),
  ).rejects.toThrow('no pertenece a la organización');
  await expect(
    servicio.actualizarPlan('plan-1', { nombre: ' ' }),
  ).rejects.toThrow('El nombre es obligatorio');
  expect(prisma.plan.update).not.toHaveBeenCalled();
});
