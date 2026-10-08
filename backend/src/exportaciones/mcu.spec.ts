import { McuService } from './mcu.service';
import { McuController } from './mcu.controller';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';
import { CONTROLES_MCU_AGESIC } from './controles-mcu-agesic';

it('reporta las seis funciones, persiste evaluaciones y rechaza entradas inválidas', async () => {
  const prisma = {
    organizacion: {
      findUnique: jest.fn().mockResolvedValue({ nombre: 'Demo', perfilMcu: 'Básico' }),
    },
    evaluacionMcu: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({}),
    },
  };
  const servicio = new McuService(prisma as unknown as PrismaService);
  expect(await servicio.listar('org-1')).toHaveLength(165);
  const reporte = await servicio.exportar('org-1');
  for (const codigo of ['GV', 'ID', 'PR', 'DE', 'RS', 'RC'])
    expect(reporte).toContain(`## ${codigo} —`);
  expect(reporte).toContain('Pendiente');
  expect(reporte).toContain('Perfil objetivo de la organización: Básico');
  expect(reporte).toContain('165 controles únicos');
  expect(prisma.evaluacionMcu.findMany).toHaveBeenCalledWith({
    where: { organizacionId: 'org-1' },
  });
  await expect(
    servicio.guardar('org-1', 'PS.1-1', { respuesta: 'NA' }),
  ).rejects.toThrow('justificación');
  await expect(
    servicio.guardar('org-1', 'PS.1-1', { respuesta: 'SI' }),
  ).rejects.toThrow('evidencia');
  await expect(
    servicio.guardar('org-1', 'inventado', { respuesta: null }),
  ).rejects.toThrow('Control MCU');
  await servicio.guardar('org-1', 'PS.1-1', {
    respuesta: 'SI',
    evidencia: 'Documento firmado',
    demostracion: 'Revisar firma',
  });
  expect(prisma.evaluacionMcu.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      where: {
        organizacionId_controlId: {
          organizacionId: 'org-1',
          controlId: 'PS.1-1',
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

it('selecciona la línea base oficial, conserva las respuestas y bloquea controles ajenos al perfil', async () => {
  const organizacion = { nombre: 'Demo', perfilMcu: 'Básico' };
  const prisma = {
    organizacion: { findUnique: jest.fn().mockImplementation(async () => organizacion) },
    evaluacionMcu: {
      findMany: jest.fn().mockResolvedValue([{ controlId: 'PS.1-1', respuesta: 'SI', evidencia: 'Política', demostracion: 'Firma' }, { controlId: 'GV-01', respuesta: 'SI', evidencia: 'Anterior', demostracion: 'Anterior' }]),
      upsert: jest.fn(),
    },
  };
  const servicio = new McuService(prisma as unknown as PrismaService);
  for (const [perfil, cantidad] of [['Básico', 165], ['Estándar', 234], ['Avanzado', 309]] as const) {
    organizacion.perfilMcu = perfil;
    const controles = await servicio.listar('org');
    expect(controles).toHaveLength(cantidad);
    expect(new Set(controles.map((c) => c.controlId)).size).toBe(cantidad);
    expect(controles.every((c) => c.perfiles.includes(perfil) && c.funciones.length > 0)).toBe(true);
    expect(controles.find((c) => c.controlId === 'PS.1-1')?.evaluacion?.respuesta).toBe('SI');
    expect(await servicio.exportar('org')).toContain(`${cantidad} controles únicos`);
  }
  organizacion.perfilMcu = 'Básico';
  const avanzado = CONTROLES_MCU_AGESIC.find((c) => c.perfiles.includes('Avanzado') && !c.perfiles.includes('Básico'))!;
  await expect(servicio.guardar('org', avanzado.controlId, { respuesta: 'NO' })).rejects.toThrow('perfil');
  await expect(servicio.guardar('org', 'GV-01', { respuesta: 'NO' })).rejects.toThrow('Control MCU');
  expect(prisma.evaluacionMcu.upsert).not.toHaveBeenCalled();
  expect(await servicio.exportar('org')).toContain('Antecedentes del catálogo');
});
