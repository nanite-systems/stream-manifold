import { FactoryInterface } from '../../utils/factory.interface';
import { merge, Observable } from 'rxjs';
import { Injectable, Scope } from '@nestjs/common';
import { BaseStreamFactory } from './base-stream.factory';
import { SubscriptionStreamFactory } from './subscription-stream-factory.service';

@Injectable({ scope: Scope.REQUEST })
export class CensusStreamFactory implements FactoryInterface<Observable<any>> {
  constructor(
    private readonly baseStreamFactory: BaseStreamFactory,
    private readonly subscriptionStreamFactory: SubscriptionStreamFactory,
  ) {}

  create(): Observable<any> {
    return merge(
      this.baseStreamFactory.create(),
      this.subscriptionStreamFactory.create(),
    );
  }
}
