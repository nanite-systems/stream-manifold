import { SubscribeDto } from '../../stream/dtos/subscribe.dto';
import { Injectable, Scope } from '@nestjs/common';
import { EventEmitter } from 'eventemitter3';

type EventSubscriptionQueryEvents = {
  subscribe: () => void;
  unsubscribe: () => void;
  unsubscribeAll: () => void;
};

@Injectable({ scope: Scope.REQUEST })
export class EventSubscriptionQuery extends EventEmitter<EventSubscriptionQueryEvents> {
  private readonly _worlds = new Set<string>();

  private readonly _characters = new Set<string>();

  private readonly _events = new Set<string>();

  private _logicalAndCharactersWithWorlds = false;

  get worlds(): Iterable<string> {
    return this._worlds[Symbol.iterator]();
  }

  hasWorld(world: string): boolean {
    return this._worlds.has('all') || this._worlds.has(world);
  }

  get characters(): Iterable<string> {
    return this._characters[Symbol.iterator]();
  }

  hasCharacter(character: string): boolean {
    return this._characters.has('all') || this._characters.has(character);
  }

  get events(): Iterable<string> {
    return this._events[Symbol.iterator]();
  }

  hasEvent(event: string): boolean {
    return this._events.has('all') || this._events.has(event);
  }

  get logicalAndCharactersWithWorlds(): boolean {
    return this._logicalAndCharactersWithWorlds;
  }

  merge(subscribe: SubscribeDto): void {
    subscribe.eventNames?.forEach((event) => {
      this._events.add(event);
    });
    subscribe.worlds?.forEach((world) => {
      this._worlds.add(world);
    });
    subscribe.characters?.forEach((character) => {
      this._characters.add(character);
    });

    this._logicalAndCharactersWithWorlds =
      subscribe.logicalAndCharactersWithWorlds ??
      this._logicalAndCharactersWithWorlds;

    this.emit('subscribe');
  }

  clear(subscribe: SubscribeDto): void {
    subscribe.eventNames?.forEach((event) => {
      this._events.delete(event);
    });
    subscribe.worlds?.forEach((world) => {
      this._worlds.delete(world);
    });
    subscribe.characters?.forEach((character) => {
      this._characters.delete(character);
    });

    this._logicalAndCharactersWithWorlds =
      subscribe.logicalAndCharactersWithWorlds ??
      this._logicalAndCharactersWithWorlds;

    this.emit('unsubscribe');
  }

  clearAll(): void {
    this._worlds.clear();
    this._characters.clear();
    this._events.clear();

    this._logicalAndCharactersWithWorlds = false;

    this.emit('unsubscribeAll');
  }

  format(listCharacters = false) {
    return {
      subscription:
        this._events.has('all') || listCharacters
          ? {
              characters: ['all'],
              eventNames: Array.from(this._events),
              logicalAndCharactersWithWorlds:
                this._logicalAndCharactersWithWorlds,
              worlds: Array.from(this._worlds),
            }
          : {
              characterCount: this._characters.size,
              eventNames: Array.from(this._events),
              logicalAndCharactersWithWorlds:
                this._logicalAndCharactersWithWorlds,
              worlds: Array.from(this._worlds),
            },
    };
  }
}
