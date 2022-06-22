import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly worlds?: Array<string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly characters?: Array<string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly eventNames?: Array<string>;

  @IsOptional()
  @IsBoolean()
  readonly logicalAndCharactersWithWorlds: boolean;

  @IsBoolean()
  readonly list_characters = false;
}
