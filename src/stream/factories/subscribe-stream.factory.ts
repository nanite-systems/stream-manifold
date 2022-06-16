// import { Injectable, Scope } from '@nestjs/common';
// import { EventSubscriptionQuery } from '../entities/event-subscription.query';
// import { Environment } from '../../environments/utils/environment';
// import { Stream } from 'ps2census';
// import { Subscription } from 'rxjs';
//
// type CharacterEvent = Extract<Stream.PS2Event, { character_id: string }>;
// type CharacterAttackEvent = Extract<
//   Stream.PS2Event,
//   { character_id: string; attacker_character_id }
// >;
// type GainExperienceEvent = Stream.PS2Events.GainExperience;
// type EventName<T extends Stream.PS2Event> = T['event_name'];
// type Callback = (payload: Stream.PS2Event) => Promise<void> | void;
//
// @Injectable({ scope: Scope.REQUEST })
// export class SubscribeStreamFactory {
//   constructor(
//     private readonly subscription: EventSubscriptionQuery,
//     private readonly environment: Environment,
//   ) {}
//
//   subscribe(
//     world: string,
//     event: Stream.PS2EventNames,
//     callback: Callback,
//   ): Subscription {
//     switch (event) {
//       case 'ContinentLock':
//       case 'ContinentUnlock':
//       case 'FacilityControl':
//       case 'MetagameEvent':
//         return this.subscribeWorld(world, event, callback);
//
//       case 'AchievementEarned':
//       case 'BattleRankUp':
//       case 'ItemAdded':
//       case 'PlayerFacilityCapture':
//       case 'PlayerFacilityDefend':
//       case 'SkillAdded':
//         return this.subscribeCharacter(world, event, callback);
//
//       case 'Death':
//       case 'VehicleDestroy':
//         return this.subscribeCharacterAttack(world, event, callback);
//
//       case 'PlayerLogin':
//       case 'PlayerLogout':
//         return this.subscribePlayer(world, event, callback);
//
//       case 'GainExperience':
//         return this.subscribeGainExperience(world, event, callback);
//     }
//   }
//
//   private subscribeWorld(
//     world: string,
//     event: Stream.PS2EventNames,
//     callback: Callback,
//   ): Subscription {
//     return this.environment
//       .getEventStream(event, world)
//       .subscribe((payload) => {
//         callback(payload);
//       });
//   }
//
//   private subscribeCharacter(
//     world: string,
//     event: EventName<CharacterEvent>,
//     callback: Callback,
//   ): Subscription {
//     return this.environment
//       .getEventStream(event, world)
//       .subscribe((payload) => {
//         if (
//           this.subscription.logicalAndCharactersWithWorlds
//             ? this.subscription.hasCharacter(payload.character_id)
//             : this.subscription.hasWorld(payload.world_id) ||
//               this.subscription.hasCharacter(payload.character_id)
//         )
//           callback(payload);
//       });
//   }
//
//   private subscribeCharacterAttack(
//     world: string,
//     event: EventName<CharacterAttackEvent>,
//     callback: Callback,
//   ): Subscription {
//     return this.environment
//       .getEventStream(event, world)
//       .subscribe((payload) => {
//         if (
//           this.subscription.logicalAndCharactersWithWorlds
//             ? this.subscription.hasCharacter(payload.character_id) ||
//               this.subscription.hasCharacter(payload.attacker_character_id)
//             : this.subscription.hasWorld(payload.world_id) ||
//               this.subscription.hasCharacter(payload.character_id) ||
//               this.subscription.hasCharacter(payload.attacker_character_id)
//         )
//           callback(payload);
//       });
//   }
//
//   private subscribePlayer(
//     world: string,
//     event: EventName<CharacterEvent>,
//     callback: Callback,
//   ): Subscription {
//     return this.environment
//       .getEventStream(event, world)
//       .subscribe((payload) => {
//         if (
//           this.subscription.hasWorld(payload.world_id) ||
//           this.subscription.hasCharacter(payload.character_id)
//         )
//           callback(payload);
//       });
//   }
//
//   private subscribeGainExperience(
//     world: string,
//     event: EventName<GainExperienceEvent>,
//     callback: Callback,
//   ): Subscription {
//     return this.environment
//       .getEventStream(event, world)
//       .subscribe((payload) => {
//         if (this.subscription.hasGainExperienceId(payload.experience_id))
//           callback(payload);
//       });
//   }
// }
