import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { crearAplicacionDePrueba } from './helpers/crear-aplicacion-de-prueba';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/auth/auth.service';

describe('Flujo KPI utilizado por el dashboard', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let usuarioId: string;
  let indicadorId: string;
  let token: string;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
    prisma = app.get(PrismaService);
    const usuario = await prisma.usuario.create({ data: {
      correo: `kpi-${randomUUID()}@example.test`, passwordHash: 'cuenta-de-prueba-sin-login-password',
      rol: 'RSI', mfaConfirmado: true,
    } });
    usuarioId = usuario.id;
    token = await app.get(AuthService).crearSesion(usuarioId);
  });

  afterAll(async () => {
    if (indicadorId) await prisma.indicadorKpi.deleteMany({ where: { id: indicadorId } });
    if (usuarioId) {
      await prisma.auditEvent.deleteMany({ where: { actorUserId: usuarioId } });
      await prisma.usuario.deleteMany({ where: { id: usuarioId } });
    }
    await app?.close();
  });

  it('configura fórmula/meta, registra histórico y conserva mediciones al editar o desactivar', async () => {
    const api = () => request(app.getHttpServer());
    const catalogo = await api().get('/api/v1/kpis/formulas').auth(token, { type: 'bearer' }).expect(200);
    expect(catalogo.body).toEqual(expect.arrayContaining([expect.objectContaining({ codigo: 'ACTIVOS_TOTAL' })]));
    const nuevo = await api().post('/api/v1/kpis/indicadores').auth(token, { type: 'bearer' }).send({
      codigo: `WEB_${randomUUID().replaceAll('-', '').toUpperCase()}`, nombre: 'Indicador de prueba web',
      descripcion: 'Prueba de integración', formula: 'ACTIVOS_TOTAL', meta: 10,
    }).expect(201);
    indicadorId = nuevo.body.id;
    const ruta = `/api/v1/kpis/indicadores/${indicadorId}`;
    const vacio = await api().get(`${ruta}/historico`).auth(token, { type: 'bearer' }).expect(200);
    expect(vacio.body).toEqual([]);
    const medicion = await api().post(`${ruta}/mediciones`).auth(token, { type: 'bearer' }).expect(201);
    expect(medicion.body.valor).toBe(await prisma.activo.count());
    await api().patch(ruta).auth(token, { type: 'bearer' }).send({ nombre: 'Indicador editado',
      formula: 'RIESGOS_ABIERTOS', meta: 5, activo: false }).expect(200);
    await api().post(`${ruta}/mediciones`).auth(token, { type: 'bearer' }).expect(400);
    const historico = await api().get(`${ruta}/historico`).auth(token, { type: 'bearer' }).expect(200);
    expect(historico.body).toEqual([medicion.body]);
    const lista = await api().get('/api/v1/kpis/indicadores').auth(token, { type: 'bearer' }).expect(200);
    expect(lista.body).toEqual(expect.arrayContaining([expect.objectContaining({ id: indicadorId,
      nombre: 'Indicador editado', formula: 'RIESGOS_ABIERTOS', meta: 5, activo: false })]));
    await api().patch(ruta).auth(token, { type: 'bearer' }).send({ activo: true }).expect(200);
    await api().post(`${ruta}/mediciones`).auth(token, { type: 'bearer' }).expect(201);
    const final = await api().get(`${ruta}/historico`).auth(token, { type: 'bearer' }).expect(200);
    expect(final.body).toHaveLength(2);
    expect(final.body[0].valor).toBe(await prisma.riesgo.count({ where: { estado: 'ABIERTO' } }));
    expect(await prisma.auditEvent.count({ where: { actorUserId: usuarioId, entityType: 'MEDICION_KPI' } })).toBe(2);
  });
});
