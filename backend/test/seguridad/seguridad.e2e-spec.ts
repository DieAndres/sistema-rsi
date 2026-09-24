import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Seguridad (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await crearAplicacionDePrueba();
  });
  afterEach(async () => {
    await app.close();
  });

  it('rechaza una vulnerabilidad con un activo inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/vulnerabilidades')
      .send({
        activoId: '00000000-0000-0000-0000-000000000000',
        nombre: 'Vulnerabilidad de prueba',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El activo no existe');
  });
});
