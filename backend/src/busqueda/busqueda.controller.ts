import { Controller, Get, Query } from '@nestjs/common';
import { BusquedaService } from './busqueda.service';

@Controller('busqueda')
export class BusquedaController {
  constructor(private readonly service: BusquedaService) {}

  @Get()
  buscar(
    @Query('q') q?: string,
    @Query('unidadId') unidadId?: string,
    @Query('estado') estado?: string,
    @Query('severidad') severidad?: string,
  ) {
    return this.service.buscar({ q, unidadId, estado, severidad });
  }
}
