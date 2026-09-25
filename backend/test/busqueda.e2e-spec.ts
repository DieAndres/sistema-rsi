import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { crearAplicacionDePrueba } from './helpers/crear-aplicacion-de-prueba';

describe('Búsqueda global (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await crearAplicacionDePrueba();
  });

  afterAll(async () => {
    await app.close();
  });

  it('busca entidades y aplica filtros por unidad, estado y severidad', async () => {
    const organizacion = await request(app.getHttpServer())
      .post('/api/v1/organizaciones')
      .send({ nombre: 'Organización de búsqueda' })
      .expect(201);
    const area = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({ tipo: 'AREA', nombre: 'Área de búsqueda' })
      .expect(201);
    const sector = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/${organizacion.body.id}/unidades`)
      .send({
        tipo: 'SECTOR',
        nombre: 'Sector de búsqueda',
        unidadPadreId: area.body.id,
      })
      .expect(201);
    const trabajador = await request(app.getHttpServer())
      .post(`/api/v1/organizaciones/unidades/${sector.body.id}/trabajadores`)
      .send({ nombre: 'Persona de búsqueda', cargo: 'Analista' })
      .expect(201);
    const activo = await request(app.getHttpServer())
      .post(`/api/v1/seguridad/unidades/${sector.body.id}/activos`)
      .send({
        nombre: 'Servidor hallazgo demo',
        tipo: 'HW',
        clasificacion: 'INTERNO',
        responsableId: trabajador.body.id,
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/v1/seguridad/incidentes')
      .send({
        activoId: activo.body.id,
        titulo: 'Incidente de búsqueda demo',
        severidad: 'ALTA',
      })
      .expect(201);

    const resultados = await request(app.getHttpServer())
      .get('/api/v1/busqueda')
      .query({
        q: 'demo',
        unidadId: area.body.id,
        estado: 'ABIERTO',
        severidad: 'ALTA',
      })
      .expect(200);

    expect(resultados.body.activos.map(({ id }) => id)).toContain(
      activo.body.id,
    );
    expect(resultados.body.incidentes).toHaveLength(1);
    expect(resultados.body.incidentes[0].severidad).toBe('ALTA');
  });
});
