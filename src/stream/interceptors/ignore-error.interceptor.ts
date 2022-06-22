import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, from, Observable } from 'rxjs';

export class IgnoreErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(() => {
        return from([undefined]);
      }),
    );
  }
}
