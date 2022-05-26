import { Module } from '@nestjs/common';
import { MultiplexerModule } from '../multiplexer/multiplexer.module';

@Module({
  imports: [MultiplexerModule],
})
export class WorldStateModule {}
