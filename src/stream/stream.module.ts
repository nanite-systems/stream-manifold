import { Module, Scope } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { CollectorModule } from '../collector/collector.module';
import { EventSubscription } from './entities/event.subscription';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { EventStreamFactory } from './factories/event-stream.factory';
import { MESSAGE_STREAM, PS2_ENVIRONMENT, WS_REQUEST } from './constants';
import { from } from 'rxjs';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { IncomingMessage } from 'http';

@Module({
  imports: [DiscoveryModule, CollectorModule],
  providers: [
    StreamGateway,
    StreamConnection,
    EventSubscription,
    BaseStreamFactory,
    EventStreamFactory,
    {
      provide: GatewayMetadataExplorer,
      useFactory: (scanner: MetadataScanner) =>
        new GatewayMetadataExplorer(scanner),
      inject: [MetadataScanner],
    },
    {
      provide: MESSAGE_STREAM,
      useFactory: () => from([]),
      scope: Scope.REQUEST,
    },
    {
      provide: PS2_ENVIRONMENT,
      useFactory: (req: IncomingMessage) => {
        const params = new URLSearchParams(req.url.slice(2));

        return params.get('environment') ?? 'ps2';
      },
      inject: [WS_REQUEST],
      scope: Scope.REQUEST,
    },
  ],
})
export class StreamModule {}
