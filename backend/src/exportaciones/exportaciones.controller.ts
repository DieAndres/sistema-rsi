import { Body, Controller, Get, Param, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportacionesService } from './exportaciones.service';
import { SoaService } from './soa.service';

@Controller('exportaciones')
export class ExportacionesController {
  constructor(
    private readonly exportaciones: ExportacionesService,
    private readonly soa: SoaService,
  ) {}

  @Get('organizaciones/:id/inventario-activos')
  async inventarioActivos(@Param('id') id: string, @Res() respuesta: Response) {
    const contenido = await this.exportaciones.inventarioActivos(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('inventario-activos-borrador.md')
      .send(contenido);
  }

  @Get('organizaciones/:id/soa/controles')
  listarControles(@Param('id') id: string) {
    return this.soa.listar(id);
  }

  @Put('organizaciones/:id/soa/controles/:controlId')
  guardarEvaluacion(
    @Param('id') id: string,
    @Param('controlId') controlId: string,
    @Body() datos: Record<string, unknown>,
  ) {
    return this.soa.guardarEvaluacion(id, controlId, datos);
  }

  @Put('organizaciones/:id/soa/brechas/:funcion')
  guardarBrecha(
    @Param('id') id: string,
    @Param('funcion') funcion: string,
    @Body() datos: Record<string, unknown>,
  ) {
    return this.soa.guardarBrecha(id, funcion, datos);
  }

  @Get('organizaciones/:id/soa')
  async exportarSoa(@Param('id') id: string, @Res() respuesta: Response) {
    const contenido = await this.soa.exportar(id);
    respuesta
      .type('text/markdown; charset=utf-8')
      .attachment('soa-borrador.md')
      .send(contenido);
  }
}
