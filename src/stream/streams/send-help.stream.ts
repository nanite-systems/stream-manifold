import { of } from 'rxjs';
import { ObservableWrapper } from '../../utils/rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendHelpStream extends ObservableWrapper<any> {
  constructor() {
    super(of({ 'send this for help': { service: 'event', action: 'help' } }));
  }
}
