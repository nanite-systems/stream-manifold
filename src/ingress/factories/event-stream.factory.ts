import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Stream } from 'ps2census';

@Injectable()
export class EventStreamFactory {
  private readonly cache = new Map<string, Subject<Stream.PS2Event>>();

  create(
    worldId: string,
    eventName: Stream.PS2EventNames,
  ): Subject<Stream.PS2Event> {
    const key = `${worldId}:${eventName};`;

    if (this.cache.has(key)) return this.cache.get(key);

    const subject = new Subject<Stream.PS2Event>();

    this.cache.set(key, subject);

    return subject;
  }
}