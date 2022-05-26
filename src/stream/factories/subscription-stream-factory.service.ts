import { Injectable, Scope } from '@nestjs/common';
import { merge, Observable } from 'rxjs';
import { FactoryInterface } from '../../utils/factory.interface';
import { EventSubscription } from '../entities/event.subscription';
import { ConnectionSettings } from '../entities/connection.settings';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionStreamFactory
  implements FactoryInterface<Observable<any>>
{
  constructor(
    private readonly settings: ConnectionSettings,
    private readonly subscription: EventSubscription,
    private readonly eventStreamFactory: EventStreamFactory,
  ) {}

  create(): Observable<any> {
    const environment = this.settings.environment;
    const worlds = SubscriptionStreamFactory.ENVIRONMENTS[environment];

    return merge(
      worlds
        .map((world) =>
          SubscriptionStreamFactory.EVENTS.map((event) =>
            this.eventStreamFactory.create(world, event),
          ),
        )
        .flat(1),
    );
  }
}
