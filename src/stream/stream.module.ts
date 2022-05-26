import { Module } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { EventSubscription } from './entities/event.subscription';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { SubscriptionStreamFactory } from './factories/subscription-stream-factory.service';
import { BASE_STREAM, CENSUS_STREAM, SUBSCRIPTION_STREAM } from './constants';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { provideFactory } from '../utils/provide.helpers';
import { ConnectionSettings } from './entities/connection.settings';
import { CensusStreamFactory } from './factories/census-stream.factory';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';

@Module({
  imports: [DiscoveryModule, RabbitMqModule],
  providers: [
    {
      provide: GatewayMetadataExplorer,
      useFactory: (scanner: MetadataScanner) =>
        new GatewayMetadataExplorer(scanner),
      inject: [MetadataScanner],
    },

    StreamGateway,
    StreamConnection,

    EventSubscription,
    ConnectionSettings,

    BaseStreamFactory,
    SubscriptionStreamFactory,
    CensusStreamFactory,

    provideFactory(BASE_STREAM, BaseStreamFactory),
    provideFactory(SUBSCRIPTION_STREAM, SubscriptionStreamFactory),
    provideFactory(CENSUS_STREAM, CensusStreamFactory),
  ],
})
export class StreamModule {}
