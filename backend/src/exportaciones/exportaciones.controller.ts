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
import { ExportacionesService } from './exportaciones.service';
import { SoaService } from './soa.service';

@Controller('exportaciones')
export class ExportacionesController {
  constructor(
    private readonly exportaciones: ExportacionesService,
    private readonly soa: SoaService,
  ) {}

  @Get('organizaciones/:id/inventario-activos')
  async inventarioActivos(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.validarAlcance(id, request);
    const contenido = await this.exportaciones.inventarioActivos(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('inventario-activos-borrador.md');
    return contenido;
  }

  @Get('organizaciones/:id/politica-seguridad')
  async politicaSeguridad(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.validarAlcance(id, request);
    const contenido = await this.exportaciones.politicaSeguridad(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('politica-seguridad-borrador.md');
    return contenido;
  }

  @Get('organizaciones/:id/soa/controles')
  listarControles(@Param('id') id: string, @Req() request: Request) {
    this.validarAlcance(id, request);
    return this.soa.listar(id);
  }

  @Put('organizaciones/:id/soa/controles/:controlId')
  guardarEvaluacion(
    @Param('id') id: string,
    @Req() request: Request,
    @Param('controlId') controlId: string,
    @Body() datos: Record<string, unknown>,
  ) {
    this.validarAlcance(id, request);
    return this.soa.guardarEvaluacion(id, controlId, datos);
  }

  @Put('organizaciones/:id/soa/brechas/:funcion')
  guardarBrecha(
    @Param('id') id: string,
    @Req() request: Request,
    @Param('funcion') funcion: string,
    @Body() datos: Record<string, unknown>,
  ) {
    this.validarAlcance(id, request);
    return this.soa.guardarBrecha(id, funcion, datos);
  }

  @Get('organizaciones/:id/soa')
  async exportarSoa(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.validarAlcance(id, request);
    const contenido = await this.soa.exportar(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('soa-borrador.md');
    return contenido;
  }

  @Get('organizaciones/:id/mcu')
  async exportarMcu(
    @Param('id') id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) respuesta: Response,
  ) {
    this.validarAlcance(id, request);
    const contenido = await this.soa.exportarMcu(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('brechas-mcu-borrador.md');
    return contenido;
  }

  private validarAlcance(id: string, request: RequestConUsuario) {
    if (
      ['DUENO_UNIDAD', 'LECTOR'].includes(request.user?.rol ?? '') &&
      request.user?.organizacionId !== id
    ) {
      throw new ForbiddenException('No tenés permisos sobre esa organización.');
    }
  }
}
