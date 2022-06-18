import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class AppConfig {
  @ProcessEnv('APP_PORT')
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => Number.parseInt(value, 10))
  port = 8000;
}
