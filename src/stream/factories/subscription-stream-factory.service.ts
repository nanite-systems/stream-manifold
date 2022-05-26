import { Injectable, Scope } from '@nestjs/common';
import { filter, map, Observable } from 'rxjs';
import { FactoryInterface } from '../../utils/factory.interface';
import { EventSubscription } from '../entities/event.subscription';
import { Environment } from '../../environments/utils/environment';
import { Stream } from 'ps2census';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionStreamFactory
  implements FactoryInterface<Observable<any>>
{
  constructor(
    private readonly subscription: EventSubscription,
    private readonly environment: Environment,
  ) {}

  create(): Observable<Stream.CensusMessages.ServiceMessage> {
    return this.environment.eventStream.pipe(
      filter((event) => {
        return true;
      }),
      map((payload) => ({
        type: 'serviceMessage',
        service: 'event',
        payload,
      })),
    );
  }
}
