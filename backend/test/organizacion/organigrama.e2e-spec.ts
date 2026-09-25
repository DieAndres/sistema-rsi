import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from '../helpers/crear-aplicacion-de-prueba';

describe('Organigrama, procesos y RACI (e2e)', () => {
  let app: INestApplication<App>;
  let organizacionId: string;
  let unidadId: string;
  let trabajadorId: string;
  let procesoId: string;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();

    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: `Organización del organigrama ${Date.now()}` })
      .expect(201);
    organizacionId = organizacion.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('crea unidades jerárquicas y un trabajador', async () => {
    const area = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacionId}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de seguridad' })
      .expect(201);
    unidadId = area.body.id;

    const sector = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacionId}/unidades`)
      .send({
        tipo: 'SECTOR',
        nombre: 'Sector de infraestructura',
        unidadPadreId: unidadId,
      })
      .expect(201);

    expect(sector.body.unidadPadreId).toBe(unidadId);

    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${unidadId}/trabajadores`)
      .send({
        nombre: 'Responsable del área',
        cargo: 'Responsable RSI',
        correo: 'responsable@example.com',
      })
      .expect(201);
    trabajadorId = trabajador.body.id;
    await request(app.getHttpServer())
      .patch(`/api/v1/organizaciones/unidades/${unidadId}`)
      .send({ responsableId: trabajadorId })
      .expect(200);
  });

  it('rechaza un trabajador de una unidad inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post(
        '/api/v1/organizaciones/unidades/00000000-0000-0000-0000-000000000000/trabajadores',
      )
      .send({ nombre: 'Trabajador inválido', cargo: 'Analista' })
      .expect(400);

    expect(respuesta.body.message).toBe('La unidad organizativa no existe');
  });

  it('crea un proceso y una asignación RACI', async () => {
    const proceso = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacionId}/procesos`)
      .send({
        nombre: 'Gestión de incidentes',
        descripcion: 'Proceso de respuesta a incidentes',
        version: '2.0',
        estado: 'APROBADA',
        responsableId: trabajadorId,
        fechaRevision: '2026-12-01',
      })
      .expect(201);
    procesoId = proceso.body.id;
    expect(proceso.body.responsableId).toBe(trabajadorId);
    expect(proceso.body.version).toBe('2.0');
    expect(proceso.body.estado).toBe('APROBADA');

    const asignacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones/asignaciones-raci')
      .send({ procesoId, trabajadorId, tipoResponsabilidad: 'R' })
      .expect(201);

    expect(asignacion.body.procesoId).toBe(procesoId);
    expect(asignacion.body.trabajadorId).toBe(trabajadorId);
    expect(asignacion.body.tipoResponsabilidad).toBe('R');

    const mapa = await request(app.getHttpServer())
      .get(`/api/v1/organizaciones/${organizacionId}/mapa`)
      .expect(200);
    expect(mapa.body.unidades[0].responsable.id).toBe(trabajadorId);
    expect(mapa.body.procesos[0].asignacionesRaci[0].trabajador.id).toBe(
      trabajadorId,
    );
  });

  it('rechaza un proceso sin nombre', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/organizaciones/procesos')
      .send({})
      .expect(400);

    expect(respuesta.body.message).toBe('El nombre del proceso es obligatorio');
  });

  it('rechaza una asignación RACI con trabajador inexistente', async () => {
    const respuesta = await request(app.getHttpServer())
      .post('/api/v1/organizaciones/asignaciones-raci')
      .send({
        procesoId,
        trabajadorId: '00000000-0000-0000-0000-000000000000',
        tipoResponsabilidad: 'C',
      })
      .expect(400);

    expect(respuesta.body.message).toBe('El trabajador no existe');
  });
});
