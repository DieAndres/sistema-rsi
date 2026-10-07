import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeguridadController } from './seguridad.controller';
import { SeguridadService } from './seguridad.service';

@Module({
  controllers: [SeguridadController],
  providers: [SeguridadService, PrismaService],
})
export class SeguridadModule {}
