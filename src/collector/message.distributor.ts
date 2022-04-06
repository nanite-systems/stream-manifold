import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Observable, Subject } from 'rxjs';
import { REDIS_SUBSCRIBER } from '../redis/redis.constants';

@Injectable()
export class MessageDistributor implements OnModuleInit {
  private readonly streams = new Map<string, Subject<any>>();
  private readonly pstreams = new Map<string, Subject<any>>();

  constructor(@InjectRedis(REDIS_SUBSCRIBER) private readonly redis: Redis) {}

  onModuleInit(): void {
    this.redis.on('message', (channel: string, message: string) => {
      this.streams.get(channel)?.next(JSON.parse(message));
    });

    this.redis.on(
      'pmessage',
      (pattern: string, channel: string, message: string) => {
        this.pstreams.get(pattern)?.next(JSON.parse(message));
      },
    );
  }

  async register<T = any>(channel: string): Promise<Observable<T>> {
    if (this.streams.has(channel)) return this.streams.get(channel);

    const stream = new Subject<T>();
    this.streams.set(channel, stream);

    await this.redis.subscribe(channel);

    return stream;
  }

  async registerPattern<T = any>(pattern: string): Promise<Observable<T>> {
    if (this.pstreams.has(pattern)) return this.pstreams.get(pattern);

    const stream = new Subject<T>();
    this.pstreams.set(pattern, stream);

    await this.redis.psubscribe(pattern);

    return stream;
  }
}
