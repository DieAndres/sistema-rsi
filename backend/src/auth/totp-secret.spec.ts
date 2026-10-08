import {
  cifrarSemilla,
  descifrarSemilla,
  validarClaveTotp,
} from './totp-secret';

const originalKey = process.env.TOTP_ENCRYPTION_KEY;
beforeEach(() => {
  process.env.TOTP_ENCRYPTION_KEY = 'ab'.repeat(32);
});
afterAll(() => {
  if (originalKey === undefined) delete process.env.TOTP_ENCRYPTION_KEY;
  else process.env.TOTP_ENCRYPTION_KEY = originalKey;
});

it('cifra con un IV distinto y recupera la semilla', () => {
  const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
  const value = cifrarSemilla(secret);
  expect(value).not.toContain(secret);
  expect(cifrarSemilla(secret)).not.toBe(value);
  expect(descifrarSemilla(value)).toBe(secret);
});

it('rechaza datos alterados, texto plano y otra clave', () => {
  const value = cifrarSemilla('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
  const parts = value.split(':');
  parts[3] = (parts[3].startsWith('00') ? '01' : '00') + parts[3].slice(2);
  expect(() => descifrarSemilla(parts.join(':'))).toThrow();
  expect(() => descifrarSemilla('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ')).toThrow();
  process.env.TOTP_ENCRYPTION_KEY = 'cd'.repeat(32);
  expect(() => descifrarSemilla(value)).toThrow();
});

it('exige una clave válida, sin usar una clave predeterminada', () => {
  delete process.env.TOTP_ENCRYPTION_KEY;
  expect(() => validarClaveTotp()).toThrow();
  process.env.TOTP_ENCRYPTION_KEY = 'invalida';
  expect(() => cifrarSemilla('secret')).toThrow();
});
