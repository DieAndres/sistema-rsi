import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/kpis/resumen (GET)', async () => {
    const respuesta = await request(app.getHttpServer())
      .get('/kpis/resumen')
      .expect(200);

    expect(respuesta.body.activos).toEqual(
      expect.objectContaining({
        total: expect.any(Number),
        conResponsable: expect.any(Number),
        porcentajeConResponsable: expect.any(Number),
      }),
    );
    expect(respuesta.body.riesgos.abiertos).toEqual(expect.any(Number));
    expect(respuesta.body.vulnerabilidades.abiertas).toEqual(
      expect.any(Number),
    );
    expect(respuesta.body.vulnerabilidades.criticas).toEqual(
      expect.any(Number),
    );
    expect(respuesta.body.incidentes).toBeDefined();
  });

  afterEach(async () => {
    await app.close();
  });
});
