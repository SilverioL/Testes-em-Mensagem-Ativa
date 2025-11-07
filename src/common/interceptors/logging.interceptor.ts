import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const requestId = req.requestId || 'no-request-id';
    const started = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - started;
        this.logger.log(
          `[${requestId}] ${method} ${originalUrl} - ${duration}ms`,
        );
      }),
      catchError((err) => {
        const duration = Date.now() - started;
        this.logger.error(
          `[${requestId}] ${method} ${originalUrl} - ${duration}ms - ERROR: ${err?.message || err}`,
        );
        throw err;
      }),
    );
  }
}
