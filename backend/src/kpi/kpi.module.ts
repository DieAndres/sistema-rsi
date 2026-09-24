import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KpiController } from './kpi.controller';
import { KpiService } from './kpi.service';

@Module({
  controllers: [KpiController],
  providers: [KpiService, PrismaService],
})
export class KpiModule {}
