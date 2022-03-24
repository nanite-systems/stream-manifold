import { of } from 'rxjs';
import { ObservableWrapper } from '../../utils/rxjs';
import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceStateChangedStream extends ObservableWrapper<any> {
  constructor() {
    super(
      of({
        detail: 'EventServerEndpoint_Connery_1',
        online: 'true',
        service: 'event',
        type: 'serviceStateChanged',
      }),
    );
  }
}
