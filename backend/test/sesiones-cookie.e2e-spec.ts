import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { createHash } from 'node:crypto';
import { generateSecret, generateSync } from 'otplib';
import request from 'supertest';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { AuthGuard } from '../src/auth/auth.guard';
import { RolesGuard } from '../src/auth/roles.guard';
import { ReadOnlyGuard } from '../src/auth/read-only.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { hashPassword } from '../src/auth/password';
import { SESSION_COOKIE, SESSION_TTL_MS } from '../src/auth/session-http';

describe('Sesiones HTTP y origen autorizado', () => {
  let app: INestApplication;
  let service: AuthService;
  const id = '00000000-0000-4000-8000-000000000001';
  const adminId = '00000000-0000-4000-8000-000000000002';
  const users = new Map<string, Record<string, any>>();
  const sessions = new Map<string, Record<string, any>>();
  const events: any[] = [];
  const prisma: any = {
    usuario: {
      findUnique: async ({ where }: any) => {
        const user = where.id
          ? users.get(where.id)
          : [...users.values()].find((u) => u.correo === where.correo);
        return user ? { ...user } : null;
      },
      update: async ({ where, data }: any) => {
        const u = users.get(where.id)!;
        Object.assign(u, data);
        return u;
      },
      findFirst: async () => null,
    },
    trabajador: { findUnique: async () => ({ id: 'trabajador' }) },
    sesion: {
      create: async ({ data }: any) => {
        const s = { id: data.tokenHash, creadoEn: new Date(), ...data };
        sessions.set(s.tokenHash, s);
        return s;
      },
      findUnique: async ({ where }: any) => {
        const s = sessions.get(where.tokenHash);
        return s ? { ...s, usuario: users.get(s.usuarioId) } : null;
      },
      delete: async ({ where }: any) => sessions.delete(where.id),
      deleteMany: async ({ where }: any) => {
        let count = 0;
        for (const [key, s] of sessions)
          if (s.usuarioId === where.usuarioId) {
            sessions.delete(key);
            count++;
          }
        return { count };
      },
    },
    auditEvent: {
      create: async ({ data }: any) => {
        events.push(data);
        return data;
      },
    },
    $transaction: async (fn: any) => fn(prisma),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: APP_GUARD, useClass: AuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
        { provide: APP_GUARD, useClass: ReadOnlyGuard },
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    service = module.get(AuthService);
  });
  beforeEach(async () => {
    sessions.clear();
    users.clear();
    events.length = 0;
    users.set(id, {
      id,
      correo: 'lector@example.com',
      passwordHash: await hashPassword('password-de-prueba', 'argon2'),
      activo: true,
      rol: 'LECTOR',
      trabajadorId: 'trabajador',
      mfaConfirmado: false,
      trabajador: {
        unidadOrganizativaId: 'unidad',
        unidadOrganizativa: { organizacionId: 'organizacion' },
      },
    });
    users.set(adminId, {
      id: adminId,
      correo: 'admin@example.com',
      activo: true,
      rol: 'ADMINISTRADOR',
      mfaConfirmado: true,
    });
  });
  afterAll(async () => app.close());

  async function login() {
    const result = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .set('Origin', 'https://localhost:8443')
      .set('Origin', 'https://localhost:8443')
      .send({ correo: 'lector@example.com', password: 'password-de-prueba' })
      .expect(201);
    return {
      result,
      cookie: result.headers['set-cookie']
        .find((c: string) => c.startsWith(SESSION_COOKIE + '='))!
        .split(';')[0],
    };
  }

  it('entrega cookie protegida, nunca token en JSON, y autentica sin Bearer', async () => {
    const { result, cookie } = await login();
    expect(result.body.token).toBeUndefined();
    expect(result.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(result.headers['set-cookie'][0]).toContain('Secure');
    expect(result.headers['set-cookie'][0]).toContain('SameSite=Strict');
    expect(result.headers['set-cookie'][0]).toContain('Max-Age=7200');
    expect(
      [...sessions.values()][0].expiraEn.getTime() -
        [...sessions.values()][0].creadoEn.getTime(),
    ).toBeLessThanOrEqual(SESSION_TTL_MS);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .auth(cookie.split('=')[1], { type: 'bearer' })
      .expect(401);
  });

  it('mantiene el login con contraseña y TOTP y rechaza códigos incorrectos', async () => {
    const secret = generateSecret();
    Object.assign(users.get(id)!, {
      rol: 'RSI',
      mfaConfirmado: true,
      mfaSecret: secret,
    });
    const datos = {
      correo: 'lector@example.com',
      password: 'password-de-prueba',
    };
    for (const codigoMfa of [undefined, 'no-valido']) {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .set('Origin', 'https://localhost:8443')
        .send({ ...datos, codigoMfa })
        .expect(401);
    }
    const codigoMfa = generateSync({
      secret,
      algorithm: 'sha1',
      digits: 6,
      period: 30,
    });
    const result = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .set('Origin', 'https://localhost:8443')
      .send({ ...datos, codigoMfa })
      .expect(201);
    expect(result.body.usuario.mfaConfirmado).toBe(true);
    expect(result.body.mfaSetupRequired).toBe(false);
    expect(result.body.token).toBeUndefined();
  });

  it('ya no expone las rutas de registro o login de passkeys', async () => {
    for (const ruta of [
      'register/options',
      'register/verify',
      'login/options',
      'login/verify',
    ]) {
      await request(app.getHttpServer())
        .post(`/api/v1/auth/passkey/${ruta}`)
        .set('Origin', 'https://localhost:8443')
        .send({})
        .expect(404);
    }
  });

  it('rechaza login y escrituras con origen ausente, null, ajeno o similar', async () => {
    const { cookie } = await login();
    for (const origin of [
      undefined,
      'null',
      'https://evil.example',
      'https://localhost:8443.evil.example',
      'http://localhost:8443',
    ]) {
      for (const ruta of ['/api/v1/auth/login', '/api/v1/auth/logout']) {
        const req = request(app.getHttpServer())
          .post(ruta)
          .set('Cookie', cookie);
        if (origin !== undefined) req.set('Origin', origin);
        await req.send({}).expect(403);
      }
    }
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(200);
  });

  it('cierra sesión y rechaza reutilizar la cookie robada', async () => {
    const { cookie } = await login();
    const result = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', cookie)
      .set('Origin', 'https://localhost:8443')
      .expect(201);
    expect(result.headers['set-cookie'][0]).toContain(
      'Expires=Thu, 01 Jan 1970',
    );
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(401);
  });

  it('permite al lector revocar todas sus sesiones y audita sin secretos', async () => {
    const first = await login();
    const second = await login();
    await request(app.getHttpServer())
      .post('/api/v1/auth/sesiones/revocar')
      .set('Cookie', first.cookie)
      .set('Origin', 'https://localhost:8443')
      .expect(201);
    for (const cookie of [first.cookie, second.cookie])
      await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set('Cookie', cookie)
        .expect(401);
    expect(events.some((e) => e.eventType === 'SESSION_REVOKE')).toBe(true);
    expect(JSON.stringify(events)).not.toContain(first.cookie.split('=')[1]);
  });

  it('solo Administrador revoca sesiones ajenas; un cambio de rol las invalida', async () => {
    const reader = await login();
    await request(app.getHttpServer())
      .post(`/api/v1/auth/usuarios/${adminId}/sesiones/revocar`)
      .set('Cookie', reader.cookie)
      .set('Origin', 'https://localhost:8443')
      .expect(403);
    const adminCookie = `${SESSION_COOKIE}=${await service.crearSesion(adminId)}`;
    await request(app.getHttpServer())
      .post(`/api/v1/auth/usuarios/${id}/sesiones/revocar`)
      .set('Cookie', adminCookie)
      .set('Origin', 'https://localhost:8443')
      .expect(201);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', reader.cookie)
      .expect(401);
    const again = await login();
    await request(app.getHttpServer())
      .patch(`/api/v1/auth/usuarios/${id}`)
      .set('Cookie', adminCookie)
      .set('Origin', 'https://localhost:8443')
      .send({ rol: 'DUENO_UNIDAD' })
      .expect(200);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', again.cookie)
      .expect(401);
  });

  it('rechaza sesiones vencidas, incluso las antiguas creadas hace más de dos horas', async () => {
    const { cookie } = await login();
    const hash = createHash('sha256')
      .update(cookie.split('=')[1])
      .digest('hex');
    sessions.get(hash)!.creadoEn = new Date(Date.now() - SESSION_TTL_MS - 1);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(401);
    sessions.get(hash)!.creadoEn = new Date();
    sessions.get(hash)!.expiraEn = new Date(0);
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Cookie', cookie)
      .expect(401);
  });
});
