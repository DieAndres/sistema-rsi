import type { RequestConUsuario } from './usuario-autenticado';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import type { Response } from 'express';
import {
  clearSession,
  cookie,
  SESSION_COOKIE,
  setSession,
} from './session-http';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('usuarios')
  @Roles('ADMINISTRADOR')
  registrar(@Body() datos: CrearUsuarioDto) {
    return this.auth.registrar(datos);
  }

  @Get('usuarios')
  @Roles('ADMINISTRADOR')
  listarUsuarios() {
    return this.auth.listarUsuarios();
  }

  @Get('auditoria')
  @Roles('ADMINISTRADOR')
  listarAuditoria(
    @Query('entidad') entidad?: string,
    @Query('usuarioId') usuarioId?: string,
    @Query('pagina') pagina?: string,
  ) {
    return this.auth.listarAuditoria({ entidad, usuarioId, pagina });
  }

  @Patch('usuarios/:id')
  @Roles('ADMINISTRADOR')
  actualizarUsuario(
    @Param('id') id: string,
    @Body() datos: ActualizarUsuarioDto,
    @Req() request: RequestConUsuario,
  ) {
    return this.auth.actualizarUsuario(id, datos, request.user!.id);
  }

  @Post('login')
  @Public()
  async login(
    @Body() datos: LoginDto,
    @Req() request: RequestConUsuario,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.login(datos);
    await this.auth.logout(cookie(request, SESSION_COOKIE));
    setSession(response, result.token);
    return {
      usuario: result.usuario,
      mfaSetupRequired: result.mfaSetupRequired,
    };
  }

  @Post('sesiones/revocar')
  async revocarPropias(
    @Req() request: RequestConUsuario,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.revocarSesiones(
      request.user!.id,
      request.user!.id,
    );
    clearSession(response);
    return result;
  }

  @Post('usuarios/:id/sesiones/revocar')
  @Roles('ADMINISTRADOR')
  revocarUsuario(@Param('id') id: string, @Req() request: RequestConUsuario) {
    return this.auth.revocarSesiones(id, request.user!.id);
  }

  @Post('mfa/setup')
  iniciarMfa(@Req() request: RequestConUsuario) {
    return this.auth.iniciarMfa(request.user!.id);
  }

  @Post('mfa/confirm')
  confirmarMfa(
    @Body('codigo') codigo: string,
    @Req() request: RequestConUsuario,
  ) {
    return this.auth.confirmarMfa(request.user!.id, codigo);
  }

  @Get('me')
  me(
    @Req() request: RequestConUsuario,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    return this.auth.obtenerPorToken(cookie(request, SESSION_COOKIE));
  }

  @Post('logout')
  async logout(
    @Req() request: RequestConUsuario,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.auth.logout(cookie(request, SESSION_COOKIE));
    clearSession(response);
    return result;
  }
}
