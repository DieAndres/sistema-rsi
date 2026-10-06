import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { McuService } from './mcu.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('exportaciones/organizaciones/:id')
export class McuController {
  constructor(private readonly mcu: McuService) {}
  private alcance(
    id: string,
    request: Request & {
      user?: { rol?: string; organizacionId?: string | null };
    },
  ) {
    if (
      ['LECTOR', 'DUENO_UNIDAD'].includes(request.user?.rol ?? '') &&
      request.user?.organizacionId !== id
    )
      throw new ForbiddenException('No tenés permisos sobre esa organización.');
  }
  @Get('mcu-controles')
  listar(@Param('id') id: string, @Req() request: Request) {
    this.alcance(id, request);
    return this.mcu.listar(id);
  }
  @Put('mcu-controles/:controlId')
  @Roles('ADMINISTRADOR', 'RSI')
  guardar(
    @Param('id') id: string,
    @Param('controlId') controlId: string,
    @Body() datos: Record<string, unknown>,
    @Req() request: Request,
  ) {
    this.alcance(id, request);
    return this.mcu.guardar(id, controlId, datos);
  }
  @Get('mcu-funciones')
  async exportar(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.alcance(id, request);
    const contenido = await this.mcu.exportar(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('mcu-funciones-avanzado.md');
    return contenido;
  }
}
