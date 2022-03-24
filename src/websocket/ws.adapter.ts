import { WsAdapter as BaseWsAdapter } from '@nestjs/platform-ws';
import { MessageMappingProperties } from '@nestjs/websockets';
import { EMPTY, Observable } from 'rxjs';

export class WsAdapter extends BaseWsAdapter {
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
