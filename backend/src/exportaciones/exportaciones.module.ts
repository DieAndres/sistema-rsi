import { CobitService } from './cobit.service';
import { CobitController } from './cobit.controller';
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
    CobitController,
  ],
  providers: [
    ExportacionesService,
    SoaService,
    McuService,
    BcuService,
    CobitService,
    PrismaService,
  ],
})
export class ExportacionesModule {}
