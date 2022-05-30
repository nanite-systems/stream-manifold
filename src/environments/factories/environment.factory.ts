import { Inject, Injectable } from '@nestjs/common';
import { EnvironmentDescription } from '../utils/environment.description';
import { Environment } from '../utils/environment';
import { Observable } from 'rxjs';
import { WorldState } from '../../world-state/concerns/world-state.type';
import { WORLD_STATE_QUEUE } from '../../ingress/constants';
import { WorldStateService } from '../../world-state/services/world-state.service';

@Injectable()
export class EnvironmentFactory {
  constructor(
    @Inject(WORLD_STATE_QUEUE)
    private readonly worldStateQueue: Observable<WorldState>,
    private readonly worldStateService: WorldStateService,
  ) {}

  create(description: EnvironmentDescription): Environment {
    return new Environment(
      description,
      this.worldStateService,
      this.worldStateQueue,
    );
  }
}
