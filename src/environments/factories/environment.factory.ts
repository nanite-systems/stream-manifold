import { Inject, Injectable } from '@nestjs/common';
import { EventStreamFactory } from '../../ingress/factories/event-stream.factory';
import { EnvironmentDescription } from '../utils/environment.description';
import { Environment } from '../utils/environment';
import { filter, merge, Observable, of } from 'rxjs';
import { Stream } from 'ps2census';
import { WorldState } from '../../world-state/concerns/world-state.type';
import { WORLD_STATE_QUEUE } from '../../ingress/constants';
import { WorldStateService } from '../../world-state/services/world-state.service';

@Injectable()
export class EnvironmentFactory {
  constructor(
    private readonly eventStreamFactory: EventStreamFactory,
    @Inject(WORLD_STATE_QUEUE)
    private readonly worldStateQueue: Observable<WorldState>,
    private readonly worldStateService: WorldStateService,
  ) {}

  create(description: EnvironmentDescription): Environment {
    return new Environment(
      this.worldStateService,
      description.worlds,
      this.createEventStream(description.worlds, description.events),
      this.createWorldStateStream(description.worlds),
    );
  }

  private createEventStream(
    worlds: string[],
    events: Stream.PS2EventNames[],
  ): Observable<Stream.PS2Event> {
    return merge(
      ...worlds.flatMap((world) =>
        events.map((event) => this.eventStreamFactory.create(world, event)),
      ),
    );
  }

  private createWorldStateStream(worlds: string[]): Observable<WorldState> {
    return merge(
      of(...this.worldStateService.getStates()),
      this.worldStateQueue,
    ).pipe(filter(({ worldId }) => worlds.includes(worldId)));
  }
}
