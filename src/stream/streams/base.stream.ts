import { Injectable } from '@nestjs/common';
import { merge } from 'rxjs';
import { ConnectionStateChangedStream } from './connection-state-changed.stream';
import { HeartbeatStream } from './heartbeat.stream';
import { ServiceStateChangedStream } from './service-state-changed.stream';
import { SendHelpStream } from './send-help.stream';
import { ObservableWrapper } from '../../utils/rxjs';

@Injectable()
export class BaseStream extends ObservableWrapper<any> {
  constructor(
    connectionStateChangedStream: ConnectionStateChangedStream,
    sendHelpStream: SendHelpStream,
    heartbeatStream: HeartbeatStream,
    serviceStateChangedStream: ServiceStateChangedStream,
  ) {
    super(
      merge(
        connectionStateChangedStream.observable,
        sendHelpStream.observable,
        heartbeatStream.observable,
        serviceStateChangedStream.observable,
      ),
    );
  }
}
