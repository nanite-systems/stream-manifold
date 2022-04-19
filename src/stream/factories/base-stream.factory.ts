import { map, merge, Observable, of, timer } from 'rxjs';
import { WorldTracker } from '../../collector/world.tracker';
import { Inject } from '@nestjs/common';
import { WORLD_STATE_STREAM } from '../../collector/collector.constants';
import { iterate } from 'iterare';

export class BaseStreamFactory {
  private flyweight: Observable<any>;

  constructor(
    private readonly worldTracker: WorldTracker,
    @Inject(WORLD_STATE_STREAM) private readonly worldStateStream: WorldTracker,
  ) {}

  create(): Observable<any> {
    if (!this.flyweight) this.flyweight = this.baseStream();

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
        online: Object.fromEntries(
          iterate(this.worldTracker.all())
            .filter(({ environment }) => environment == 'ps2')
            .map(({ detail, state }) => [detail, JSON.stringify(state)])
            .toArray(),
        ),
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
