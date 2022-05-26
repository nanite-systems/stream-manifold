import { Module } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { MultiplexerConfig } from './multiplexer.config';
import { MULTIPLEXER_HTTP } from './constants';
import { Axios } from 'axios';

@Module({
  imports: [ConfigModule.forFeature([MultiplexerConfig])],
  providers: [
    {
      provide: MULTIPLEXER_HTTP,
      useFactory: (config: MultiplexerConfig) =>
        new Axios({
          baseURL: config.endpoint,
        }),
      inject: [MultiplexerConfig],
    },
  ],
  exports: [MULTIPLEXER_HTTP],
})
export class MultiplexerModule {}
