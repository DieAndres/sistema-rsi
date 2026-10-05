import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { verificarTotp } from './totp';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

const origin = process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:5173';
const rpID = new URL(origin).hostname;

@Injectable()
export class PasskeyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  async registroOpciones(usuarioId: string) {
    const user = await this.prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!user || !user.activo) throw new UnauthorizedException();
    const existing = await this.prisma.passkey.findMany({ where: { usuarioId } });
    const options = await generateRegistrationOptions({
      rpName: 'Sistema RSI', rpID, userName: user.correo,
      userDisplayName: user.correo, userID: new TextEncoder().encode(user.id),
      attestationType: 'none',
      excludeCredentials: existing.map((key) => ({ id: key.id })),
      authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
    });
    const challenge = await this.prisma.passkeyChallenge.create({
      data: { usuarioId, challenge: options.challenge, tipo: 'registro', expiraEn: new Date(Date.now() + 5 * 60_000) },
    });
    return { challengeId: challenge.id, options };
  }

  async registrar(usuarioId: string, challengeId: string, response: RegistrationResponseJSON) {
    if (!response || typeof response !== 'object') throw new BadRequestException('Respuesta WebAuthn inválida.');
    const challenge = await this.takeChallenge(challengeId, usuarioId, 'registro');
    try {
      const result = await verifyRegistrationResponse({
        response, expectedChallenge: challenge.challenge, expectedOrigin: origin,
        expectedRPID: rpID, requireUserVerification: false,
      });
      if (!result.verified) throw new Error('Verification failed');
      const credential = result.registrationInfo.credential;
      await this.prisma.passkey.create({ data: {
        id: credential.id, usuarioId, publicKey: Buffer.from(credential.publicKey),
        counter: credential.counter, transports: JSON.stringify(response.response.transports ?? []),
      } });
      await this.auth.auditarPasskey('PASSKEY_REGISTER', usuarioId, 'EXITOSO');
      return { mensaje: 'Passkey registrada.' };
    } catch {
      throw new BadRequestException('No se pudo verificar la passkey.');
    }
  }

  async loginOpciones(correo: string) {
    if (typeof correo !== 'string' || correo.length > 320) throw new BadRequestException('Correo inválido.');
    const user = await this.prisma.usuario.findUnique({ where: { correo: correo?.trim().toLowerCase() } });
    const keys = user?.activo ? await this.prisma.passkey.findMany({ where: { usuarioId: user.id } }) : [];
    if (!user || keys.length === 0) throw new UnauthorizedException('No hay passkey disponible para esta cuenta.');
    const options = await generateAuthenticationOptions({
      rpID, allowCredentials: keys.map((key) => ({ id: key.id,
        transports: JSON.parse(key.transports ?? '[]') as string[] })),
      userVerification: 'preferred',
    });
    const challenge = await this.prisma.passkeyChallenge.create({
      data: { usuarioId: user.id, challenge: options.challenge, tipo: 'login', expiraEn: new Date(Date.now() + 5 * 60_000) },
    });
    return { challengeId: challenge.id, options };
  }

  async login(challengeId: string, response: AuthenticationResponseJSON, codigoMfa?: string) {
    if (!response || typeof response !== 'object') throw new BadRequestException('Respuesta WebAuthn inválida.');
    const challenge = await this.takeChallenge(challengeId, undefined, 'login');
    const user = await this.prisma.usuario.findUnique({ where: { id: challenge.usuarioId } });
    const key = await this.prisma.passkey.findUnique({ where: { id: response?.id } });
    if (!user?.activo || !key || key.usuarioId !== user.id) throw new UnauthorizedException('Passkey inválida.');
    try {
      const result = await verifyAuthenticationResponse({
        response, expectedChallenge: challenge.challenge, expectedOrigin: origin,
        expectedRPID: rpID,
        credential: { id: key.id, publicKey: new Uint8Array(key.publicKey), counter: key.counter,
          transports: JSON.parse(key.transports ?? '[]') as string[] },
        requireUserVerification: false,
      });
      if (!result.verified) throw new Error('Verification failed');
      // Una llave U2F antigua sin verificación de usuario solo sirve como segundo factor.
      if (!result.authenticationInfo.userVerified &&
        !verificarTotp(user.mfaSecret, codigoMfa))
        throw new UnauthorizedException('Se requiere el código TOTP con esta llave.');
      await this.prisma.passkey.update({ where: { id: key.id }, data: { counter: result.authenticationInfo.newCounter } });
      const token = await this.auth.crearSesion(user.id);
      await this.auth.auditarPasskey('PASSKEY_LOGIN', user.id, 'EXITOSO');
      return { token, usuario: await this.auth.obtenerPorToken(token), mfaSetupRequired: ['ADMINISTRADOR', 'RSI'].includes(user.rol) && !user.mfaConfirmado };
    } catch (error) {
      await this.auth.auditarPasskey('PASSKEY_LOGIN', user.id, 'FALLIDO');
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Passkey inválida.');
    }
  }

  private async takeChallenge(id: string, userId: string | undefined, tipo: string) {
    if (!id || typeof id !== 'string') throw new BadRequestException('Desafío inválido.');
    const challenge = await this.prisma.passkeyChallenge.findUnique({ where: { id } });
    if (!challenge || challenge.tipo !== tipo || challenge.expiraEn <= new Date() ||
      (userId && challenge.usuarioId !== userId)) throw new BadRequestException('Desafío vencido o inválido.');
    await this.prisma.passkeyChallenge.delete({ where: { id } });
    return challenge;
  }
}
