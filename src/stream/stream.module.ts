import { Module } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { CollectorModule } from '../collector/collector.module';
import { EventSubscription } from './event.subscription';
import { BaseStreamFactory } from './factories/base-stream.factory';
import { StreamConnection } from './stream.connection';
import { InternalCoreModule } from '@nestjs/core/injector/internal-core-module';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [InternalCoreModule, DiscoveryModule, CollectorModule],
  providers: [
    StreamGateway,
    StreamConnection,
    EventSubscription,
    BaseStreamFactory,
  ],
})
export class StreamModule {}
