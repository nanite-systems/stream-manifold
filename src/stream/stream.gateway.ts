import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ServerOptions, WebSocket } from 'ws';
import { first, fromEvent, share, takeUntil } from 'rxjs';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { StreamConnection } from './stream.connection';
import { EventMessage } from './concers/message.types';
import { HELP_EVENT_MESSAGE } from './messages/help.event';
import { SubscribeDto } from './dtos/subscribe.dto';
import { ClearSubscribeDto } from './dtos/clear-subscribe.dto';
import { EventSubscription } from './event.subscription';
import { BaseStream } from './streams/base.stream';

@WebSocketGateway<ServerOptions>()
export class StreamGateway implements OnGatewayConnection {
  // Temp solution until request scope gets implemented in NestJS
  private readonly subscriptions = new WeakMap<WebSocket, EventSubscription>();

  constructor(private readonly baseStream: BaseStream) {}

  handleConnection(client: WebSocket): void {
    const close = fromEvent(client, 'close').pipe(share(), first());

    // Initialize subscription
    this.subscriptions.set(client, new EventSubscription());

    this.baseStream.observable.pipe(takeUntil(close)).subscribe((message) => {
      client.send(JSON.stringify(message));
    });
  }

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
    const subscription = this.subscriptions.get(client);

    subscription.merge(message);

    return subscription.format(message.list_characters);
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'clearSubscribe',
  })
  clearSubscribe(
    @ConnectedSocket() client: WebSocket,
    @MessageBody() message: ClearSubscribeDto,
  ) {
    const subscription = this.subscriptions.get(client);

    if (message.all) subscription.clearAll();
    else subscription.clear(message);

    return subscription.format(message.list_characters);
  }
}
