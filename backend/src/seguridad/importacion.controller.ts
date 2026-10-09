import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import type { RequestAutenticada } from '../auth/usuario-autenticado';
import {
  ImportacionService,
  type DatosImportacion,
} from './importacion.service';
import { columnasImportacion, tipoImportacion } from './importacion-csv';

@Controller('seguridad/importaciones')
@Roles('ADMINISTRADOR', 'RSI')
export class ImportacionController {
  constructor(private readonly service: ImportacionService) {}

  @Get(':tipo/plantilla')
  plantilla(@Param('tipo') tipo: string) {
    return { columnas: columnasImportacion[tipoImportacion(tipo)] };
  }

  @Post(':tipo/validar')
  validar(@Param('tipo') tipo: string, @Body() entrada: DatosImportacion) {
    return this.service.validar(tipoImportacion(tipo), entrada);
  }

  @Post(':tipo/confirmar')
  importar(
    @Param('tipo') tipo: string,
    @Body() entrada: DatosImportacion,
    @Req() req: RequestAutenticada,
  ) {
    return this.service.importar(tipoImportacion(tipo), entrada, req.user);
  }
}
