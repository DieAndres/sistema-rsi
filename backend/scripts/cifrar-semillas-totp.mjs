import 'dotenv/config';
import pg from 'pg';
import {
  cifrarSemilla,
  descifrarSemilla,
  validarClaveTotp,
} from '../dist/auth/totp-secret.js';

validarClaveTotp();
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query('BEGIN');
  const { rows } = await client.query(
    'SELECT id, "mfaSecret" FROM "Usuario" WHERE "mfaSecret" IS NOT NULL FOR UPDATE',
  );
  let count = 0;
  for (const row of rows) {
    if (row.mfaSecret.startsWith('v1:')) {
      descifrarSemilla(row.mfaSecret);
      continue;
    }
    if (!/^[A-Z2-7]+$/.test(row.mfaSecret))
      throw new Error('Se encontró una semilla con formato inválido.');
    await client.query(
      'UPDATE "Usuario" SET "mfaSecret" = $1, "actualizadoEn" = now() WHERE id = $2',
      [cifrarSemilla(row.mfaSecret), row.id],
    );
    count++;
  }
  await client.query('COMMIT');
  console.log(
    `Semillas cifradas: ${count}. Semillas existentes verificadas: ${rows.length - count}.`,
  );
} catch {
  await client.query('ROLLBACK');
  console.error(
    'Conversión cancelada sin cambios. Revisá la clave, conexión y formato de las semillas.',
  );
  process.exitCode = 1;
} finally {
  await client.end();
}
