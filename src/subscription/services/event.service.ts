import { WorldEvent } from '../events/world.event';
import { EventStreamFactory } from '../../ingress/factories/event-stream.factory';
import { CharacterEvent } from '../events/character.event';
import { AttackerEvent } from '../events/attacker.event';
import { GainExperienceEvent } from '../events/gain-experience.event';
import { EventContract } from '../concerns/event.contract';

export class EventService {
  readonly events: EventContract<any>[];

  constructor(eventStreamFactory: EventStreamFactory) {
    this.events = [
      new WorldEvent('ContinentLock', eventStreamFactory),
      new WorldEvent('ContinentUnlock', eventStreamFactory),
      new WorldEvent('FacilityControl', eventStreamFactory),
      new WorldEvent('MetagameEvent', eventStreamFactory),

      new CharacterEvent('AchievementEarned', eventStreamFactory),
      new CharacterEvent('BattleRankUp', eventStreamFactory),
      new CharacterEvent('ItemAdded', eventStreamFactory),
      new CharacterEvent('PlayerFacilityCapture', eventStreamFactory),
      new CharacterEvent('PlayerFacilityDefend', eventStreamFactory),
      new CharacterEvent('SkillAdded', eventStreamFactory),
      new CharacterEvent('VehicleDestroy', eventStreamFactory),

      new CharacterEvent('PlayerLogin', eventStreamFactory, true),
      new CharacterEvent('PlayerLogout', eventStreamFactory, true),

      new AttackerEvent('Death', eventStreamFactory),
      new AttackerEvent('VehicleDestroy', eventStreamFactory),

      new GainExperienceEvent(eventStreamFactory),
    ];
  }
}
