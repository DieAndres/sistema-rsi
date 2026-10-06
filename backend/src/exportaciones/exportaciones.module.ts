import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExportacionesController } from './exportaciones.controller';
import { ExportacionesService } from './exportaciones.service';
import { SoaService } from './soa.service';
import { McuController } from './mcu.controller';
import { McuService } from './mcu.service';

@Module({
  controllers: [
    ExportacionesController,
    McuController,
  ],
  providers: [
    ExportacionesService,
    SoaService,
    McuService,
    PrismaService,
  ],
})
export class ExportacionesModule {}
