import { map, timer } from 'rxjs';
import { ObservableWrapper } from '../../utils/rxjs';
import { Injectable } from "@nestjs/common";

@Injectable()
export class HeartbeatStream extends ObservableWrapper<any> {
  constructor() {
    super(
      timer(5000, 30000).pipe(
        map(() => ({
          online: {
            // TODO: Use world tracker
            EventServerEndpoint_Cobalt_13: 'true',
            EventServerEndpoint_Connery_1: 'true',
            EventServerEndpoint_Emerald_17: 'true',
            EventServerEndpoint_Jaeger_19: 'true',
            EventServerEndpoint_Miller_10: 'true',
            EventServerEndpoint_Soltech_40: 'true',
          },
          service: 'event',
          type: 'heartbeat',
        })),
      ),
    );
  }
}
