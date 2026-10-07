import { sessionHeaders } from './helpers/session-headers';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { crearAplicacionDePrueba } from './helpers/crear-aplicacion-de-prueba';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';
import { AuditoriaInterceptor } from '../src/auth/auditoria.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { defer, lastValueFrom } from 'rxjs';

describe('Auditoría de gestión', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let lectorToken: string;
  let usuarioId: string;
  let lectorId: string;
  let organizacionId: string;
  let unidadId: string;
  let activoId: string;
  let procesoId: string;
  let politicaId: string;
  const sufijo = randomUUID();

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
    prisma = app.get(PrismaService);
    const admin = await prisma.usuario.create({
      data: {
        correo: `audit-${sufijo}@example.test`,
        passwordHash: 'cuenta-de-prueba-sin-login-password',
        rol: 'ADMINISTRADOR',
        mfaConfirmado: true,
      },
    });
    const lector = await prisma.usuario.create({
      data: {
        correo: `lector-${sufijo}@example.test`,
        passwordHash: 'cuenta-de-prueba-sin-login-password',
        rol: 'LECTOR',
      },
    });
    usuarioId = admin.id;
    lectorId = lector.id;
    token = await app.get(AuthService).crearSesion(usuarioId);
    lectorToken = await app.get(AuthService).crearSesion(lectorId);
  });

  afterAll(async () => {
    if (prisma) {
      if (politicaId)
        await prisma.politica.deleteMany({ where: { id: politicaId } });
      if (organizacionId) {
        await prisma.evaluacionSoa.deleteMany({ where: { organizacionId } });
        await prisma.brechaMcu.deleteMany({ where: { organizacionId } });
      }
      if (activoId) await prisma.activo.deleteMany({ where: { id: activoId } });
      if (procesoId)
        await prisma.proceso.deleteMany({ where: { id: procesoId } });
      if (unidadId)
        await prisma.unidadOrganizativa.deleteMany({ where: { id: unidadId } });
      if (organizacionId)
        await prisma.organizacion.deleteMany({ where: { id: organizacionId } });
      const ids = [usuarioId, lectorId].filter(Boolean);
      await prisma.auditEvent.deleteMany({
        where: { actorUserId: { in: ids } },
      });
      await prisma.usuario.deleteMany({ where: { id: { in: ids } } });
    }
    await app?.close();
  });

  const api = () => request(app.getHttpServer());

  it('registra altas, cambios, relaciones, bajas, aprobaciones, SoA y exportaciones con su actor', async () => {
    const org = await api()
      .post('/api/v1/organizaciones')
      .set(sessionHeaders(token))
      .send({ nombre: `Prueba auditoría ${sufijo}`, password: 'campo-ajeno-ignorado', token: 'campo-ajeno-ignorado' })
      .expect(201);
    organizacionId = org.body.id;
    const alta = await prisma.auditEvent.findFirstOrThrow({ where: { actorUserId: usuarioId, entityId: organizacionId, action: 'CREATE' } });
    expect(JSON.stringify(alta.metadata)).not.toContain('campo-ajeno-ignorado');
    await api()
      .patch(`/api/v1/organizaciones/${organizacionId}`)
      .set(sessionHeaders(token))
      .send({ nombre: 'Organización modificada' })
      .expect(200);
    const evento = await prisma.auditEvent.findFirstOrThrow({
      where: {
        actorUserId: usuarioId,
        action: 'UPDATE',
        entityId: organizacionId,
      },
    });
    expect(evento.metadata).toMatchObject({
      campos: ['nombre'],
      anterior: { nombre: org.body.nombre },
      nuevo: { nombre: 'Organización modificada' },
    });

    const unidad = await api()
      .post(`/api/v1/organizaciones/${organizacionId}/unidades`)
      .set(sessionHeaders(token))
      .send({ nombre: 'Área prueba', tipo: 'AREA' })
      .expect(201);
    unidadId = unidad.body.id;
    const proceso = await api()
      .post(`/api/v1/organizaciones/${organizacionId}/procesos`)
      .set(sessionHeaders(token))
      .send({ nombre: 'Proceso prueba' })
      .expect(201);
    procesoId = proceso.body.id;
    const activo = await api()
      .post(`/api/v1/seguridad/unidades/${unidadId}/activos`)
      .set(sessionHeaders(token))
      .send({ nombre: 'Activo prueba', tipo: 'HW', clasificacion: 'INTERNO' })
      .expect(201);
    activoId = activo.body.id;
    await api()
      .patch(`/api/v1/seguridad/activos/${activoId}`)
      .set(sessionHeaders(token))
      .send({ procesoIds: [procesoId] })
      .expect(200);
    expect(
      (
        await prisma.auditEvent.findFirstOrThrow({
          where: {
            actorUserId: usuarioId,
            entityId: activoId,
            action: 'UPDATE',
          },
        })
      ).metadata,
    ).toMatchObject({
      campos: ['procesoIds'],
      anterior: { procesoIds: [] },
      nuevo: { procesoIds: [procesoId] },
    });

    const politica = await api()
      .post(`/api/v1/cumplimiento/politicas/${organizacionId}`)
      .set(sessionHeaders(token))
      .send({ titulo: 'Política prueba' })
      .expect(201);
    politicaId = politica.body.id;
    await api()
      .patch(`/api/v1/cumplimiento/politicas/${politicaId}`)
      .set(sessionHeaders(token))
      .send({ estado: 'APROBADA' })
      .expect(200);
    expect(
      await prisma.auditEvent.count({
        where: { entityId: politicaId, action: 'APPROVE' },
      }),
    ).toBe(1);
    await api()
      .put(
        `/api/v1/exportaciones/organizaciones/${organizacionId}/soa/controles/A.5.1`,
      )
      .set(sessionHeaders(token))
      .send({ aplica: false, justificacion: 'Escenario de prueba' })
      .expect(200);
    await api()
      .put(
        `/api/v1/exportaciones/organizaciones/${organizacionId}/soa/brechas/Gobernar`,
      )
      .set(sessionHeaders(token))
      .send({ perfilObjetivo: 'Avanzado', madurez: 0 })
      .expect(200);
    await api()
      .get(
        `/api/v1/exportaciones/organizaciones/${organizacionId}/inventario-activos`,
      )
      .set(sessionHeaders(token))
      .expect(200);
    await api()
      .get(`/api/v1/exportaciones/organizaciones/${organizacionId}/soa`)
      .set(sessionHeaders(token))
      .expect(200);
    expect(
      await prisma.auditEvent.count({
        where: { actorUserId: usuarioId, entityType: 'EXPORTACION' },
      }),
    ).toBe(2);
    await api()
      .delete(`/api/v1/seguridad/activos/${activoId}`)
      .set(sessionHeaders(token))
      .expect(200);
    expect(
      (
        await prisma.auditEvent.findFirstOrThrow({
          where: { entityId: activoId, action: 'DELETE' },
        })
      ).metadata,
    ).toMatchObject({ anterior: { nombre: 'Activo prueba' }, nuevo: null });
  });

  it('filtra antes de paginar, conserva eventos antiguos y restringe el acceso', async () => {
    await prisma.auditEvent.createMany({
      data: Array.from({ length: 51 }, (_, i) => ({
        eventType: 'PRUEBA',
        entityType: 'RIESGO',
        action: 'UPDATE',
        actorUserId: usuarioId,
        result: 'EXITOSO',
        timestamp: new Date(Date.UTC(2024, 0, 1, 0, i)),
      })),
    });
    const ruta = `/api/v1/auth/auditoria?entidad=RIESGO&usuarioId=${usuarioId}`;
    const primera = await api()
      .get(ruta)
      .set(sessionHeaders(token))
      .expect(200);
    expect(primera.body.total).toBe(51);
    expect(primera.body.eventos).toHaveLength(50);
    const segunda = await api()
      .get(`${ruta}&pagina=2`)
      .set(sessionHeaders(token))
      .expect(200);
    expect(segunda.body.eventos).toHaveLength(1);
    expect(segunda.body.eventos[0].timestamp).toBe('2024-01-01T00:00:00.000Z');
    await api().get(ruta).expect(401);
    await api().get(ruta).set(sessionHeaders(lectorToken)).expect(403);
    await api()
      .get('/api/v1/auth/auditoria?entidad=INVALIDA')
      .set(sessionHeaders(token))
      .expect(400);
    await api()
      .get('/api/v1/auth/auditoria?pagina=-1')
      .set(sessionHeaders(token))
      .expect(400);
    await api()
      .get('/api/v1/auth/auditoria?usuarioId=invalido')
      .set(sessionHeaders(token))
      .expect(400);
  });

  it('no registra cambios fallidos ni permite cambios al lector', async () => {
    const antes = await prisma.auditEvent.count({
      where: { actorUserId: { in: [usuarioId, lectorId] } },
    });
    await api()
      .patch(`/api/v1/organizaciones/${organizacionId}`)
      .set(sessionHeaders(token))
      .send({ nombre: '' })
      .expect(400);
    await api()
      .patch(`/api/v1/organizaciones/${organizacionId}`)
      .set(sessionHeaders(lectorToken))
      .send({ nombre: 'Cambio prohibido' })
      .expect(403);
    expect(
      await prisma.auditEvent.count({
        where: { actorUserId: { in: [usuarioId, lectorId] } },
      }),
    ).toBe(antes);
  });

  it('deshace el cambio de negocio si falla la escritura de auditoría', async () => {
    const original = await prisma.organizacion.findUniqueOrThrow({
      where: { id: organizacionId },
    });
    const otraInstancia = new PrismaService();
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
    const interceptor = new AuditoriaInterceptor(prueba as PrismaService);
    const contexto = {
      switchToHttp: () => ({
        getRequest: () => ({
          path: `/api/v1/organizaciones/${organizacionId}`,
          method: 'PATCH',
          params: { id: organizacionId },
          user: { id: usuarioId },
        }),
      }),
    } as ExecutionContext;
    try {
      await expect(
        lastValueFrom(
          interceptor.intercept(contexto, {
            handle: () =>
              defer(() =>
                otraInstancia.organizacion.update({
                  where: { id: organizacionId },
                  data: { nombre: 'No debe persistirse' },
                }),
              ),
          }),
        ),
      ).rejects.toThrow('Auditoría no disponible');
      expect(
        (
          await prisma.organizacion.findUniqueOrThrow({
            where: { id: organizacionId },
          })
        ).nombre,
      ).toBe(original.nombre);
    } finally {
      await otraInstancia.$disconnect();
    }
  });
});
