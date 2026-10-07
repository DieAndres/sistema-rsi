import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
type RequestWithUser = Request & {
  user?: Record<string, unknown>;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';
    if (!token) {
      throw new UnauthorizedException('Se requiere autenticación.');
    }
    request.user = await this.auth.obtenerPorToken(token);
    const user = request.user as {
      rol?: string;
      mfaConfirmado?: boolean;
    };
    const permiteConfiguracionMfa =
      request.path.endsWith('/auth/mfa/setup') ||
      request.path.endsWith('/auth/mfa/confirm') ||
      request.path.endsWith('/auth/me') ||
      request.path.endsWith('/auth/logout');
    if (
      ['ADMINISTRADOR', 'RSI'].includes(user.rol ?? '') &&
      !user.mfaConfirmado &&
      !permiteConfiguracionMfa
    ) {
      throw new UnauthorizedException('MFA pendiente de configuración.');
    }
    return true;
  }
}
