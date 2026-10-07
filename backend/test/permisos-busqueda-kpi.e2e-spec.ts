import { sessionHeaders } from './helpers/session-headers';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import { AuthGuard } from '../src/auth/auth.guard';
import { AuthService } from '../src/auth/auth.service';
import { RolesGuard } from '../src/auth/roles.guard';
import { BusquedaController } from '../src/busqueda/busqueda.controller';
import { BusquedaService } from '../src/busqueda/busqueda.service';
import { KpiController } from '../src/kpi/kpi.controller';
import { KpiService } from '../src/kpi/kpi.service';

const roleTokens = new Map(['ADMINISTRADOR', 'RSI', 'DUENO_UNIDAD', 'LECTOR'].map(rol => [Buffer.from(rol.padEnd(32, ' ')).toString('hex'), rol]));
const tokenForRole = (rol: string) => [...roleTokens].find(([, value]) => value === rol)![0];

describe('Permisos de búsqueda y KPI', () => {
  let app: INestApplication;
  // Se prueba la autorización HTTP real; identidad y datos se sustituyen sin tocar PostgreSQL.
  const consultar = jest.fn(() => ({}));
  const rutas = [
    ['get', '/busqueda'], ['get', '/kpis/resumen'], ['get', '/kpis/formulas'],
    ['get', '/kpis/indicadores'], ['post', '/kpis/indicadores'],
    ['patch', '/kpis/indicadores/prueba'], ['post', '/kpis/indicadores/prueba/mediciones'],
    ['get', '/kpis/indicadores/prueba/historico'],
  ] as const;

  beforeAll(async () => {
    const modulo = await Test.createTestingModule({
      controllers: [BusquedaController, KpiController],
      providers: [
        { provide: AuthService, useValue: { obtenerPorToken: (token: string) => ({ id: 'prueba', rol: roleTokens.get(token), mfaConfirmado: true }) } },
        { provide: BusquedaService, useValue: { buscar: consultar } },
        { provide: KpiService, useValue: Object.fromEntries([
          'resumen', 'listarFormulas', 'listarIndicadores', 'crearIndicador',
          'actualizarIndicador', 'registrarMedicion', 'consultarHistorico',
        ].map(metodo => [metodo, consultar])) },
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
      ],
    }).compile();
    app = modulo.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => app.close());

  it('permite todas las rutas a Administrador y RSI', async () => {
    for (const rol of ['ADMINISTRADOR', 'RSI']) {
      for (const [metodo, ruta] of rutas) {
        await request(app.getHttpServer())[metodo](`/api/v1${ruta}`)
          .set(sessionHeaders(tokenForRole(rol))).send({})
          .expect(metodo === 'post' ? 201 : 200);
      }
    }
  });

  it('rechaza dueño de unidad y lector sin ejecutar consultas ni modificaciones', async () => {
    consultar.mockClear();
    for (const rol of ['DUENO_UNIDAD', 'LECTOR']) {
      for (const [metodo, ruta] of rutas) {
        await request(app.getHttpServer())[metodo](`/api/v1${ruta}`)
          .set(sessionHeaders(tokenForRole(rol))).send({}).expect(403);
      }
    }
    expect(consultar).not.toHaveBeenCalled();
  });

  it('exige autenticación', async () => {
    for (const [metodo, ruta] of rutas) {
      await request(app.getHttpServer())[metodo](`/api/v1${ruta}`).set(sessionHeaders('a'.repeat(64), true)).send({}).expect(401);
    }
  });
});
