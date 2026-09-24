import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizacionController } from './organizacion.controller';
import { OrganizacionService } from './organizacion.service';

@Module({
  controllers: [OrganizacionController],
  providers: [OrganizacionService, PrismaService],
  exports: [OrganizacionService],
})
export class OrganizacionModule {}
