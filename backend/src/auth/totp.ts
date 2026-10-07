import { verifySync } from 'otplib';
// Misma configuración que el QR: SHA-1, seis dígitos, períodos de 30 segundos.
export function verificarTotp(
  secret: string | null,
  codigo: unknown,
  epoch?: number,
): boolean {
  if (!secret || typeof codigo !== 'string') {
    return false;
  }
  const token = codigo.replace(/\s/g, '');
  if (!/^[0-9]{6}$/.test(token)) {
    return false;
  }
  return verifySync({
    secret,
    token,
    algorithm: 'sha1',
    digits: 6,
    period: 30,
    epochTolerance: 30,
    ...(epoch === undefined ? {} : { epoch }),
  }).valid;
}
