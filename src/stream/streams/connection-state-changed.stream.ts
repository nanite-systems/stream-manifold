import { of } from 'rxjs';
import { ObservableWrapper } from '../../utils/rxjs';
import { Injectable } from "@nestjs/common";

@Injectable()
export class ConnectionStateChangedStream extends ObservableWrapper<any> {
  constructor() {
    super(
      of({
        connected: 'true',
        service: 'push',
        type: 'connectionStateChanged',
      }),
    );
  }
}
