import { Injectable, Scope } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { EventMessage } from './concers/message.types';
import { HELP_EVENT_MESSAGE } from './messages/help.event';
import { WebSocket } from 'ws';
import { SubscribeDto } from './dtos/subscribe.dto';
import { ClearSubscribeDto } from './dtos/clear-subscribe.dto';
import { EventSubscription } from './event.subscription';

@Injectable({ scope: Scope.TRANSIENT })
export class StreamConnection {
  constructor(private readonly subscription: EventSubscription) {}

  afterInit(client: WebSocket): void {
    // Start base stream
  }


}
