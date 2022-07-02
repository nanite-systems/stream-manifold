import { SubscribeDto } from './subscribe.dto';
import { Transform } from 'class-transformer';

export class ClearSubscribeDto extends SubscribeDto {
  @Transform(({ value }) => Boolean(value))
  readonly all: boolean;
}
