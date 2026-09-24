import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { OrganizacionModule } from './organizacion/organizacion.module';
import { SeguridadModule } from './seguridad/seguridad.module';
import { CumplimientoModule } from './cumplimiento/cumplimiento.module';

@Module({
  imports: [OrganizacionModule, SeguridadModule, CumplimientoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
