import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { WORLD_STATE_MAP, WORLD_STATE_STREAM } from './collector.constants';
import { Observable } from 'rxjs';

export interface WorldState {
  worldId: string;
  environment: string;
  detail: string;
  state: boolean;
}

@Injectable()
export class WorldTracker implements OnModuleInit {
  private readonly worldStates = new Map<string, WorldState>();

  constructor(
    @InjectRedis() private readonly redis: Redis,
    @Inject(WORLD_STATE_STREAM)
    private readonly worldStateStream: Observable<WorldState>,
  ) {}

  async onModuleInit(): Promise<void> {
    this.worldStateStream.subscribe((worldState) => {
      this.setWorldState(worldState);
    });

    const worldStates = Object.values(
      await this.redis.hgetall(WORLD_STATE_MAP),
    ).map<WorldState>((v) => JSON.parse(v));

    for (const worldState of worldStates)
      if (!this.worldStates.has(worldState.worldId))
        this.setWorldState(worldState);
  }

  private setWorldState(worldState: WorldState): void {
    const { worldId } = worldState;

    this.worldStates.set(worldId, worldState);
  }

  // getWorldState()
}
