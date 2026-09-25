import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../../src/prisma/prisma.service';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('KPI configurables (e2e)', () => {
  let app: INestApplication<App>;
  const ids: string[] = [];

  async function crearIndicador(formula = 'ACTIVOS_TOTAL') {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/kpis/indicadores')
      .send({
        codigo: `TEST_${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`,
        nombre: 'Indicador de prueba',
        formula,
        meta: 10,
      })
      .expect(201);

    ids.push(respuesta.body.id);
    return respuesta.body;
  }

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
  });

  afterAll(async () => {
    if (ids.length) {
      await app.get(PrismaService).indicadorKpi.deleteMany({
        where: { id: { in: ids } },
      });
    }
    await app.close();
  });

  it('expone el catálogo de fórmulas disponibles', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/kpis/formulas')
      .expect(200);

    expect(respuesta.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          codigo: 'ACTIVOS_TOTAL',
          unidad: 'CANTIDAD',
        }),
        expect.objectContaining({
          codigo: 'ACTIVOS_CON_RESPONSABLE_PORCENTAJE',
          unidad: 'PORCENTAJE',
        }),
      ]),
    );
  });

  it('rechaza fórmulas no permitidas', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/kpis/indicadores')
      .send({
        codigo: 'TEST_FORMULA_INVALIDA',
        nombre: 'Prueba',
        formula: '1+1',
        meta: 1,
      })
      .expect(400);
  });

  it('calcula y registra mediciones para todas las fórmulas disponibles', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/api/v1/kpis/formulas')
      .expect(200);

    for (const formula of respuesta.body) {
      const indicador = await crearIndicador(formula.codigo);
      const medicion = await request(app.getHttpServer())
        .post(`/api/v1/kpis/indicadores/${indicador.id}/mediciones`)
        .expect(201);

      expect(Number.isFinite(medicion.body.valor)).toBe(true);
    }
  });

  it('configura la meta, registra una medición calculada y consulta el histórico', async () => {
    const indicador = await crearIndicador();

    await request(app.getHttpServer())
      .patch(`/api/v1/kpis/indicadores/${indicador.id}`)
      .send({ meta: 25 })
      .expect(200)
      .expect(({ body }) => expect(body.meta).toBe(25));

    const medicion = await request(app.getHttpServer())
      .post(`/api/v1/kpis/indicadores/${indicador.id}/mediciones`)
      .expect(201);

    expect(medicion.body.valor).toEqual(expect.any(Number));
    expect(medicion.body.fechaRegistro).toEqual(expect.any(String));

    const historico = await request(app.getHttpServer())
      .get(`/api/v1/kpis/indicadores/${indicador.id}/historico`)
      .expect(200);

    expect(historico.body).toHaveLength(1);
    expect(historico.body[0].id).toBe(medicion.body.id);
  });

  it('no registra mediciones para indicadores inactivos', async () => {
    const indicador = await crearIndicador();

    await request(app.getHttpServer())
      .patch(`/api/v1/kpis/indicadores/${indicador.id}`)
      .send({ activo: false })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/api/v1/kpis/indicadores/${indicador.id}/mediciones`)
      .expect(400);
  });
});
