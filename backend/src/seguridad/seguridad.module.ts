import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeguridadController } from './seguridad.controller';
import { SeguridadService } from './seguridad.service';
import { ImportacionController } from './importacion.controller';
import { ImportacionService } from './importacion.service';

@Module({
  controllers: [SeguridadController, ImportacionController],
  providers: [SeguridadService, ImportacionService, PrismaService],
})
export class SeguridadModule {}
