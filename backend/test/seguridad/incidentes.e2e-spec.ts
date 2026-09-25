import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Incidentes (e2e)', () => {
  let app: INestApplication<App>;
  let activoId: string;
  let responsableId: string;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de incidentes ${Date.now()}` })
      .expect(201);
    const unidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de incidentes' })
      .expect(201);
    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidad.body.id}/trabajadores`)
      .send({ nombre: 'Responsable de incidentes', cargo: 'Coordinador' })
      .expect(201);
    const activo = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidad.body.id}/activos`)
      .send({
        nombre: 'Servidor afectado',
        tipo: 'HW',
        clasificacion: 'INTERNO',
        responsableId: trabajador.body.id,
      })
      .expect(201);
    activoId = activo.body.id;
    responsableId = trabajador.body.id;
  });

  afterAll(async () => app.close());

  it('crea un incidente asociado a un activo', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/incidentes')
      .send({
        activoId,
        responsableId,
        titulo: 'Interrupción del servicio',
        severidad: 'ALTA',
        estado: 'RECUPERADO',
        leccionesAprendidas: 'Mejorar el monitoreo del servicio',
      })
      .expect(201);

    expect(respuesta.body.activoId).toBe(activoId);
    expect(respuesta.body.responsableId).toBe(responsableId);
    expect(respuesta.body.estado).toBe('RECUPERADO');
    expect(respuesta.body.leccionesAprendidas).toBe(
      'Mejorar el monitoreo del servicio',
    );
  });

  it('rechaza un incidente con activo inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/incidentes')
      .send({
        activoId: '00000000-0000-0000-0000-000000000000',
        titulo: 'Incidente inválido',
        severidad: 'BAJA',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El activo no existe');
  });

  it('rechaza un incidente sin título ni severidad', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/seguridad/incidentes')
      .send({ activoId })
      .expect(400);

    expect(respuesta.body.message).toBe('Título y severidad son obligatorios');
  });
});
