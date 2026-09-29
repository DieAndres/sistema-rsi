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
    if (
      request.user?.rol === 'LECTOR' &&
      !['GET', 'HEAD', 'OPTIONS'].includes(request.method) &&
      !request.path.endsWith('/auth/logout')
    ) {
      throw new ForbiddenException(
        'El rol LECTOR solo tiene permisos de lectura.',
      );
    }
    return true;
  }
}
