import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IJwtPayload } from '../common/interfaces/jwt-payload.interface';
import { IPassportUser } from '../common/interfaces/passport-user.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get('ACCESS_TOKEN_SECRET') as string,
    });
  }

  async validate(payload: IJwtPayload): Promise<IPassportUser> {
    return { 
      userId: payload.userId, 
      permissions: payload.permissions 
    };
  }
}
