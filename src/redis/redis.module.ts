import { RedisModule } from '@nestjs-modules/ioredis';

export const redisModule = RedisModule.forRootAsync({
  useFactory: () => {
    return {
      config: {
        url: 'redis://localhost:6379',
      },
    };
  },
});
