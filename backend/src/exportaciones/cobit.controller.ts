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
import { CobitService } from './cobit.service';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('exportaciones/organizaciones/:id')
export class CobitController {
  constructor(private readonly cobit: CobitService) {}
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
  @Get('cobit-procesos')
  listar(@Param('id') id: string, @Req() request: Request) {
    this.alcance(id, request);
    return this.cobit.listar(id);
  }
  @Put('cobit-procesos/:controlId')
  @Roles('ADMINISTRADOR', 'RSI')
  guardar(
    @Param('id') id: string,
    @Param('controlId') controlId: string,
    @Body() datos: Record<string, unknown>,
    @Req() request: Request,
  ) {
    this.alcance(id, request);
    return this.cobit.guardar(id, controlId, datos);
  }
  @Get('cobit')
  async exportar(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.alcance(id, request);
    const contenido = await this.cobit.exportar(id);
    respuesta.type('text/markdown; charset=utf-8').attachment('cobit-2019.md');
    return contenido;
  }
}
