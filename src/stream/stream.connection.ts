import { Injectable, Scope } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { EventMessage } from './concers/message.types';
import { HELP_EVENT_MESSAGE } from './messages/help-event.message';
import { WebSocket } from 'ws';
import { SubscribeDto } from './dtos/subscribe.dto';
import { ClearSubscribeDto } from './dtos/clear-subscribe.dto';
import { EventSubscription } from './event.subscription';

@Injectable({ scope: Scope.REQUEST })
export class StreamConnection {
  constructor(private readonly subscription: EventSubscription) {}

  onConnected(): void {
    console.log('Hello there');
  }

  onDisconnected(): void {}

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'help',
  })
  help() {
    return HELP_EVENT_MESSAGE;
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'echo',
  })
  echo(@MessageBody('payload') payload: unknown) {
    // TODO: For each world?
    return payload;
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'subscribe',
  })
  subscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() message: SubscribeDto,
  ) {
    this.subscription.merge(message);

    return this.subscription.format(message.list_characters);
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'clearSubscribe',
  })
  clearSubscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() message: ClearSubscribeDto,
  ) {
    if (message.all) this.subscription.clearAll();
    else this.subscription.clear(message);

    return this.subscription.format(message.list_characters);
  }
}
