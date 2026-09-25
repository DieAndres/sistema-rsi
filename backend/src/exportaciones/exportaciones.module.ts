import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExportacionesController } from './exportaciones.controller';
import { ExportacionesService } from './exportaciones.service';
import { SoaService } from './soa.service';

@Module({
  controllers: [ExportacionesController],
  providers: [ExportacionesService, SoaService, PrismaService],
})
export class ExportacionesModule {}
