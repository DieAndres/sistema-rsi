import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Organizaciones (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await crearAplicacionDePrueba();
  });
  afterEach(async () => {
    await app.close();
  });

  it('crea una organización', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de prueba ${Date.now()}` })
      .expect(201);

    expect(respuesta.body.id).toEqual(expect.any(String));
    expect(respuesta.body.nombre).toContain('Organización de prueba');
  });

  it('rechaza una organización sin nombre', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({})
      .expect(400);

    expect(respuesta.body.message).toBe(
      'El nombre de la organización es obligatorio',
    );
  });
});
