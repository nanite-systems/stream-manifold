import { Module } from '@nestjs/common';
import { EventService } from './services/event.service';
import { EventSubscriptionQuery } from './entity/event-subscription.query';
import { EventSubscriptionService } from './services/event-subscription.service';

@Module({
  providers: [EventService, EventSubscriptionService, EventSubscriptionQuery],
  exports: [EventSubscriptionService, EventSubscriptionQuery],
})
export class SubscriptionModule {}
