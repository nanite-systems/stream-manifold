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
import { EventSubscription } from './entities/event.subscription';
import { first, fromEvent, Observable, share, takeUntil } from 'rxjs';
import { CENSUS_STREAM } from './constants';
import { ConnectionContract } from './concers/connection.contract';

@Injectable({ scope: Scope.REQUEST })
export class StreamConnection implements ConnectionContract {
  constructor(
    private readonly subscription: EventSubscription,
    @Inject(CENSUS_STREAM) private readonly stream: Observable<any>,
  ) {}

  onConnected(client: WebSocket): void {
    const close = fromEvent(client, 'close').pipe(first(), share());

    this.stream.pipe(takeUntil(close)).subscribe((message: any) => {
      client.send(JSON.stringify(message));
    });
  }

  // onDisconnected(client: WebSocket): void {}

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
