import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const isCached = true;
		if (isCached) {
			return of([]);
		}

		return next.handle().pipe(
			tap(data => {
				context.switchToHttp().getResponse().setHeader('')
			}),
			map(data => data = 'Success')
		);
	}
}
