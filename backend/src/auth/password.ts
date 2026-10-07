import * as argon2 from 'argon2';
import * as bcrypt from 'bcryptjs';
import { scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export type PasswordAlgorithm = 'argon2' | 'bcrypt';
export async function hashPassword(
  password: string,
  algorithm: PasswordAlgorithm,
) {
  if (algorithm === 'argon2') {
    return argon2.hash(password);
  }
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, stored: string) {
  if (stored.startsWith('$argon2')) {
    return argon2.verify(stored, password);
  }
  if (stored.startsWith('$2')) {
    return bcrypt.compare(password, stored);
  }
  // Los hashes scrypt existentes siguen funcionando hasta que esos usuarios cambien su contraseña.
  const [salt, hash] = stored.split(':');
  if (!salt || !/^[0-9a-f]{128}$/.test(hash ?? '')) {
    return false;
  }
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}
