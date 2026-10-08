import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { UrcdpService } from './urcdp.service';

@Controller('exportaciones/organizaciones/:id/urcdp')
@Roles('ADMINISTRADOR', 'RSI')
export class UrcdpController {
  constructor(private readonly servicio: UrcdpService) {}

  @Get() listar(@Param('id') id: string) {
    return this.servicio.listar(id);
  }

  @Post('bases-personales') crearBase(
    @Param('id') id: string,
    @Body() datos: Record<string, unknown>,
  ) {
    return this.servicio.guardarBase(id, datos);
  }

  @Put('bases-personales/:fichaId') actualizarBase(
    @Param('id') id: string,
    @Param('fichaId') fichaId: string,
    @Body() datos: Record<string, unknown>,
  ) {
    return this.servicio.guardarBase(id, datos, fichaId);
  }

  @Post('notificaciones-urcdp') crearBrecha(
    @Param('id') id: string,
    @Body() datos: Record<string, unknown>,
  ) {
    return this.servicio.guardarBrecha(id, datos);
  }

  @Put('notificaciones-urcdp/:fichaId') actualizarBrecha(
    @Param('id') id: string,
    @Param('fichaId') fichaId: string,
    @Body() datos: Record<string, unknown>,
  ) {
    return this.servicio.guardarBrecha(id, datos, fichaId);
  }

  @Get('registro-urcdp') registro(
    @Param('id') id: string,
    @Query('fichaId') fichaId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res
      .type('text/markdown; charset=utf-8')
      .attachment('urcdp-registro-borrador.md');
    return this.servicio.exportar(id, 'registro', fichaId);
  }

  @Get('medidas-urcdp') medidas(
    @Param('id') id: string,
    @Query('fichaId') fichaId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res
      .type('text/markdown; charset=utf-8')
      .attachment('urcdp-medidas-borrador.md');
    return this.servicio.exportar(id, 'medidas', fichaId);
  }

  @Get('brecha-urcdp') brecha(
    @Param('id') id: string,
    @Query('fichaId') fichaId: string,
    @Query('etapa') etapa: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    res
      .type('text/markdown; charset=utf-8')
      .attachment('urcdp-brecha-borrador.md');
    return this.servicio.exportar(id, 'brecha', fichaId, etapa);
  }
}
