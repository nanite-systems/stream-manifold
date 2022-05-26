import { Stream } from 'ps2census';

export class EnvironmentDescription {
  readonly events: Stream.PS2EventNames[] = [
    'AchievementEarned',
    'BattleRankUp',
    'ContinentLock',
    'ContinentUnlock',
    'Death',
    'FacilityControl',
    'GainExperience',
    'ItemAdded',
    'MetagameEvent',
    'PlayerFacilityCapture',
    'PlayerFacilityDefend',
    'PlayerLogin',
    'PlayerLogout',
    'SkillAdded',
    'VehicleDestroy',
  ];

  constructor(readonly name: string, readonly worlds: string[]) {}
}
