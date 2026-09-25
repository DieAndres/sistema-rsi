import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ActualizarIndicadorKpiDto } from './dto/actualizar-indicador-kpi.dto';
import { CrearIndicadorKpiDto } from './dto/crear-indicador-kpi.dto';
import { KpiService } from './kpi.service';

@Controller('kpis')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('resumen')
  resumen() {
    return this.kpiService.resumen();
  }

  @Get('formulas')
  listarFormulas() {
    return this.kpiService.listarFormulas();
  }

  @Post('indicadores')
  crearIndicador(@Body() datos: CrearIndicadorKpiDto) {
    return this.kpiService.crearIndicador(datos);
  }

  @Get('indicadores')
  listarIndicadores() {
    return this.kpiService.listarIndicadores();
  }

  @Patch('indicadores/:id')
  actualizarIndicador(
    @Param('id') id: string,
    @Body() datos: ActualizarIndicadorKpiDto,
  ) {
    return this.kpiService.actualizarIndicador(id, datos);
  }

  @Post('indicadores/:id/mediciones')
  registrarMedicion(@Param('id') id: string) {
    return this.kpiService.registrarMedicion(id);
  }

  @Get('indicadores/:id/historico')
  consultarHistorico(@Param('id') id: string) {
    return this.kpiService.consultarHistorico(id);
  }
}
