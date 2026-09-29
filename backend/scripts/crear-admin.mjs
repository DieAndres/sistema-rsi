import 'dotenv/config';
import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import pg from 'pg';

const scrypt = promisify(scryptCallback);
const { Client } = pg;
const correo = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

if (!correo || !password || password.length < 12) {
  throw new Error(
    'Definí BOOTSTRAP_ADMIN_EMAIL y BOOTSTRAP_ADMIN_PASSWORD (mínimo 12 caracteres).',
  );
}

const cliente = new Client({ connectionString: process.env.DATABASE_URL });
await cliente.connect();

try {
  await cliente.query('BEGIN');
  const existentes = await cliente.query('SELECT COUNT(*)::int AS total FROM "Usuario"');
  if (existentes.rows[0].total > 0) {
    throw new Error('El bootstrap está bloqueado: ya existen usuarios.');
  }

  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  await cliente.query(
    'INSERT INTO "Usuario" (id, correo, "passwordHash", rol, activo, "creadoEn", "actualizadoEn") VALUES (gen_random_uuid(), $1, $2, $3, true, now(), now())',
    [correo, `${salt}:${hash.toString('hex')}`, 'ADMINISTRADOR'],
  );
  await cliente.query('COMMIT');
  console.log(`Administrador inicial creado: ${correo}`);
} catch (error) {
  await cliente.query('ROLLBACK');
  throw error;
} finally {
  await cliente.end();
}
