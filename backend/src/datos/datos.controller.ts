import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { DatosService } from './datos.service';
import { aCsv } from './formato';

@Controller('datos/organizaciones/:organizacionId')
@Roles('ADMINISTRADOR', 'RSI')
export class DatosController {
  constructor(private readonly datos: DatosService) {}

  @Get('exportar')
  async exportar(
    @Param('organizacionId') id: string,
    @Query('formato') formato = 'json',
    @Req()
    req: {
      user: {
        id: string;
      };
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!['json', 'csv'].includes(formato)) {
      throw new BadRequestException('Formato: json o csv.');
    }
    const paquete = await this.datos.exportar(id, req.user.id);
    res
      .type(formato === 'json' ? 'application/json' : 'text/csv; charset=utf-8')
      .attachment(`datos-rsi.${formato}`);
    return formato === 'csv' ? aCsv(paquete) : paquete;
  }
}
