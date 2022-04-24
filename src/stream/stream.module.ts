import { Module, Scope } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { CollectorModule } from '../collector/collector.module';
import { EventSubscription } from './entities/event.subscription';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { SubscriptionStreamFactory } from './factories/subscription-stream-factory.service';
import { BASE_STREAM, CENSUS_STREAM, SUBSCRIPTION_STREAM } from './constants';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { provideFactory } from '../utils/provide.helpers';
import { ConnectionSettings } from './entities/connection.settings';
import { merge, Observable } from 'rxjs';

@Module({
  imports: [DiscoveryModule, CollectorModule],
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

    provideFactory(BASE_STREAM, BaseStreamFactory),
    provideFactory(SUBSCRIPTION_STREAM, SubscriptionStreamFactory),
    {
      provide: CENSUS_STREAM,
      useFactory: (...streams: Observable<any>[]) => merge(streams),
      inject: [BASE_STREAM, SUBSCRIPTION_STREAM],
      scope: Scope.REQUEST,
    },
  ],
})
export class StreamModule {}
