import { createHmac } from 'node:crypto';
import { verificarTotp } from './totp';

// Secreto público de RFC 6238. Cálculo independiente de otplib.
const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
function codigo(epoch: number) {
  const contador = Buffer.alloc(8);
  contador.writeBigUInt64BE(BigInt(Math.floor(epoch / 30)));
  const digest = createHmac('sha1', '12345678901234567890')
    .update(contador)
    .digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(
    6,
    '0',
  );
}

it('verifica el vector RFC y códigos con ceros iniciales', () => {
  expect(verificarTotp(secret, '287082', 59)).toBe(true);
  expect(verificarTotp(secret, '081804', 1111111109)).toBe(true);
});
it('tolera solo los períodos adyacentes y el cambio de período durante el envío', () => {
  for (const origen of [60, 90, 120])
    expect(verificarTotp(secret, codigo(origen), 100)).toBe(true);
  for (const origen of [30, 150])
    expect(verificarTotp(secret, codigo(origen), 100)).toBe(false);
  expect(verificarTotp(secret, codigo(89), 90)).toBe(true);
});
it('normaliza espacios, rechaza formatos incorrectos y otro secreto', () => {
  expect(verificarTotp(secret, '287 082', 59)).toBe(true);
  for (const valor of [undefined, 287082, '12345', '1234567', 'abcdef'])
    expect(verificarTotp(secret, valor, 59)).toBe(false);
  expect(verificarTotp(null, '287082', 59)).toBe(false);
  expect(verificarTotp('JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP', '287082', 59)).toBe(
    false,
  );
});
