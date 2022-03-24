import { Module } from '@nestjs/common';
import { HeartbeatStream } from './heartbeat.stream';
import { ServiceStateChangedStream } from './service-state-changed.stream';
import { BaseStream } from './base.stream';
import { SendHelpStream } from './send-help.stream';
import { ConnectionStateChangedStream } from './connection-state-changed.stream';

const streams = [
  ConnectionStateChangedStream,
  SendHelpStream,
  HeartbeatStream,
  ServiceStateChangedStream,
  BaseStream,
];

@Module({
  providers: [...streams],
  exports: [...streams],
})
export class StreamsModule {}
