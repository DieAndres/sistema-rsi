import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { generateSecret, generateURI, verifySync } from 'otplib';
import { hashPassword, verifyPassword } from './password';

const ROLES = new Set(['ADMINISTRADOR', 'RSI', 'DUENO_UNIDAD', 'LECTOR']);
const ROLES_CON_TRABAJADOR = new Set(['DUENO_UNIDAD', 'LECTOR']);

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(datos: CrearUsuarioDto) {
    const correo = datos.correo?.trim().toLowerCase();
    if (!correo || !/^\S+@\S+\.\S+$/.test(correo))
      throw new UnauthorizedException('El correo no es válido.');
    this.validarPassword(datos.password);
    const rol = datos.rol ?? 'LECTOR';
    if (!ROLES.has(rol))
      throw new UnauthorizedException('El rol no es válido.');
    await this.validarRelacionTrabajador(rol, datos.trabajadorId);
    await this.validarTrabajadorSinUsuario(datos.trabajadorId);
    const algoritmo = datos.algoritmo ?? 'argon2';
    if (!['argon2', 'bcrypt'].includes(algoritmo))
      throw new BadRequestException('Algoritmo de contraseña no válido.');
    if (algoritmo === 'bcrypt' && Buffer.byteLength(datos.password, 'utf8') > 72)
      throw new BadRequestException('bcrypt admite hasta 72 bytes por contraseña.');
    return this.prisma.usuario.create({
      data: {
        correo,
        passwordHash: await hashPassword(datos.password, algoritmo),
        rol,
        trabajadorId: datos.trabajadorId,
      },
      select: {
        id: true,
        correo: true,
        rol: true,
        activo: true,
        trabajadorId: true,
      },
    });
  }

  async login(datos: LoginDto) {
    if (typeof datos?.correo !== 'string' || typeof datos?.password !== 'string' ||
      datos.correo.length > 320 || datos.password.length > 1024)
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: datos.correo?.trim().toLowerCase() },
    });
    if (
      !usuario ||
      !usuario.activo ||
      !(await verifyPassword(datos.password, usuario.passwordHash))
    ) {
      await this.registrarAuditoria('LOGIN', null, datos.correo, 'FALLIDO');
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
    const mfaObligatorio = ['ADMINISTRADOR', 'RSI'].includes(usuario.rol);
    if (usuario.mfaConfirmado) {
      if (
        !datos.codigoMfa ||
        !usuario.mfaSecret ||
        !verifySync({ token: datos.codigoMfa, secret: usuario.mfaSecret }).valid
      ) {
        await this.registrarAuditoria(
          'MFA_FAILURE',
          usuario.id,
          usuario.correo,
          'FALLIDO',
        );
        throw new UnauthorizedException(
          'El código MFA es obligatorio o inválido.',
        );
      }
    }
    const token = await this.crearSesion(usuario.id);
    await this.registrarAuditoria(
      'LOGIN',
      usuario.id,
      usuario.correo,
      'EXITOSO',
    );
    return {
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
        trabajadorId: usuario.trabajadorId,
        mfaConfirmado: usuario.mfaConfirmado,
      },
      mfaSetupRequired: mfaObligatorio && !usuario.mfaConfirmado,
    };
  }

  async iniciarMfa(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado.');
    const secret = generateSecret();
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { mfaSecret: secret, mfaConfirmado: false },
    });
    return {
      secret,
      otpauthUri: generateURI({
        secret,
        issuer: 'Sistema RSI',
        label: usuario.correo,
      }),
    };
  }

  async confirmarMfa(usuarioId: string, codigo: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (
      !usuario?.mfaSecret ||
      !verifySync({ token: codigo, secret: usuario.mfaSecret }).valid
    ) {
      throw new UnauthorizedException('El código MFA es inválido.');
    }
    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { mfaConfirmado: true },
    });
    await this.registrarAuditoria(
      'MFA_ENABLED',
      usuarioId,
      usuario.correo,
      'EXITOSO',
    );
    return { mensaje: 'MFA activado correctamente.' };
  }

  listarUsuarios() {
    return this.prisma.usuario.findMany({
      orderBy: { correo: 'asc' },
      select: {
        id: true,
        correo: true,
        rol: true,
        activo: true,
        trabajadorId: true,
        creadoEn: true,
      },
    });
  }

  listarAuditoria() {
    return this.prisma.auditEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 200,
      include: {
        actor: { select: { correo: true } },
      },
    });
  }

  async actualizarUsuario(
    id: string,
    datos: ActualizarUsuarioDto,
    actorUserId: string,
  ) {
    const existente = await this.prisma.usuario.findUnique({ where: { id } });
    if (!existente) throw new NotFoundException('Usuario no encontrado.');
    if (datos.rol !== undefined && !ROLES.has(datos.rol)) {
      throw new UnauthorizedException('El rol no es válido.');
    }
    await this.validarRelacionTrabajador(
      datos.rol ?? existente.rol,
      datos.trabajadorId === undefined
        ? (existente.trabajadorId ?? undefined)
        : (datos.trabajadorId ?? undefined),
    );
    await this.validarTrabajadorSinUsuario(
      datos.trabajadorId === undefined
        ? undefined
        : (datos.trabajadorId ?? undefined),
      id,
    );
    const actualizado = await this.prisma.usuario.update({
      where: { id },
      data: datos,
      select: {
        id: true,
        correo: true,
        rol: true,
        activo: true,
        trabajadorId: true,
        creadoEn: true,
      },
    });
    await this.registrarAuditoria('USER_UPDATE', actorUserId, id, 'EXITOSO');
    return actualizado;
  }

  async logout(token: string) {
    const tokenHash = this.hashToken(token);
    const sesion = await this.prisma.sesion.findUnique({
      where: { tokenHash },
      include: {
        usuario: {
          include: {
            trabajador: {
              include: {
                unidadOrganizativa: {
                  select: { id: true, organizacionId: true },
                },
              },
            },
          },
        },
      },
    });
    if (sesion) {
      await this.prisma.sesion.delete({ where: { id: sesion.id } });
      await this.registrarAuditoria(
        'LOGOUT',
        sesion.usuarioId,
        sesion.usuario.correo,
        'EXITOSO',
      );
    }
    return { mensaje: 'Sesión cerrada.' };
  }

  async obtenerPorToken(token: string) {
    const sesion = await this.prisma.sesion.findUnique({
      where: { tokenHash: this.hashToken(token) },
      include: {
        usuario: {
          include: {
            trabajador: {
              include: {
                unidadOrganizativa: {
                  select: { id: true, organizacionId: true },
                },
              },
            },
          },
        },
      },
    });
    if (!sesion || sesion.expiraEn <= new Date() || !sesion.usuario.activo)
      throw new UnauthorizedException('La sesión no es válida.');
    return {
      id: sesion.usuario.id,
      correo: sesion.usuario.correo,
      rol: sesion.usuario.rol,
      trabajadorId: sesion.usuario.trabajadorId,
      mfaConfirmado: sesion.usuario.mfaConfirmado,
      unidadOrganizativaId:
        sesion.usuario.trabajador?.unidadOrganizativaId ?? null,
      organizacionId:
        sesion.usuario.trabajador?.unidadOrganizativa.organizacionId ?? null,
    };
  }

  async crearSesion(usuarioId: string) {
    const token = randomBytes(32).toString('hex');
    await this.prisma.sesion.create({
      data: {
        usuarioId,
        tokenHash: this.hashToken(token),
        expiraEn: new Date(Date.now() + 8 * 60 * 60 * 1000),
      },
    });
    return token;
  }

  auditarPasskey(eventType: string, userId: string, result: string) {
    return this.registrarAuditoria(eventType, userId, userId, result);
  }

  private validarPassword(password: string) {
    if (typeof password !== 'string' || password.length < 12 || password.length > 1024)
      throw new UnauthorizedException(
        'La contraseña debe tener entre 12 y 1024 caracteres.',
      );
  }

  private async validarRelacionTrabajador(rol: string, trabajadorId?: string) {
    if (ROLES_CON_TRABAJADOR.has(rol) && !trabajadorId) {
      throw new BadRequestException(
        `El rol ${rol} requiere un trabajador asociado.`,
      );
    }
    if (trabajadorId) {
      const trabajador = await this.prisma.trabajador.findUnique({
        where: { id: trabajadorId },
        select: { id: true },
      });
      if (!trabajador) {
        throw new BadRequestException('El trabajador seleccionado no existe.');
      }
    }
  }

  private async validarTrabajadorSinUsuario(
    trabajadorId?: string,
    usuarioId?: string,
  ) {
    if (!trabajadorId) return;
    const existente = await this.prisma.usuario.findFirst({
      where: { trabajadorId, ...(usuarioId ? { NOT: { id: usuarioId } } : {}) },
      select: { id: true },
    });
    if (existente) {
      throw new BadRequestException(
        'El trabajador seleccionado ya tiene un usuario.',
      );
    }
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private registrarAuditoria(
    eventType: string,
    actorUserId: string | null,
    entityId: string | undefined,
    result: string,
  ) {
    return this.prisma.auditEvent.create({
      data: {
        eventType,
        entityType: 'AUTH',
        entityId: entityId ?? null,
        action: eventType,
        actorUserId,
        result,
      },
    });
  }
}
