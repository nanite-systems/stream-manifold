import { InjectionToken, Provider, Type } from '@nestjs/common';
import { FactoryInterface } from './factory.interface';

export function provideFactory(
  provide: InjectionToken,
  factory: Type<FactoryInterface<any>>,
): Provider {
  return {
    provide,
    useFactory: (factory: FactoryInterface<any>) => factory.create(),
    inject: [factory],
  };
}
