import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Activos (e2e)', () => {
  let app: INestApplication<App>;
  let unidadId: string;
  let otraUnidadId: string;
  let unidadHijaId: string;
  let responsableId: string;
  let responsableDeUnidadHijaId: string;
  let responsableDeOtraUnidadId: string;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();

    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de activos ${Date.now()}` })
      .expect(201);

    const primeraUnidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de activos' })
      .expect(201);

    const segundaUnidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({ tipo: 'SECTOR', nombre: 'Sector externo' })
      .expect(201);

    const unidadHija = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({
        tipo: 'SECTOR',
        nombre: 'Sector dependiente',
        unidadPadreId: primeraUnidad.body.id,
      })
      .expect(201);

    unidadId = primeraUnidad.body.id;
    otraUnidadId = segundaUnidad.body.id;
    unidadHijaId = unidadHija.body.id;

    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidadId}/trabajadores`)
      .send({ nombre: 'Responsable principal', cargo: 'Analista' })
      .expect(201);

    const otroTrabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${otraUnidadId}/trabajadores`)
      .send({ nombre: 'Responsable externo', cargo: 'Supervisor' })
      .expect(201);

    responsableId = trabajador.body.id;
    responsableDeOtraUnidadId = otroTrabajador.body.id;

    const trabajadorHijo = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidadHijaId}/trabajadores`)
      .send({ nombre: 'Responsable del sector', cargo: 'Técnico' })
      .expect(201);
    responsableDeUnidadHijaId = trabajadorHijo.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('crea un activo con responsable de la misma unidad', async () => {
    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidadHijaId}/activos`)
      .send({
        nombre: 'Servidor principal',
        tipo: 'HW',
        criticidad: 'ALTA',
        clasificacion: 'INTERNO',
        responsableId: responsableDeUnidadHijaId,
      })
      .expect(201);

    expect(respuesta.body.unidadOrganizativaId).toBe(unidadHijaId);
    expect(respuesta.body.responsableId).toBe(responsableDeUnidadHijaId);

    const activosDelArbol = await request(app.getHttpServer())
      .get(`/api/v1/seguridad/activos?unidadId=${unidadId}`)
      .expect(200);
    expect(activosDelArbol.body.map((activo) => activo.id)).toContain(
      respuesta.body.id,
    );
  });

  it('rechaza un activo con unidad inexistente', async () => {
    await request(app.getHttpServer())
      .post(
        '/api/v1/seguridad/unidades/00000000-0000-0000-0000-000000000000/activos',
      )
      .send({ nombre: 'Activo inválido', tipo: 'SW' })
      .expect(400);
  });

  it('rechaza un activo con responsable inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidadId}/activos`)
      .send({
        nombre: 'Activo inválido',
        tipo: 'SW',
        clasificacion: 'INTERNO',
        responsableId: '00000000-0000-0000-0000-000000000000',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El responsable no existe');
  });

  it('rechaza un responsable de otra unidad', async () => {
    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidadId}/activos`)
      .send({
        nombre: 'Activo inválido',
        tipo: 'DATO',
        clasificacion: 'INTERNO',
        responsableId: responsableDeOtraUnidadId,
      })
      .expect(400);

    expect(respuesta.body.message).toBe(
      'El responsable debe pertenecer a la unidad organizativa del activo',
    );
  });
});
