import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CumplimientoController } from './cumplimiento.controller';
import { CumplimientoService } from './cumplimiento.service';

@Module({
  controllers: [CumplimientoController],
  providers: [CumplimientoService, PrismaService],
})
export class CumplimientoModule {}
