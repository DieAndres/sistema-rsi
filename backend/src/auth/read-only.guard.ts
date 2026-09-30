import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ReadOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { rol?: string } }>();
    const esGestionMfa =
      request.path.endsWith('/auth/mfa/setup') ||
      request.path.endsWith('/auth/mfa/confirm') ||
      request.path.endsWith('/auth/passkey/register/options') ||
      request.path.endsWith('/auth/passkey/register/verify');
    if (
      request.user?.rol === 'LECTOR' &&
      !['GET', 'HEAD', 'OPTIONS'].includes(request.method) &&
      !request.path.endsWith('/auth/logout') &&
      !esGestionMfa
    ) {
      throw new ForbiddenException(
        'El rol LECTOR solo tiene permisos de lectura.',
      );
    }
    return true;
  }
}
