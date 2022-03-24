import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from './websocket/ws.adapter';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useWebSocketAdapter(new WsAdapter(app));

  app.enableShutdownHooks();

  await app.listen(3000, '0.0.0.0');
}

void bootstrap();
