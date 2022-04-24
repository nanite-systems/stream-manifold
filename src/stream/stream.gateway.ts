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
import { ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { StreamConnection } from './stream.connection';
import { WsParamsFactory } from '@nestjs/websockets/factories/ws-params-factory';
import { CLOSE_EVENT, PARAM_ARGS_METADATA } from '@nestjs/websockets/constants';
import { GatewayMetadataExplorer } from '@nestjs/websockets/gateway-metadata-explorer';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { REQUEST_CONTEXT_ID } from '@nestjs/core/router/request/request-constants';
import { IncomingMessage } from 'http';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { ConnectionContract } from './concers/connection.contract';

@WebSocketGateway<ServerOptions>()
export class StreamGateway implements OnGatewayConnection {
  private readonly paramFactory = new WsParamsFactory();

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly contextCreator: ExternalContextCreator,
    private readonly metadataExplorer: GatewayMetadataExplorer,
  ) {}

  async handleConnection(client: WebSocket, ...args: any[]): Promise<void> {
    const req: IncomingMessage = args[0];
    const contextId = ContextIdFactory.getByRequest(req);

    this.moduleRef.registerRequestByContextId(req, contextId);

    const connection: ConnectionContract = await this.moduleRef.resolve(
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

    if (connection.onConnected)
      setImmediate(() => {
        connection.onConnected(client, ...(args as [IncomingMessage]));
      });

    const close = fromEvent(client, 'close').pipe(share(), first());

    if (connection.onDisconnected)
      close.subscribe(() => {
        connection.onDisconnected(client);
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

  private getContextId<T extends Record<any, unknown> = any>(
    request: T,
  ): ContextId {
    const contextId = ContextIdFactory.getByRequest(request);
    if (!request[REQUEST_CONTEXT_ID as any]) {
      Object.defineProperty(request, REQUEST_CONTEXT_ID, {
        value: contextId,
        enumerable: false,
        writable: false,
        configurable: false,
      });
      this.moduleRef.registerRequestByContextId(request, contextId);
    }
    return contextId;
  }
}