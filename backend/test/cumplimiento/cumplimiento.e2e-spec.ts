import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Cumplimiento (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await crearAplicacionDePrueba();
  });
  afterEach(async () => {
    await app.close();
  });

  it('crea una política y un procedimiento relacionado', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización documental ${Date.now()}` })
      .expect(201);

    const politica = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/politicas/${organizacion.body.id}`)
      .send({ titulo: 'Política de prueba' })
      .expect(201);

    const procedimiento = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/procedimientos/${organizacion.body.id}`)
      .send({ politicaId: politica.body.id, nombre: 'Procedimiento de prueba' })
      .expect(201);

    expect(procedimiento.body.politicaId).toBe(politica.body.id);
  });

  it('rechaza relaciones inexistentes', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización inválida ${Date.now()}` })
      .expect(201);

    const procedimiento = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/procedimientos/${organizacion.body.id}`)
      .send({
        politicaId: '00000000-0000-0000-0000-000000000000',
        nombre: 'Procedimiento inválido',
      })
      .expect(400);

    expect(procedimiento.body.message).toBe(
      'La política no pertenece a la organización',
    );
  });

  it('rechaza una política sin título', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización sin política ${Date.now()}` })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/politicas/${organizacion.body.id}`)
      .send({})
      .expect(400);

    expect(respuesta.body.message).toBe('El título es obligatorio');
  });

  it('rechaza un procedimiento sin nombre', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización sin procedimiento ${Date.now()}` })
      .expect(201);

    const politica = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/politicas/${organizacion.body.id}`)
      .send({ titulo: 'Política base' })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/procedimientos/${organizacion.body.id}`)
      .send({ politicaId: politica.body.id })
      .expect(400);

    expect(respuesta.body.message).toBe('El nombre es obligatorio');
  });

  it('rechaza un plan con un riesgo inexistente', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de plan ${Date.now()}` })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/planes/${organizacion.body.id}`)
      .send({
        nombre: 'Plan inválido',
        tipo: 'TRATAMIENTO',
        riesgoId: '00000000-0000-0000-0000-000000000000',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El riesgo asociado no existe');
  });

  it('rechaza una evidencia con un incidente inexistente', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de evidencia ${Date.now()}` })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/evidencias/${organizacion.body.id}`)
      .send({
        nombre: 'Evidencia inválida',
        tipo: 'REGISTRO',
        incidenteId: '00000000-0000-0000-0000-000000000000',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El incidente asociado no existe');
  });

  it('rechaza un plan con riesgo de otra organización', async () => {
    const organizacionA = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización A ${Date.now()}` })
      .expect(201);
    const organizacionB = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización B ${Date.now()}` })
      .expect(201);
    const unidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacionB.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de riesgos' })
      .expect(201);
    const activo = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${unidad.body.id}/activos`)
      .send({ nombre: 'Activo de B', tipo: 'HW' })
      .expect(201);
    const riesgo = await request(app.getHttpServer())
      .post('/api/v1/seguridad/riesgos')
      .send({
        activoId: activo.body.id,
        nombre: 'Riesgo de B',
        probabilidad: 'MEDIA',
        impacto: 'ALTO',
      })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/planes/${organizacionA.body.id}`)
      .send({
        nombre: 'Plan inválido',
        tipo: 'TRATAMIENTO',
        riesgoId: riesgo.body.id,
      })
      .expect(400);

    expect(respuesta.body.message).toBe(
      'El riesgo asociado no pertenece a la organización',
    );
  });

  it('rechaza una evidencia con política de otra organización', async () => {
    const organizacionA = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización evidencia A ${Date.now()}` })
      .expect(201);
    const organizacionB = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización evidencia B ${Date.now()}` })
      .expect(201);
    const politica = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/politicas/${organizacionB.body.id}`)
      .send({ titulo: 'Política de B' })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/evidencias/${organizacionA.body.id}`)
      .send({
        nombre: 'Evidencia inválida',
        tipo: 'REGISTRO',
        politicaId: politica.body.id,
      })
      .expect(400);

    expect(respuesta.body.message).toBe(
      'La política asociada no pertenece a la organización',
    );
  });

  it('rechaza un plan con fecha inválida', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización fecha inválida ${Date.now()}` })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/planes/${organizacion.body.id}`)
      .send({
        nombre: 'Plan inválido',
        tipo: 'TRATAMIENTO',
        fechaInicio: 'no-es-una-fecha',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('La fecha de inicio no es válida');
  });

  it('rechaza una evidencia con responsable de otra organización', async () => {
    const organizacionA = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización responsable A ${Date.now()}` })
      .expect(201);
    const organizacionB = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización responsable B ${Date.now()}` })
      .expect(201);
    const unidad = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacionB.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de B' })
      .expect(201);
    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidad.body.id}/trabajadores`)
      .send({ nombre: 'Responsable de B', cargo: 'Analista' })
      .expect(201);

    const respuesta = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/evidencias/${organizacionA.body.id}`)
      .send({
        nombre: 'Evidencia inválida',
        tipo: 'REGISTRO',
        responsableId: trabajador.body.id,
      })
      .expect(400);

    expect(respuesta.body.message).toBe(
      'El responsable no pertenece a la organización',
    );
  });
});
