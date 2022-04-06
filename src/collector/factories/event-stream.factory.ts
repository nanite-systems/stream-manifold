import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { EventMessage } from '../types/event.message';

@Injectable()
export class EventStreamFactory {
  private readonly flyweights = new Map<string, Observable<any>>();

  create(worldId: string, eventName: string): Observable<EventMessage> {
    const key = `${worldId}:${eventName}`;

    if (this.flyweights.has(key)) return this.flyweights.get(key);

    const eventStream = new Subject<EventMessage>();
    this.flyweights.set(key, eventStream);

    return eventStream;
  }
}
