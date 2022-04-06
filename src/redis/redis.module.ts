import { RedisModule as BaseRedisModule } from '@nestjs-modules/ioredis';

export const RedisModule = BaseRedisModule.forRoot({
  config: {
    url: 'redis://localhost:57614',
  },
});
