import { Module } from '@nestjs/common';
import { IngressModule } from '../ingress/ingress.module';
import { EnvironmentFactory } from './factories/environment.factory';
import { EnvironmentManifest } from './environment.manifest';
import { PC_ENV, PS4EU_ENV, PS4US_ENV } from './constants';

@Module({
  imports: [IngressModule],
  providers: [
    EnvironmentFactory,
    EnvironmentManifest,

    {
      provide: PC_ENV,
      useFactory: (
        factory: EnvironmentFactory,
        manifest: EnvironmentManifest,
      ) => factory.create(manifest.ps2),
      inject: [EnvironmentFactory, EnvironmentManifest],
    },
    {
      provide: PS4EU_ENV,
      useFactory: (
        factory: EnvironmentFactory,
        manifest: EnvironmentManifest,
      ) => factory.create(manifest.ps2ps4eu),
      inject: [EnvironmentFactory, EnvironmentManifest],
    },
    {
      provide: PS4US_ENV,
      useFactory: (
        factory: EnvironmentFactory,
        manifest: EnvironmentManifest,
      ) => factory.create(manifest.ps2ps4us),
      inject: [EnvironmentFactory, EnvironmentManifest],
    },
  ],
  exports: [PC_ENV, PS4EU_ENV, PS4US_ENV],
})
export class EnvironmentsModule {}
