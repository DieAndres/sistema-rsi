import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Vulnerabilidades (e2e)', () => {
  let app: INestApplication<App>;
  let activoId: string;
  let responsableId: string;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de vulnerabilidades ${Date.now()}` })
      .expect(201);
    const unidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de seguridad' })
      .expect(201);
    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidad.body.id}/trabajadores`)
      .send({ nombre: 'Responsable de seguridad', cargo: 'Analista' })
      .expect(201);
    const activo = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidad.body.id}/activos`)
      .send({
        nombre: 'Servidor vulnerable',
        tipo: 'HW',
        responsableId: trabajador.body.id,
      })
      .expect(201);
    activoId = activo.body.id;
    responsableId = trabajador.body.id;
  });

  afterAll(async () => app.close());

  it('crea una vulnerabilidad asociada a un activo', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/vulnerabilidades')
      .send({
        activoId,
        responsableId,
        nombre: 'Software desactualizado',
        cvss: 7.5,
        sla: 30,
        planRemediacion: 'Actualizar el software y verificar el parche',
      })
      .expect(201);

    expect(respuesta.body.activoId).toBe(activoId);
    expect(respuesta.body.responsableId).toBe(responsableId);
    expect(respuesta.body.sla).toBe(30);
    expect(respuesta.body.planRemediacion).toBe(
      'Actualizar el software y verificar el parche',
    );
  });

  it('rechaza una vulnerabilidad con activo inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/vulnerabilidades')
      .send({
        activoId: '00000000-0000-0000-0000-000000000000',
        nombre: 'Vulnerabilidad inválida',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El activo no existe');
  });

  it('rechaza una vulnerabilidad sin nombre', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/vulnerabilidades')
      .send({ activoId })
      .expect(400);

    expect(respuesta.body.message).toBe('El nombre es obligatorio');
  });

  it('rechaza una vulnerabilidad con SLA inválido', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/vulnerabilidades')
      .send({
        activoId,
        nombre: 'Vulnerabilidad con SLA inválido',
        sla: -1,
      })
      .expect(400);

    expect(respuesta.body.message).toBe(
      'El SLA debe ser un número entero mayor o igual a cero',
    );
  });
});
