import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppConfig } from './app.config';
import { ConfigModule } from '@census-reworked/nestjs-utils';

async function bootstrap() {
  ConfigModule.forRoot();

  const config = await ConfigModule.resolveConfig(AppConfig);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableShutdownHooks();

  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
