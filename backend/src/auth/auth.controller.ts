import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
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
  listarAuditoria() {
    return this.auth.listarAuditoria();
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
