import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { INGRESS_QUEUE } from '../../rabbit-mq/constants';
import { Observable, Subject } from 'rxjs';
import { ConsumeMessage } from 'amqplib';
import { EventStreamFactory } from '../factories/event-stream.factory';
import { Stream } from 'ps2census';
import { WORLD_STATE_QUEUE } from '../constants';
import { WorldState } from '../../world-state/concerns/world-state.type';

@Injectable()
export class DistributerService implements OnModuleInit {
  private readonly logger = new Logger('DistributerService');

  constructor(
    @Inject(INGRESS_QUEUE)
    private readonly queue: Observable<ConsumeMessage>,
    private readonly eventStreamFactory: EventStreamFactory,
    @Inject(WORLD_STATE_QUEUE)
    private readonly worldStateQueue: Subject<WorldState>,
  ) {}

  onModuleInit(): void {
    this.queue.subscribe((message) => {
      try {
        const payload = JSON.parse(message.content.toString());
        const [type, worldId, specifier] = message.fields.routingKey.split('.');

        if (type == 'world-state') {
          this.worldStateQueue.next(payload);
        } else if (type == 'event') {
          this.eventStreamFactory
            .get(worldId, specifier as Stream.PS2EventNames)
            .next(payload);
        }
      } catch (err) {
        if (err instanceof SyntaxError) {
          this.logger.warn(
            `Received malformed message: ${message.content.toString()}`,
          );
        } else {
          throw err;
        }
      }
    });
  }
}
