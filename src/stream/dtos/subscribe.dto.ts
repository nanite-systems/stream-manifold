export class SubscribeDto {
  readonly worlds?: Array<string>;

  readonly characters?: Array<string>;

  readonly eventNames?: Array<string>;

  readonly list_characters = false;

  readonly logicalAndCharactersWithWorlds: boolean;
}
