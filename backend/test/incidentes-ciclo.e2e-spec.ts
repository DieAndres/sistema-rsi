import { sessionHeaders } from './helpers/session-headers';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { crearAplicacionDePrueba } from './helpers/crear-aplicacion-de-prueba';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';

describe('Ciclo trazable de incidentes', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let usuarioId: string;
  let incidenteId: string;
  let token: string;
  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
    prisma = app.get(PrismaService);
    const usuario = await prisma.usuario.create({
      data: {
        correo: `incidente-${randomUUID()}@example.test`,
        passwordHash: 'sin-login-password',
        rol: 'RSI',
        mfaConfirmado: true,
      },
    });
    usuarioId = usuario.id;
    token = await app.get(AuthService).crearSesion(usuarioId);
  });
  afterAll(async () => {
    if (incidenteId)
      await prisma.incidente.deleteMany({ where: { id: incidenteId } });
    if (usuarioId) {
      await prisma.auditEvent.deleteMany({ where: { actorUserId: usuarioId } });
      await prisma.usuario.deleteMany({ where: { id: usuarioId } });
    }
    await app?.close();
  });
  it('rechaza saltos y cierre sin lecciones, registra acciones y autores sin aceptar autor del cliente', async () => {
    const activo = await prisma.activo.findFirstOrThrow();
    const api = () => request(app.getHttpServer());
    const datos = {
      activoId: activo.id,
      titulo: 'Prueba ciclo',
      severidad: 'MEDIA',
    };
    await api()
      .post('/api/v1/seguridad/incidentes')
      .set(sessionHeaders(token))
      .send({ ...datos, estado: 'CERRADO' })
      .expect(400);
    const creado = await api()
      .post('/api/v1/seguridad/incidentes')
      .set(sessionHeaders(token))
      .send(datos)
      .expect(201);
    incidenteId = creado.body.id;
    const ruta = `/api/v1/seguridad/incidentes/${incidenteId}`;
    const guardar = (datos: object) =>
      api().patch(ruta).set(sessionHeaders(token)).send(datos);
    await guardar({ estado: 'INVENTADO', accionRealizada: 'No' }).expect(400);
    await guardar({ estado: 'ERRADICADO', accionRealizada: 'Salto' }).expect(
      400,
    );
    await guardar({ estado: 'CONTENIDO' }).expect(400);
    for (const estado of ['CONTENIDO', 'ERRADICADO', 'RECUPERADO'])
      await guardar({
        estado,
        accionRealizada: `Acción ${estado}`,
        usuarioId: 'falso',
      }).expect(200);
    await guardar({ estado: 'CERRADO', accionRealizada: 'Cierre' }).expect(400);
    await guardar({ estado: 'ABIERTO', accionRealizada: 'Retroceso' }).expect(
      400,
    );
    await guardar({
      estado: 'RECUPERADO',
      accionRealizada: 'Verificación adicional',
    }).expect(200);
    await guardar({
      estado: 'CERRADO',
      accionRealizada: 'Cierre',
      leccionesAprendidas: 'Mejorar controles',
    }).expect(200);
    await guardar({ leccionesAprendidas: null }).expect(400);
    const final = await api()
      .get(ruta)
      .set(sessionHeaders(token))
      .expect(200);
    expect(final.body.estado).toBe('CERRADO');
    expect(
      final.body.historial.map((a: { estado: string }) => a.estado),
    ).toEqual([
      'ABIERTO',
      'CONTENIDO',
      'ERRADICADO',
      'RECUPERADO',
      'RECUPERADO',
      'CERRADO',
    ]);
    for (const accion of final.body.historial) {
      expect(accion.usuarioId).toBe(usuarioId);
      expect(Number.isNaN(Date.parse(accion.fecha))).toBe(false);
    }
    expect(
      await prisma.auditEvent.count({
        where: { actorUserId: usuarioId, entityType: 'INCIDENTE' },
      }),
    ).toBe(6);
  });
});
