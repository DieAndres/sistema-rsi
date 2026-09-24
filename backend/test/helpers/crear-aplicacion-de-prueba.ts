import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

export async function crearAplicacionDePrueba(): Promise<INestApplication> {
  const modulo = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = modulo.createNestApplication();
  app.setGlobalPrefix('api/v1');
  await app.init();

  return app;
}
