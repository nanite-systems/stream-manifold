import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WorldState } from '../concerns/world-state.type';
import { Axios } from 'axios';
import { MULTIPLEXER_HTTP } from '../../multiplexer/constants';
import { WORLD_STATE_QUEUE } from '../../ingress/constants';
import { Observable } from 'rxjs';

@Injectable()
export class WorldStateService implements OnModuleInit {
  private readonly cache = new Map<string, WorldState>();

  constructor(
    @Inject(MULTIPLEXER_HTTP) private readonly multiplexer: Axios,
    @Inject(WORLD_STATE_QUEUE)
    private readonly worldStateQueue: Observable<WorldState>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.fetchStates();

    this.worldStateQueue.subscribe((worldState) => {
      this.registerState(worldState);
    });
  }

  getStates(): WorldState[] {
    return Array.from(this.cache.values());
  }

  registerState(state: WorldState): void {
    this.cache.set(state.worldId, state);
  }

  async fetchStates(): Promise<void> {
    const { data } = await this.multiplexer.get<WorldState[]>('/world-states');

    data.forEach((state) => this.registerState(state));
  }
}
