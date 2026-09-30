import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { hashPassword, verifyPassword } from './password';

const scrypt = promisify(scryptCallback);

it('verifies both new algorithms and existing scrypt hashes', async () => {
  const password = 'contraseña-larga-123';
  for (const algorithm of ['argon2', 'bcrypt'] as const) {
    const hash = await hashPassword(password, algorithm);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('incorrecta', hash)).toBe(false);
  }
  const salt = randomBytes(16).toString('hex');
  const legacy = `${salt}:${((await scrypt(password, salt, 64)) as Buffer).toString('hex')}`;
  expect(await verifyPassword(password, legacy)).toBe(true);
  expect(await verifyPassword('incorrecta', legacy)).toBe(false);
});
