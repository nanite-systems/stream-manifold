import { SubscribeDto } from './subscribe.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class ClearSubscribeDto extends SubscribeDto {
  @IsOptional()
  @IsBoolean()
  readonly all?: boolean;
}
