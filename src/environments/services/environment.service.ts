import { Injectable } from '@nestjs/common';
import { Environment } from '../utils/environment';

@Injectable()
export class EnvironmentService {
  private readonly environments = new Map<string, Environment>();

  register(key: string, environment: Environment): this {
    this.environments.set(key, environment);

    return this;
  }

  get(key: string): Environment | undefined {
    return this.environments.get(key);
  }
}
