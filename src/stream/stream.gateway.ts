import {
  MessageMappingProperties,
  OnGatewayConnection,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ServerOptions, WebSocket } from 'ws';
import {
  EMPTY,
  filter,
  first,
  from,
  fromEvent,
  mergeAll,
  mergeMap,
  Observable,
  of,
  share,
  takeUntil,
} from 'rxjs';
import {
  ContextId,
  ContextIdFactory,
  MetadataScanner,
  ModuleRef,
} from '@nestjs/core';
import { StreamConnection } from './stream.connection';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { WsParamsFactory } from '@nestjs/websockets/factories/ws-params-factory';
import { CLOSE_EVENT, PARAM_ARGS_METADATA } from '@nestjs/websockets/constants';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

@WebSocketGateway<ServerOptions>()
export class StreamGateway implements OnGatewayConnection {
  private readonly contextMap = new WeakMap<WebSocket, ContextId>();

  private readonly paramFactory = new WsParamsFactory();

  private readonly metadataExplorer: GatewayMetadataExplorer;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly contextCreator: ExternalContextCreator,
    metadataScanner: MetadataScanner,
  ) {
    this.metadataExplorer = new GatewayMetadataExplorer(metadataScanner);
  }

  async handleConnection(client: WebSocket): Promise<void> {
    const contextId = ContextIdFactory.create();
    this.contextMap.set(client, contextId);

    const connection = await this.moduleRef.resolve(
      StreamConnection,
      contextId,
    );

    const nativeMessagesHandlers = this.metadataExplorer.explore(
      <NestGateway>connection,
    );
    const messageHandlers = nativeMessagesHandlers.map(
      ({ callback, message, methodName }) => ({
        message,
        methodName,
        callback: this.contextCreator.create(
          connection,
          callback,
          methodName,
          PARAM_ARGS_METADATA,
          this.paramFactory,
          contextId,
          null,
          {
            interceptors: true,
            guards: true,
            filters: true,
          },
          'ws',
        ),
      }),
    );

    this.bindMessageHandlers(client, messageHandlers, (data) =>
      from(this.pickResult(data)).pipe(mergeAll()),
    );

    setImmediate(() => {
      connection.onConnected();
    });

    const close = fromEvent(client, 'close').pipe(share(), first());

    close.subscribe(() => {
      connection.onDisconnected();
    });
  }

  async pickResult(deferredResult: Promise<any>): Promise<Observable<any>> {
    const result = await deferredResult;
    if (result && typeof result.subscribe == 'function') {
      return result;
    }
    if (result instanceof Promise) {
      return from(result);
    }
    return of(result);
  }

  bindMessageHandlers(
    client: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ) {
    const close$ = fromEvent(client, CLOSE_EVENT).pipe(share(), first());
    const source$ = fromEvent(client, 'message').pipe(
      mergeMap((data) =>
        this.bindMessageHandler(data, handlers, transform).pipe(
          filter((result) => result),
        ),
      ),
      takeUntil(close$),
    );
    const onMessage = (response: any) => {
      client.send(JSON.stringify(response));
    };
    source$.subscribe(onMessage);
  }

  bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): Observable<any> {
    try {
      const message = JSON.parse(buffer.data);
      const messageHandler = handlers.find(({ message: pt }) =>
        Object.keys(pt).every((key) => pt[key] === message[key]),
      );
      const { callback } = messageHandler;
      return transform(callback(message));
    } catch {
      return EMPTY;
    }
  }
}
