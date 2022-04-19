import { RedisModule } from '@nestjs-modules/ioredis';
import { REDIS_SUBSCRIBER } from './redis.constants';

export const RedisSubscriberModule = RedisModule.forRoot(
  {
    config: {
      url: 'redis://localhost:6379',
    },
  },
  REDIS_SUBSCRIBER,
);
