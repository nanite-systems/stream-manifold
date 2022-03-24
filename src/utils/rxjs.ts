import { Observable, Observer, Subscribable, Unsubscribable } from 'rxjs';

export abstract class ObservableWrapper<T> implements Subscribable<T> {
  protected constructor(readonly observable: Observable<T>) {}

  // TODO: Check compatibility with function subscriber
  subscribe(observer: Partial<Observer<T>>): Unsubscribable {
    return this.observable.subscribe(observer);
  }
}
