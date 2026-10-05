import { AuthService } from './auth.service';

function entorno(secret: string | null = null, confirmado = false) {
  const usuario = {
    id: 'u',
    correo: 'test@example.com',
    mfaSecret: secret,
    mfaConfirmado: confirmado,
  };
  const prisma = {
    usuario: {
      findUnique: jest.fn(async () => ({ ...usuario })),
      updateMany: jest.fn(
        async ({
          where,
          data,
        }: {
          where: { mfaSecret: string | null };
          data: { mfaSecret: string };
        }) => {
          if (usuario.mfaSecret !== where.mfaSecret) return { count: 0 };
          Object.assign(usuario, data);
          return { count: 1 };
        },
      ),
    },
  };
  return { service: new AuthService(prisma as never), usuario, prisma };
}

it('solicitudes repetidas conservan el QR pendiente', async () => {
  const { service, prisma } = entorno();
  const primero = await service.iniciarMfa('u');
  expect(await service.iniciarMfa('u')).toEqual(primero);
  expect(prisma.usuario.updateMany).toHaveBeenCalledTimes(1);
  const uri = new URL(primero.otpauthUri);
  expect(uri.searchParams.get('secret')).toBe(primero.secret);
});
it('solicitudes concurrentes obtienen el mismo secreto', async () => {
  const { service } = entorno();
  const [a, b] = await Promise.all([
    service.iniciarMfa('u'),
    service.iniciarMfa('u'),
  ]);
  expect(a.secret).toBe(b.secret);
});
it('no reemplaza un factor ya confirmado', async () => {
  const { service, prisma } = entorno('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', true);
  await expect(service.iniciarMfa('u')).rejects.toThrow('ya está activado');
  expect(prisma.usuario.updateMany).not.toHaveBeenCalled();
});
