import { Module } from '@nestjs/common';
import { WorldTracker } from './world.tracker';
import { RedisModule } from '../redis/redis.module';
import { MessageDistributor } from './message.distributor';
import { EventStreamFactory } from './factories/event-stream.factory';
import { RedisSubscriberModule } from '../redis/redis-subscriber.module';
import { WORLD_STATE_CHANNEL, WORLD_STATE_STREAM } from './collector.constants';

@Module({
  imports: [RedisModule, RedisSubscriberModule],
  providers: [
    MessageDistributor,
    EventStreamFactory,
    WorldTracker,
    {
      provide: WORLD_STATE_STREAM,
      useFactory: (messageDistributor: MessageDistributor) =>
        messageDistributor.register(WORLD_STATE_CHANNEL),
      inject: [MessageDistributor],
    },
  ],
  exports: [WorldTracker, WORLD_STATE_STREAM, EventStreamFactory],
})
export class CollectorModule {}
