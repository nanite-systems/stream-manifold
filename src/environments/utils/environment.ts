import { filter, Observable } from 'rxjs';
import { WorldState } from '../../world-state/concerns/world-state.type';
import { WorldStateService } from '../../world-state/services/world-state.service';
import { EnvironmentDescription } from './environment.description';

export class Environment {
  readonly worldStream: Observable<WorldState>;

  constructor(
    readonly description: EnvironmentDescription,
    private readonly worldStateService: WorldStateService,
    worldStream: Observable<WorldState>,
  ) {
    this.worldStream = worldStream.pipe(
      filter((state) => this.description.hasWorld(state.worldId)),
    );
  }

  get worlds(): string[] {
    return Array.from(this.description.worlds);
  }

  getWorldStates(): WorldState[] {
    return this.worldStateService
      .getStates()
      .filter(({ worldId }) => this.description.hasWorld(worldId));
  }
}
