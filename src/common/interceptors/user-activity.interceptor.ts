import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

import { UserActivityLoggerService } from '../services/user-activity-logger.service';


@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(
    private readonly _userActivityLoggerService: UserActivityLoggerService
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const { user } = gqlContext.getContext().req;

    const action = gqlContext.getInfo().fieldName;
    const variables = gqlContext.getArgs();

    return next.handle().pipe(
      tap(async () => {
        if (user) {
          await this._userActivityLoggerService.log(user.id, action, variables);
        }
      }),
    );
  }
}