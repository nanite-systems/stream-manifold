import { EnvironmentDescription } from './utils/environment.description';

export class EnvironmentManifest {
  readonly ps2 = new EnvironmentDescription([
    '1',
    '10',
    '13',
    '17',
    '19',
    '40',
  ]);

  readonly ps2ps4eu = new EnvironmentDescription(['1000']);

  readonly ps2ps4us = new EnvironmentDescription(['2000']);
}
