import { Module } from '@nestjs/common';
// import { WorldTracker } from './world.tracker';
import { redisModule } from '../redis/redis.module';

@Module({
  imports: [redisModule],
  // providers: [WorldTracker],
  // exports: [WorldTracker],
})
export class CollectorModule {}
