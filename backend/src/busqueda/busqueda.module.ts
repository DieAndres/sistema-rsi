import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusquedaController } from './busqueda.controller';
import { BusquedaService } from './busqueda.service';

@Module({
  controllers: [BusquedaController],
  providers: [BusquedaService, PrismaService],
})
export class BusquedaModule {}
