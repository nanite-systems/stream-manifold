import { Inject, Injectable, Scope } from '@nestjs/common';
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
import { first, fromEvent, Observable, share, takeUntil } from 'rxjs';
import { IncomingMessage } from 'http';
import { MESSAGE_STREAM } from './constants';

@Injectable({ scope: Scope.REQUEST })
export class StreamConnection {
  constructor(
    private readonly subscription: EventSubscription,
    @Inject(MESSAGE_STREAM) private readonly messagesStream: Observable<any>,
  ) {}

  onConnected(client: WebSocket, req: IncomingMessage): void {
    const close = fromEvent(client, 'close').pipe(first(), share());

    const messageHandler = (message: any) => {
      client.send(JSON.stringify(message));
    };

    this.messagesStream.pipe(takeUntil(close)).subscribe((message) => {
      messageHandler(message);
    });
  }

  onDisconnected(client: WebSocket): void {}

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
