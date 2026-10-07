import type { RequestConUsuario } from '../auth/usuario-autenticado';
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
import { BcuService } from './bcu.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('exportaciones/organizaciones/:id')
export class BcuController {
  constructor(private readonly bcu: BcuService) {}

  private alcance(id: string, request: RequestConUsuario) {
    if (
      ['LECTOR', 'DUENO_UNIDAD'].includes(request.user?.rol ?? '') &&
      request.user?.organizacionId !== id
    ) {
      throw new ForbiddenException('No tenés permisos sobre esa organización.');
    }
  }

  @Get('bcu-controles')
  listar(@Param('id') id: string, @Req() request: Request) {
    this.alcance(id, request);
    return this.bcu.listar(id);
  }

  @Put('bcu-controles/:controlId')
  @Roles('ADMINISTRADOR', 'RSI')
  guardar(
    @Param('id') id: string,
    @Param('controlId') controlId: string,
    @Body() datos: Record<string, unknown>,
    @Req() request: Request,
  ) {
    this.alcance(id, request);
    return this.bcu.guardar(id, controlId, datos);
  }

  @Get('bcu-gsi')
  async exportar(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.alcance(id, request);
    const contenido = await this.bcu.exportar(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('bcu-gsi-avanzado.md');
    return contenido;
  }
}
