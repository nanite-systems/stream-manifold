import { ProcessEnv } from '@census-reworked/nestjs-utils';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class RabbitMqConfig {
  @ProcessEnv('RABBITMQ_URL')
  @IsUrl({ protocols: ['amqp'] })
  url = 'amqp://localhost';

  @ProcessEnv('RABBITMQ_INGRESS_EXCHANGE')
  @IsNotEmpty()
  ingressExchange: string;
}
