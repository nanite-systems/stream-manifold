import { Inject, Injectable } from '@nestjs/common';
import { RABBIT_MQ } from '../constants';
import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class EventStreamFactory {
  constructor(
    @Inject(RABBIT_MQ) private readonly rabbit: AmqpConnectionManager,
  ) {}

  create(name: string): Observable<any> {
    const subject = new Subject();

    this.createChannel(name, subject);

    return subject;
  }

  private createChannel(name: string, subject: Subject<any>): ChannelWrapper {
    return this.rabbit.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange(name, 'fanout');
        const { queue } = await channel.assertQueue('', {
          durable: false,
          exclusive: true,
        });

        await channel.bindQueue(queue, name);
        await channel.consume(queue, (message) => {
          subject.next(message);
        });
      },
    });
  }
}
