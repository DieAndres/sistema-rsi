import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user?: { rol?: string } }>();
    if (!request.user?.rol || !roles.includes(request.user.rol)) {
      throw new ForbiddenException(
        'No tenés permisos para realizar esta operación.',
      );
    }
    return true;
  }
}
