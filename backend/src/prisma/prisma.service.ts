import 'dotenv/config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { AsyncLocalStorage } from 'node:async_hooks';

export const transaccionAuditoria =
  new AsyncLocalStorage<Prisma.TransactionClient>();

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL no está definida. Creá backend/.env antes de iniciar el backend.',
      );
    }

    const adaptador = new PrismaPg({
      connectionString: databaseUrl,
    });
    super({ adapter: adaptador });
    // Todos los módulos usan la transacción de la petición, incluso con proveedores distintos.
    return new Proxy(this, {
      get(target, propiedad, receiver) {
        const tx = transaccionAuditoria.getStore();
        if (
          tx &&
          typeof propiedad === 'string' &&
          !propiedad.startsWith('$') &&
          propiedad in tx
        ) {
          return Reflect.get(tx, propiedad);
        }
        return Reflect.get(target, propiedad, receiver);
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
