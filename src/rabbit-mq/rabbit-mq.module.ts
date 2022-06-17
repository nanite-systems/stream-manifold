import { Module } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { RabbitMqConfig } from './rabbit-mq.config';
import { INGRESS_QUEUE, RABBIT_MQ } from './constants';
import { connect } from 'amqp-connection-manager';
import { DataStreamFactory } from './factories/data-stream.factory';

@Module({
  imports: [ConfigModule.forFeature([RabbitMqConfig])],
  providers: [
    DataStreamFactory,

    {
      provide: RABBIT_MQ,
      useFactory: (config: RabbitMqConfig) => connect([config.url]),
      inject: [RabbitMqConfig],
    },
    {
      provide: INGRESS_QUEUE,
      useFactory: (factory: DataStreamFactory, config: RabbitMqConfig) =>
        factory.create(config.ingressExchange),
      inject: [DataStreamFactory, RabbitMqConfig],
    },
  ],
  exports: [INGRESS_QUEUE],
})
export class RabbitMqModule {
}
