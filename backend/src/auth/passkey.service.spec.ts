import { PasskeyService } from './passkey.service';

it('consumes a challenge once and rejects expired challenges', async () => {
  const saved = new Map<string, { id: string; usuarioId: string; tipo: string; challenge: string; expiraEn: Date }>();
  saved.set('one', { id: 'one', usuarioId: 'user', tipo: 'login', challenge: 'random', expiraEn: new Date(Date.now() + 60_000) });
  saved.set('old', { id: 'old', usuarioId: 'user', tipo: 'login', challenge: 'random', expiraEn: new Date(0) });
  const prisma = { passkeyChallenge: {
    findUnique: async ({ where }: { where: { id: string } }) => saved.get(where.id) ?? null,
    delete: async ({ where }: { where: { id: string } }) => { saved.delete(where.id); },
  } };
  const service = new PasskeyService(prisma as never, {} as never);
  await expect(service['takeChallenge']('one', 'user', 'login')).resolves.toMatchObject({ challenge: 'random' });
  await expect(service['takeChallenge']('one', 'user', 'login')).rejects.toThrow();
  await expect(service['takeChallenge']('old', 'user', 'login')).rejects.toThrow();
});
