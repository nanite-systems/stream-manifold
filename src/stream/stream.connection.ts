import {
  Inject,
  Injectable,
  Logger,
  Scope,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { EventMessage } from './concers/message.types';
import { HELP_EVENT_MESSAGE } from './messages/help-event.message';
import { WebSocket } from 'ws';
import { SubscribeDto } from './dtos/subscribe.dto';
import { ClearSubscribeDto } from './dtos/clear-subscribe.dto';
import { first, fromEvent, Observable, share, takeUntil } from 'rxjs';
import { CENSUS_STREAM } from './constants';
import { ConnectionContract } from './concers/connection.contract';
import { EchoDto } from './dtos/echo.dto';
import { EventSubscriptionService } from '../subscription/services/event-subscription.service';
import { IgnoreErrorInterceptor } from './interceptors/ignore-error.interceptor';
import { IncomingMessage } from 'http';
import { randomUUID } from 'crypto';

@Injectable({ scope: Scope.REQUEST })
@UsePipes(
  new ValidationPipe({
    transform: true,
  }),
)
@UseInterceptors(new IgnoreErrorInterceptor())
export class StreamConnection implements ConnectionContract {
  private static readonly logger = new Logger('StreamConnection');

  private readonly id = randomUUID();

  constructor(
    private readonly subscriptionService: EventSubscriptionService,
    @Inject(CENSUS_STREAM) private readonly stream: Observable<any>,
  ) {}

  onConnected(client: WebSocket, request: IncomingMessage): void {
    StreamConnection.logger.log(
      `Client connected ${this.id}: ${JSON.stringify({
        ip: request.socket.remoteAddress,
        url: request.url,
      })}`,
    );

    const close = fromEvent(client, 'close').pipe(first(), share());

    this.stream.pipe(takeUntil(close)).subscribe((message: any) => {
      client.send(JSON.stringify(message));
    });
  }

  onDisconnected(): void {
    this.subscriptionService.query.clearAll();

    StreamConnection.logger.log(`Client disconnected ${this.id}`);
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
  echo(@MessageBody() { payload }: EchoDto) {
    return payload;
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'subscribe',
  })
  subscribe(@MessageBody() message: SubscribeDto) {
    this.subscriptionService.query.merge(message);

    return this.subscriptionService.query.format(message.list_characters);
  }

  @SubscribeMessage<EventMessage>({
    service: 'event',
    action: 'clearSubscribe',
  })
  clearSubscribe(@MessageBody() message: ClearSubscribeDto) {
    if (message.all) this.subscriptionService.query.clearAll();
    else this.subscriptionService.query.clear(message);

    return this.subscriptionService.query.format(message.list_characters);
  }
}
