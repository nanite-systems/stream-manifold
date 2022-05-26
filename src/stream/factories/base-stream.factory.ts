import { map, merge, Observable, of, timer } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { FactoryInterface } from '../../utils/factory.interface';
import { Environment } from '../../environments/utils/environment';
import { Stream } from 'ps2census';

@Injectable()
export class BaseStreamFactory implements FactoryInterface<Observable<any>> {
  create(environment: Environment): Observable<any> {
    return merge(
      this.connectionState(),
      this.sendHelp(),
      this.heartbeat(environment),
      this.serviceState(environment),
    );
  }

  private connectionState(): Observable<Stream.CensusMessages.ConnectionStateChanged> {
    return of({
      connected: 'true',
      service: 'push',
      type: 'connectionStateChanged',
    });
  }

  public sendHelp(): Observable<Stream.CensusMessages.Help> {
    return of({ 'send this for help': { service: 'event', action: 'help' } });
  }

  public heartbeat(
    environment: Environment,
  ): Observable<Stream.CensusMessages.Heartbeat> {
    return timer(5000, 30000).pipe(
      map(() => ({
        online: Object.fromEntries(
          environment
            .getWorldStates()
            .map((state) => [state.detail, state.state ? 'true' : 'false']),
        ),
        service: 'event',
        type: 'heartbeat',
      })),
    );
  }

  public serviceState(
    environment: Environment,
  ): Observable<Stream.CensusMessages.ServiceStateChanged> {
    return environment.worldStream.pipe(
      map((state) => ({
        detail: state.detail,
        online: state.state ? 'true' : 'false',
        service: 'event',
        type: 'serviceStateChanged',
      })),
    );
  }
}
