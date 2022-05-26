import { Module } from '@nestjs/common';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { EventStreamFactory } from './factories/event-stream.factory';
import { DistributerService } from './services/distributer.service';
import { WorldStateModule } from '../world-state/world-state.module';
import { WORLD_STATE_QUEUE } from './constants';
import { Subject } from 'rxjs';

@Module({
  imports: [RabbitMqModule, WorldStateModule],
  providers: [
    EventStreamFactory,
    DistributerService,
    {
      provide: WORLD_STATE_QUEUE,
      useFactory: () => new Subject(),
    },
  ],
  exports: [EventStreamFactory],
})
export class IngressModule {}
