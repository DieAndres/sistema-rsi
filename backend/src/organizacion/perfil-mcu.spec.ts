import { OrganizacionService } from './organizacion.service';
import { PrismaService } from '../prisma/prisma.service';

it('guarda el perfil MCU, conserva el predeterminado y rechaza valores inválidos', async () => {
  const prisma = { organizacion: {
    create: jest.fn().mockImplementation(({ data }) => data),
    findUnique: jest.fn().mockResolvedValue({ id: 'org' }),
    update: jest.fn().mockImplementation(({ data }) => data),
  } };
  const servicio = new OrganizacionService(prisma as unknown as PrismaService);
  expect(await servicio.crear({ nombre: 'Demo' })).toHaveProperty('perfilMcu', 'Avanzado');
  for (const perfilMcu of ['Básico', 'Estándar', 'Avanzado']) {
    expect(await servicio.crear({ nombre: 'Demo', perfilMcu })).toHaveProperty('perfilMcu', perfilMcu);
    expect(await servicio.actualizar('org', { perfilMcu })).toHaveProperty('perfilMcu', perfilMcu);
  }
  expect(await servicio.actualizar('org', { nombre: 'Nuevo' })).not.toHaveProperty('perfilMcu');
  expect(() => servicio.crear({ nombre: 'Demo', perfilMcu: 'Otro' })).toThrow('perfil MCU');
  await expect(servicio.actualizar('org', { perfilMcu: 'Otro' })).rejects.toThrow('perfil MCU');
});
