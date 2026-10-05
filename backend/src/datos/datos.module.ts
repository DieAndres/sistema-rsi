import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DatosController } from './datos.controller';
import { DatosService } from './datos.service';

@Module({
  controllers: [DatosController],
  providers: [DatosService, PrismaService],
})
export class DatosModule {}
