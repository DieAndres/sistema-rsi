import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExportacionesController } from './exportaciones.controller';
import { ExportacionesService } from './exportaciones.service';
import { SoaService } from './soa.service';
import { McuController } from './mcu.controller';
import { McuService } from './mcu.service';
import { BcuService } from './bcu.service';
import { BcuController } from './bcu.controller';

@Module({
  controllers: [
    ExportacionesController,
    McuController,
    BcuController,
  ],
  providers: [
    ExportacionesService,
    SoaService,
    McuService,
    BcuService,
    PrismaService,
  ],
})
export class ExportacionesModule {}
