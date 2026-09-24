import { Module } from '@nestjs/common';
import { OrganizacionModule } from '../organizacion/organizacion.module';
import { CumplimientoController } from './cumplimiento.controller';
import { CumplimientoService } from './cumplimiento.service';

@Module({
  imports: [OrganizacionModule],
  controllers: [CumplimientoController],
  providers: [CumplimientoService],
})
export class CumplimientoModule {}
