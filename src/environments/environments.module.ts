import { Module, OnModuleInit } from '@nestjs/common';
import { IngressModule } from '../ingress/ingress.module';
import { EnvironmentFactory } from './factories/environment.factory';
import { EnvironmentManifest } from './environment.manifest';
import { EnvironmentService } from './services/environment.service';
import { WorldStateModule } from '../world-state/world-state.module';

@Module({
  imports: [IngressModule, WorldStateModule],
  providers: [EnvironmentFactory, EnvironmentManifest, EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentsModule implements OnModuleInit {
  constructor(
    private readonly manifest: EnvironmentManifest,
    private readonly factory: EnvironmentFactory,
    private readonly service: EnvironmentService,
  ) {}

  onModuleInit(): void {
    const pc = this.factory.create(this.manifest.ps2);
    const ps4eu = this.factory.create(this.manifest.ps2ps4eu);
    const ps4us = this.factory.create(this.manifest.ps2ps4us);

    this.service
      .register('', pc)
      .register('ps2', pc)
      .register('os2ps4eu', ps4eu)
      .register('ps2ps4us', ps4us);
  }
}
