import { Controller, Get } from '@nestjs/common';
import { KpiService } from './kpi.service';

@Controller('kpis')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Get('resumen')
  resumen() {
    return this.kpiService.resumen();
  }
}
