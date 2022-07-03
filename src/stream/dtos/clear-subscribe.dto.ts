import { SubscribeDto } from './subscribe.dto';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ClearSubscribeDto extends SubscribeDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    ['true', 'false'].includes(value.toLowerCase()) ? value == 'true' : value,
  )
  readonly all?: boolean;
}
