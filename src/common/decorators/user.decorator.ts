import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import { IPassportUser } from '../interfaces/passport-user.interface';


export const User = createParamDecorator<keyof IPassportUser | undefined>(
  (key: keyof IPassportUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    return key ? user[key] : user;
  },
);
