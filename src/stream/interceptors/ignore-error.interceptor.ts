import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, from, Observable, throwError } from 'rxjs';
import { ValidationError } from 'class-validator';

export class IgnoreErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (
          err instanceof Array &&
          err.length &&
          err[0] instanceof ValidationError
        )
          return from([undefined]);

        return throwError(() => err);
      }),
    );
  }
}
