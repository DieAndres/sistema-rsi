import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Riesgos (e2e)', () => {
  let app: INestApplication<App>;
  let activoId: string;
  let responsableId: string;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();

    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de riesgos ${Date.now()}` })
      .expect(201);

    const unidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de riesgos' })
      .expect(201);

    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidad.body.id}/trabajadores`)
      .send({ nombre: 'Responsable de riesgos', cargo: 'Analista' })
      .expect(201);

    const activo = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidad.body.id}/activos`)
      .send({
        nombre: 'Servidor de riesgos',
        tipo: 'HW',
        responsableId: trabajador.body.id,
      })
      .expect(201);

    activoId = activo.body.id;
    responsableId = trabajador.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('crea un riesgo asociado a un activo existente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/riesgos')
      .send({
        activoId,
        responsableId,
        nombre: 'Interrupción del servicio',
        probabilidad: 'MEDIA',
        impacto: 'ALTO',
      })
      .expect(201);

    expect(respuesta.body.activoId).toBe(activoId);
    expect(respuesta.body.responsableId).toBe(responsableId);
  });

  it('rechaza un riesgo con activo inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/riesgos')
      .send({
        activoId: '00000000-0000-0000-0000-000000000000',
        nombre: 'Riesgo inválido',
        probabilidad: 'BAJA',
        impacto: 'BAJO',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El activo no existe');
  });

  it('rechaza un riesgo con responsable inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/riesgos')
      .send({
        activoId,
        responsableId: '00000000-0000-0000-0000-000000000000',
        nombre: 'Riesgo inválido',
        probabilidad: 'BAJA',
        impacto: 'BAJO',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El responsable no existe');
  });

  it('rechaza un riesgo sin datos obligatorios', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/riesgos')
      .send({ activoId })
      .expect(400);

    expect(respuesta.body.message).toBe(
      'Nombre, probabilidad e impacto son obligatorios',
    );
  });
});
