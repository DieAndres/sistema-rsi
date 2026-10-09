import {
  BadRequestException,
  type ExecutionContext,
  type INestApplication,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { defer, lastValueFrom } from 'rxjs';
import { AuditoriaInterceptor } from '../src/auth/auditoria.interceptor';
import { ImportacionService } from '../src/seguridad/importacion.service';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { crearAplicacionDePrueba } from './helpers/crear-aplicacion-de-prueba';
import { sessionHeaders } from './helpers/session-headers';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { SeguridadService } from '../src/seguridad/seguridad.service';

describe('Importadores CSV de seguridad', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let organizacionId: string,
    unidadId: string,
    otraOrganizacionId: string,
    otraUnidadId: string,
    activoId: string;
  const usuarios: string[] = [];
  const sesiones: Record<string, string> = {};
  const sufijo = randomUUID();
  const ruta = (tipo: string, accion = 'confirmar') =>
    `/api/v1/seguridad/importaciones/${tipo}/${accion}`;
  const enviar = (
    tipo: string,
    csv: string,
    accion = 'confirmar',
    rol = 'ADMINISTRADOR',
  ) =>
    request(app.getHttpServer())
      .post(ruta(tipo, accion))
      .set(sessionHeaders(sesiones[rol]))
      .send({ organizacionId, csv });

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
    prisma = app.get(PrismaService);
    organizacionId = (
      await prisma.organizacion.create({ data: { nombre: `CSV ${sufijo}` } })
    ).id;
    otraOrganizacionId = (
      await prisma.organizacion.create({
        data: { nombre: `CSV ajena ${sufijo}` },
      })
    ).id;
    unidadId = (
      await prisma.unidadOrganizativa.create({
        data: { nombre: 'Unidad CSV', tipo: 'AREA', organizacionId },
      })
    ).id;
    otraUnidadId = (
      await prisma.unidadOrganizativa.create({
        data: {
          nombre: 'Unidad ajena',
          tipo: 'AREA',
          organizacionId: otraOrganizacionId,
        },
      })
    ).id;
    activoId = (
      await prisma.activo.create({
        data: {
          nombre: 'Activo de referencia CSV',
          tipo: 'HW',
          clasificacion: 'INTERNO',
          unidadOrganizativaId: unidadId,
        },
      })
    ).id;
    for (const rol of ['ADMINISTRADOR', 'RSI', 'LECTOR', 'DUENO_UNIDAD']) {
      const usuario = await prisma.usuario.create({
        data: {
          correo: `csv-${rol}-${sufijo}@example.test`,
          passwordHash: 'prueba-sin-login',
          rol,
          mfaConfirmado: true,
        },
      });
      usuarios.push(usuario.id);
      sesiones[rol] = await app.get(AuthService).crearSesion(usuario.id);
    }
  });
  afterAll(async () => {
    if (prisma) {
      const ids = [unidadId, otraUnidadId].filter(Boolean);
      const activos = await prisma.activo.findMany({
        where: { unidadOrganizativaId: { in: ids } },
        select: { id: true },
      });
      const activosIds = activos.map((a) => a.id);
      await prisma.accionIncidente.deleteMany({
        where: { incidente: { activoId: { in: activosIds } } },
      });
      await prisma.incidente.deleteMany({
        where: { activoId: { in: activosIds } },
      });
      await prisma.riesgo.deleteMany({
        where: { activoId: { in: activosIds } },
      });
      await prisma.vulnerabilidad.deleteMany({
        where: { activoId: { in: activosIds } },
      });
      await prisma.activo.deleteMany({ where: { id: { in: activosIds } } });
      await prisma.unidadOrganizativa.deleteMany({
        where: { id: { in: ids } },
      });
      await prisma.organizacion.deleteMany({
        where: {
          id: { in: [organizacionId, otraOrganizacionId].filter(Boolean) },
        },
      });
      await prisma.auditEvent.deleteMany({
        where: { actorUserId: { in: usuarios } },
      });
      await prisma.usuario.deleteMany({ where: { id: { in: usuarios } } });
    }
    await app?.close();
  });

  const archivos = () => ({
    activos: `unidadOrganizativaId,nombre,tipo,clasificacion\n${unidadId},Equipo importado,HW,INTERNO`,
    vulnerabilidades: `activoId,nombre,cvss,sla\n${activoId},Falla importada,7.5,30`,
    riesgos: `activoId,nombre,probabilidad,impacto,aceptado\n${activoId},Riesgo importado,2,3,false`,
    incidentes: `activoId,titulo,severidad,accionRealizada\n${activoId},Incidente importado,ALTA,Detección mediante CSV`,
  });
  it.each(['activos', 'vulnerabilidades', 'riesgos', 'incidentes'])(
    'valida e importa %s con auditoría y rechaza repetir el archivo',
    async (tipo) => {
      const csv = archivos()[tipo as keyof ReturnType<typeof archivos>];
      const antes = await prisma.auditEvent.count({
        where: { actorUserId: { in: usuarios } },
      });
      const vista = await enviar(tipo, csv, 'validar').expect(201);
      expect(vista.body).toMatchObject({ total: 1, validos: 1 });
      expect(
        await prisma.auditEvent.count({
          where: { actorUserId: { in: usuarios } },
        }),
      ).toBe(antes);
      const alta = await enviar(tipo, csv, 'confirmar', 'RSI').expect(201);
      expect(alta.body).toHaveLength(1);
      const evento = await prisma.auditEvent.findFirstOrThrow({
        where: { entityId: alta.body[0].id },
      });
      expect(evento).toMatchObject({
        action: 'CREATE',
        actorUserId: usuarios[1],
        result: 'EXITOSO',
      });
      expect(evento.metadata).toMatchObject({ origen: 'IMPORTACION_CSV' });
      if (tipo === 'riesgos')
        expect(alta.body[0]).toMatchObject({
          puntajeInherente: 6,
          aceptado: false,
        });
      if (tipo === 'incidentes')
        expect(alta.body[0]).toMatchObject({
          estado: 'ABIERTO',
          historial: [
            { descripcion: 'Detección mediante CSV', usuarioId: usuarios[1] },
          ],
        });
      const repetido = await enviar(tipo, csv, 'validar').expect(201);
      expect(repetido.body.validos).toBe(0);
      expect(repetido.body.filas[0].errores.join(' ')).toContain('duplicado');
      await enviar(tipo, csv).expect(400);
    },
  );
  it.each(['activos', 'vulnerabilidades', 'riesgos', 'incidentes'])(
    'exige sesión y rol permitido para %s',
    async (tipo) => {
      for (const accion of ['validar', 'confirmar']) {
        await request(app.getHttpServer())
          .post(ruta(tipo, accion))
          .set(sessionHeaders('', true))
          .send({ organizacionId, csv: archivos().activos })
          .expect(401);
        for (const rol of ['LECTOR', 'DUENO_UNIDAD'])
          await enviar(tipo, archivos().activos, accion, rol).expect(403);
      }
    },
  );
  it('rechaza unidades y activos ajenos, números inválidos y columnas desconocidas', async () => {
    const ajena = await enviar(
      'activos',
      `unidadOrganizativaId,nombre,tipo,clasificacion\n${otraUnidadId},Ajeno,HW,INTERNO`,
      'validar',
    ).expect(201);
    expect(ajena.body.validos).toBe(0);
    const riesgo = await enviar(
      'riesgos',
      `activoId,nombre,probabilidad,impacto\n${randomUUID()},Inválido,6,1.5`,
      'validar',
    ).expect(201);
    expect(riesgo.body.filas[0].errores).toHaveLength(3);
    await enviar(
      'incidentes',
      `activoId,titulo,severidad,estado\n${activoId},Cerrado,ALTA,CERRADO`,
      'validar',
    ).expect(400);
    await enviar('activos', 'nombre,tipo\nPrueba,HW', 'validar').expect(400);
  });
  it('rechaza duplicados dentro del mismo archivo sin guardar ninguna fila', async () => {
    const fila = `${unidadId},Duplicado CSV,HW,INTERNO`;
    const csv = `unidadOrganizativaId,nombre,tipo,clasificacion\n${fila}\n${fila}`;
    const vista = await enviar('activos', csv, 'validar').expect(201);
    expect(vista.body.validos).toBe(1);
    await enviar('activos', csv).expect(400);
    expect(
      await prisma.activo.count({
        where: { unidadOrganizativaId: unidadId, nombre: 'Duplicado CSV' },
      }),
    ).toBe(0);
  });
  it('revierte todo el lote si falla la creación de una fila posterior', async () => {
    const service = app.get(SeguridadService);
    const original = service.crearActivo.bind(service);
    const spy = jest
      .spyOn(service, 'crearActivo')
      .mockImplementationOnce(original)
      .mockRejectedValueOnce(new BadRequestException('Fallo de prueba'));
    try {
      const antes = await prisma.auditEvent.count({
        where: { actorUserId: usuarios[0] },
      });
      await enviar(
        'activos',
        `unidadOrganizativaId,nombre,tipo,clasificacion\n${unidadId},Rollback uno,HW,INTERNO\n${unidadId},Rollback dos,HW,INTERNO`,
      ).expect(400);
      expect(
        await prisma.activo.count({
          where: {
            unidadOrganizativaId: unidadId,
            nombre: { startsWith: 'Rollback' },
          },
        }),
      ).toBe(0);
      expect(
        await prisma.auditEvent.count({ where: { actorUserId: usuarios[0] } }),
      ).toBe(antes);
    } finally {
      spy.mockRestore();
    }
  });

  it('revierte los registros importados si falla la auditoría', async () => {
    const transaccion = prisma.$transaction.bind(prisma);
    const prueba = {
      $transaction: (
        callback: (tx: Prisma.TransactionClient) => Promise<unknown>,
      ) =>
        transaccion((tx) =>
          callback(
            new Proxy(tx, {
              get(target, propiedad) {
                if (propiedad === 'auditEvent')
                  return {
                    create: () => {
                      throw new Error('Auditoría no disponible');
                    },
                  };
                return Reflect.get(target, propiedad);
              },
            }),
          ),
        ),
    };
    const contexto = {
      switchToHttp: () => ({
        getRequest: () => ({
          path: ruta('activos'),
          method: 'POST',
          params: {},
          user: { id: usuarios[0] },
        }),
      }),
    } as ExecutionContext;
    const csv = `unidadOrganizativaId,nombre,tipo,clasificacion\n${unidadId},Rollback auditoría,HW,INTERNO`;
    await expect(
      lastValueFrom(
        new AuditoriaInterceptor(prueba as PrismaService).intercept(contexto, {
          handle: () =>
            defer(() =>
              app.get(ImportacionService).importar(
                'activos',
                { organizacionId, csv },
                {
                  id: usuarios[0],
                  correo: 'prueba@example.test',
                  rol: 'ADMINISTRADOR',
                },
              ),
            ),
        }),
      ),
    ).rejects.toThrow('Auditoría no disponible');
    expect(
      await prisma.activo.count({
        where: { unidadOrganizativaId: unidadId, nombre: 'Rollback auditoría' },
      }),
    ).toBe(0);
  });
});
