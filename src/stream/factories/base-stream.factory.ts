import { map, merge, Observable, of, timer } from 'rxjs';
import { WorldTracker } from '../../collector/world.tracker';
import { Inject } from '@nestjs/common';
import { WORLD_STATE_STREAM } from '../../collector/collector.constants';

export class BaseStreamFactory {
  private flyweight: Observable<any>;

  constructor(
    private readonly worldTracker: WorldTracker,
    @Inject(WORLD_STATE_STREAM) private readonly worldStateStream: WorldTracker,
  ) {}

  create(): Observable<any> {
    if (!this.flyweight) {
      this.flyweight = this.baseStream();
    }

    return this.flyweight;
  }

  private baseStream(): Observable<any> {
    return merge([
      this.connectionState(),
      this.sendHelp(),
      this.heartbeat(),
      this.serviceState(),
    ]);
  }

  private connectionState(): Observable<any> {
    return of({
      connected: 'true',
      service: 'push',
      type: 'connectionStateChanged',
    });
  }

  public sendHelp(): Observable<any> {
    return of({ 'send this for help': { service: 'event', action: 'help' } });
  }

  public heartbeat(): Observable<any> {
    return timer(5000, 30000).pipe(
      map(() => ({
        online: {},
        // Object.entries(
        //   this.worldTracker.
        // ),
        //   {
        //   // TODO: Use world tracker
        //   EventServerEndpoint_Cobalt_13: 'true',
        //   EventServerEndpoint_Connery_1: 'true',
        //   EventServerEndpoint_Emerald_17: 'true',
        //   EventServerEndpoint_Jaeger_19: 'true',
        //   EventServerEndpoint_Miller_10: 'true',
        //   EventServerEndpoint_Soltech_40: 'true',
        // },
        service: 'event',
        type: 'heartbeat',
      })),
    );
  }

  public serviceState(): Observable<any> {
    return of({
      detail: 'EventServerEndpoint_Connery_1',
      online: 'true',
      service: 'event',
      type: 'serviceStateChanged',
    });
  }
}
