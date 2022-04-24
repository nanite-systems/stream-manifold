import { Injectable } from '@nestjs/common';
import { EventSubscription } from '../entities/event.subscription';
import { from, Observable } from 'rxjs';

@Injectable()
export class EventStreamFactory {
  create(subscription: EventSubscription): Observable<any> {
    return from([]);
  }
}