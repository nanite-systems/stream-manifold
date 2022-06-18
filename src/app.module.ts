import { Module } from '@nestjs/common';
import { StreamModule } from './stream/stream.module';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { AppConfig } from './app.config';

@Module({
  imports: [ConfigModule.forFeature([AppConfig]), StreamModule],
})
export class AppModule {}
