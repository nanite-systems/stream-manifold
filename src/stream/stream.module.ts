import { Module } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { CollectorModule } from '../collector/collector.module';
import { StreamsModule } from './streams/streams.module';
import { StreamConnection } from './stream.connection';
import { EventSubscription } from './event.subscription';

@Module({
  imports: [CollectorModule, StreamsModule],
  providers: [StreamGateway, StreamConnection, EventSubscription],
})
export class StreamModule {}
