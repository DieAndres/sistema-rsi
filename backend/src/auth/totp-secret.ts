import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export function validarClaveTotp(): Buffer {
  const value = process.env.TOTP_ENCRYPTION_KEY;
  if (!value || !/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new Error(
      'TOTP_ENCRYPTION_KEY debe contener 32 bytes en hexadecimal.',
    );
  }
  return Buffer.from(value, 'hex');
}

export function cifrarSemilla(secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', validarClaveTotp(), iv);
  const encrypted = Buffer.concat([
    cipher.update(secret, 'utf8'),
    cipher.final(),
  ]);
  return [
    'v1',
    iv.toString('hex'),
    cipher.getAuthTag().toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
}

export function descifrarSemilla(value: string): string {
  try {
    const parts = value.split(':');
    const [version, iv, tag, encrypted] = parts;
    if (
      parts.length !== 4 ||
      version !== 'v1' ||
      !/^[a-f0-9]{24}$/.test(iv) ||
      !/^[a-f0-9]{32}$/.test(tag) ||
      !/^(?:[a-f0-9]{2})+$/.test(encrypted)
    ) {
      throw new Error();
    }
    const decipher = createDecipheriv(
      'aes-256-gcm',
      validarClaveTotp(),
      Buffer.from(iv, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    return Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'hex')),
      decipher.final(),
    ]).toString('utf8');
  } catch {
    throw new Error(
      'No se pudo descifrar la semilla TOTP. Revisá la clave y la migración.',
    );
  }
}
