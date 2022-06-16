export class SubscribeDto {
  readonly worlds?: Array<string>;

  readonly characters?: Array<string>;

  readonly events?: Array<string>;

  readonly list_characters = false;

  readonly logicalAndCharactersWithWorlds: boolean;
}
