import { Inject, Injectable, Scope } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { WS_REQUEST } from '../../stream/constants';

@Injectable({ scope: Scope.REQUEST })
export class EnvironmentAccessor {
  constructor(@Inject(WS_REQUEST) private readonly request: IncomingMessage) {}

  get environment(): string {
    const params = new URLSearchParams(
      this.request.url.match(/(?<=\?).*/).shift(),
    );

    return params.get('environment') ?? 'ps2';
  }
}
