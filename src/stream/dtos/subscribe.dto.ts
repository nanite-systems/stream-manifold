import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }) =>
    ['true', 'false'].includes(value?.toLowerCase())
      ? value.toLowerCase() == 'true'
      : value,
  )
  readonly logicalAndCharactersWithWorlds?: boolean;

  @IsBoolean()
  @Transform(({ value }) =>
    ['true', 'false'].includes(value?.toLowerCase())
      ? value.toLowerCase() == 'true'
      : value,
  )
  readonly list_characters = false;
}
