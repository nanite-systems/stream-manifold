import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WorldState } from '../concerns/world-state.type';
import { Axios } from 'axios';
import { MULTIPLEXER_HTTP } from '../../multiplexer/constants';
import { Observable, Subject } from 'rxjs';
import { sleep } from '../../utils/promise.helper';

@Injectable()
export class WorldStateService implements OnModuleInit {
  private readonly logger = new Logger('WorldStateService');

  private readonly cache = new Map<string, WorldState>();

  private readonly _stream = new Subject<WorldState>();

  constructor(@Inject(MULTIPLEXER_HTTP) private readonly multiplexer: Axios) {}

  get stream(): Observable<WorldState> {
    return this._stream;
  }

  async onModuleInit(): Promise<void> {
    do {
      try {
        await this.fetchStates();
        return;
      } catch (err) {
        this.logger.error(`Failed to initialize world states: ${err}`);

        // Let's not try to DDOS anything
        await sleep(1000);
      }
    } while (true);
  }

  getStates(): WorldState[] {
    return Array.from(this.cache.values());
  }

  registerState(state: WorldState): void {
    const current = this.cache.get(state.worldId);

    this.cache.set(state.worldId, state);

    if (!current || current.state != state.state) this._stream.next(state);
  }

  async fetchStates(): Promise<void> {
    const { data } = await this.multiplexer.get<string>('/world-states');

    // TODO: Why is this even necessary?
    JSON.parse(data).forEach((state) => this.registerState(state));
  }
}
