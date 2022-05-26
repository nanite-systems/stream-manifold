import { Observable } from 'rxjs';
import { Stream } from 'ps2census';
import { WorldState } from '../../world-state/concerns/world-state.type';
import { WorldStateService } from '../../world-state/services/world-state.service';

export class Environment {
  constructor(
    private readonly worldStateService: WorldStateService,
    readonly worlds: string[],
    readonly eventStream: Observable<Stream.PS2Event>,
    readonly worldStream: Observable<WorldState>,
  ) {}

  getWorldStates(): WorldState[] {
    return this.worldStateService
      .getStates()
      .filter(({ worldId }) => this.worlds.includes(worldId));
  }
}