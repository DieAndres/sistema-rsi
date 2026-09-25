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
      .send({
        titulo: 'Política de prueba',
        version: '2.1',
        estado: 'APROBADA',
        fechaRevision: '2026-12-01',
      })
      .expect(201);

    const procedimiento = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/procedimientos/${organizacion.body.id}`)
      .send({
        politicaId: politica.body.id,
        nombre: 'Procedimiento de prueba',
        version: '1.2',
        estado: 'APROBADA',
        fechaRevision: '2026-12-01',
      })
      .expect(201);

    expect(procedimiento.body.politicaId).toBe(politica.body.id);
    expect(procedimiento.body.estado).toBe('APROBADA');
    expect(procedimiento.body.fechaRevision).toContain('2026-12-01');
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

  it('crea hitos con fecha y estado asociados a un plan', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización de hitos ${Date.now()}` })
      .expect(201);
    const plan = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/planes/${organizacion.body.id}`)
      .send({ nombre: 'Plan anual', tipo: 'ANUAL' })
      .expect(201);
    const hito = await request(app.getHttpServer())
      .post(`/api/v1/cumplimiento/planes/${plan.body.id}/hitos`)
      .send({
        nombre: 'Revisión trimestral',
        fechaObjetivo: '2026-12-01',
        estado: 'EN_CURSO',
      })
      .expect(201);

    expect(hito.body.planId).toBe(plan.body.id);
    expect(hito.body.estado).toBe('EN_CURSO');
    expect(hito.body.fechaObjetivo).toContain('2026-12-01');
    const planConsultado = await request(app.getHttpServer())
      .get(`/api/v1/cumplimiento/planes/${plan.body.id}`)
      .expect(200);
    expect(planConsultado.body.hitos).toHaveLength(1);

    const hitoActualizado = await request(app.getHttpServer())
      .patch(`/api/v1/cumplimiento/hitos/${hito.body.id}`)
      .send({ estado: 'COMPLETADO' })
      .expect(200);
    expect(hitoActualizado.body.estado).toBe('COMPLETADO');

    await request(app.getHttpServer())
      .delete(`/api/v1/cumplimiento/hitos/${hito.body.id}`)
      .expect(200);
    const hitosRestantes = await request(app.getHttpServer())
      .get(`/api/v1/cumplimiento/planes/${plan.body.id}/hitos`)
      .expect(200);
    expect(hitosRestantes.body).toHaveLength(0);
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
      .send({ nombre: 'Activo de B', tipo: 'HW', clasificacion: 'INTERNO' })
      .expect(201);
    const riesgo = await request(app.getHttpServer())
      .post('/api/v1/seguridad/riesgos')
      .send({
        activoId: activo.body.id,
        nombre: 'Riesgo de B',
        probabilidad: 3,
        impacto: 4,
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
