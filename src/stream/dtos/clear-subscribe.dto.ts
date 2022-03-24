import { SubscribeDto } from './subscribe.dto';

export class ClearSubscribeDto extends SubscribeDto {
  readonly all?: boolean;
}
