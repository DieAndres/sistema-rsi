import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { Request } from 'express';
import { PasskeyService } from './passkey.service';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly passkeys: PasskeyService,
  ) {}

  @Post('passkey/register/options')
  registroPasskeyOpciones(@Req() request: Request & { user?: { id: string } }) {
    return this.passkeys.registroOpciones(request.user!.id);
  }

  @Post('passkey/register/verify')
  registrarPasskey(
    @Req() request: Request & { user?: { id: string } },
    @Body() datos: { challengeId: string; response: RegistrationResponseJSON },
  ) {
    return this.passkeys.registrar(
      request.user!.id,
      datos?.challengeId,
      datos?.response,
    );
  }

  @Post('passkey/login/options')
  @Public()
  loginPasskeyOpciones(@Body('correo') correo: string) {
    return this.passkeys.loginOpciones(correo);
  }

  @Post('passkey/login/verify')
  @Public()
  loginPasskey(
    @Body()
    datos: {
      challengeId: string;
      response: AuthenticationResponseJSON;
      codigoMfa?: string;
    },
  ) {
    return this.passkeys.login(
      datos?.challengeId,
      datos?.response,
      datos?.codigoMfa,
    );
  }

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
    @Req() request: Request & { user?: { id: string } },
  ) {
    return this.auth.actualizarUsuario(id, datos, request.user!.id);
  }

  @Post('login')
  @Public()
  login(@Body() datos: LoginDto) {
    return this.auth.login(datos);
  }

  @Post('mfa/setup')
  iniciarMfa(@Req() request: Request & { user?: { id: string } }) {
    return this.auth.iniciarMfa(request.user!.id);
  }

  @Post('mfa/confirm')
  confirmarMfa(
    @Body('codigo') codigo: string,
    @Req() request: Request & { user?: { id: string } },
  ) {
    return this.auth.confirmarMfa(request.user!.id, codigo);
  }

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';
    if (!token) {
      throw new UnauthorizedException('Se requiere un token Bearer.');
    }
    return this.auth.obtenerPorToken(token);
  }

  @Post('logout')
  logout(@Headers('authorization') authorization?: string) {
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : '';
    return this.auth.logout(token);
  }
}
