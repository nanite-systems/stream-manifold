import { SubscribeDto } from '../dtos/subscribe.dto';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class EventSubscription {
  private _allWorlds: boolean;

  private readonly _worlds = new Set<string>();

  private _allCharacters: boolean;

  private readonly _characters = new Set<string>();

  private _allEvents: boolean;

  private readonly _events = new Set<string>();

  private _logicalAndCharactersWithWorlds = false;

  get allWorlds(): boolean {
    return this._allWorlds;
  }

  get worlds(): Array<string> {
    return this._allWorlds ? ['all'] : Array.from(this._worlds);
  }

  hasWorld(world: string): boolean {
    return this._worlds.has(world);
  }

  get allCharacters(): boolean {
    return this._allCharacters;
  }

  get characters(): Array<string> {
    return this._allCharacters ? ['all'] : Array.from(this._characters);
  }

  get characterCount(): number {
    return this.characters.length;
  }

  hasCharacter(character: string): boolean {
    return this._characters.has(character);
  }

  get allEvents(): boolean {
    return this._allEvents;
  }

  get events(): Array<string> {
    return this._allEvents ? ['all'] : Array.from(this._events);
  }

  hasEvent(event: string): boolean {
    return this._events.has(event);
  }

  get logicalAndCharactersWithWorlds(): boolean {
    return this._logicalAndCharactersWithWorlds;
  }

  merge({
    worlds,
    characters,
    events,
    logicalAndCharactersWithWorlds,
  }: SubscribeDto): void {
    worlds?.forEach((world) => this._worlds.add(world));
    characters?.forEach((characters) => this._characters.add(characters));
    events?.forEach((event) => this._events.add(event));

    this.revalidateAll();

    this._logicalAndCharactersWithWorlds =
      logicalAndCharactersWithWorlds ?? this._logicalAndCharactersWithWorlds;
  }

  clear({
    worlds,
    characters,
    events,
    logicalAndCharactersWithWorlds,
  }: SubscribeDto): void {
    worlds?.forEach((world) => this._worlds.delete(world));
    characters?.forEach((characters) => this._characters.delete(characters));
    events?.forEach((event) => this._events.delete(event));

    this.revalidateAll();

    this._logicalAndCharactersWithWorlds =
      logicalAndCharactersWithWorlds ?? this._logicalAndCharactersWithWorlds;
  }

  clearAll(): void {
    this._allWorlds = false;
    this._allCharacters = false;
    this._allEvents = false;

    this._worlds.clear();
    this._characters.clear();
    this._events.clear();

    this._logicalAndCharactersWithWorlds = false;
  }

  private revalidateAll(): void {
    this._allWorlds = this._worlds.has('all');
    this._allCharacters = this._characters.has('all');
    this._allEvents = this._events.has('all');
  }

  format(listCharacters = false) {
    return {
      subscription:
        this.allCharacters || listCharacters
          ? {
              characters: this.characters,
              eventNames: this.events,
              logicalAndCharactersWithWorlds:
                this.logicalAndCharactersWithWorlds,
              worlds: this.worlds,
            }
          : {
              characterCount: this.characterCount,
              eventNames: this.worlds,
              logicalAndCharactersWithWorlds:
                this.logicalAndCharactersWithWorlds,
              worlds: this.worlds,
            },
    };
  }
}
