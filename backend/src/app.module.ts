import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { OrganizacionModule } from './organizacion/organizacion.module';
import { SeguridadModule } from './seguridad/seguridad.module';
import { CumplimientoModule } from './cumplimiento/cumplimiento.module';
import { KpiModule } from './kpi/kpi.module';
import { BusquedaModule } from './busqueda/busqueda.module';
import { ExportacionesModule } from './exportaciones/exportaciones.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { ReadOnlyGuard } from './auth/read-only.guard';
import { UnitScopeGuard } from './auth/unit-scope.guard';

@Module({
  imports: [
    OrganizacionModule,
    SeguridadModule,
    CumplimientoModule,
    KpiModule,
    BusquedaModule,
    ExportacionesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ReadOnlyGuard },
    { provide: APP_GUARD, useClass: UnitScopeGuard },
  ],
})
export class AppModule {}
