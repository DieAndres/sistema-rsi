import { Module } from '@nestjs/common';
import { OrganizacionModule } from '../organizacion/organizacion.module';
import { SeguridadController } from './seguridad.controller';
import { SeguridadService } from './seguridad.service';

@Module({
  imports: [OrganizacionModule],
  controllers: [SeguridadController],
  providers: [SeguridadService],
})
export class SeguridadModule {}
