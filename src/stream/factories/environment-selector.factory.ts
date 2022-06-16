import { Inject, Injectable, Scope } from '@nestjs/common';
import { FactoryInterface } from '../../utils/factory.interface';
import { Environment } from '../../environments/utils/environment';
import { PC_ENV, PS4EU_ENV, PS4US_ENV } from '../../environments/constants';
import { ConnectionSettings } from '../entities/connection.settings';

@Injectable({ scope: Scope.REQUEST })
export class EnvironmentSelectorFactory
  implements FactoryInterface<Environment>
{
  constructor(
    @Inject(PC_ENV) private readonly pcEnvironment: Environment,
    @Inject(PS4EU_ENV) private readonly ps4euEnvironment: Environment,
    @Inject(PS4US_ENV) private readonly ps4usEnvironment: Environment,
    private readonly connectionSettings: ConnectionSettings,
  ) {}

  create(): Environment {
    if (this.connectionSettings.environment == 'ps2ps4eu')
      return this.ps4euEnvironment;

    if (this.connectionSettings.environment == 'ps2ps4us')
      return this.ps4usEnvironment;

    return this.pcEnvironment;
  }
}
