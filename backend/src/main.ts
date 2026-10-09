import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request, Response, NextFunction } from 'express';

import { validarClaveTotp } from './auth/totp-secret';

async function bootstrap() {
  validarClaveTotp();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Un CSV de 64 KB puede crecer al escapar su contenido dentro de JSON.
  app.useBodyParser('json', { limit: '512kb' });
  app.setGlobalPrefix('api/v1');
  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
