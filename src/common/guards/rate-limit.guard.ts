import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisSharedService } from '../services/redis-shared.service';
import { CacheKeysEnum } from '../enums/cache-keys.enum';


@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _redisService: RedisSharedService
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    const key = `${CacheKeysEnum.RATE_LIMIT}:${ip}`;
    const limit = this._configService.get<number>('RATE_LIMIT') || 10;
    const ttl = this._configService.get<number>('RATE_LIMIT_TTL') || 60;

    const requests = await this._redisService.increment(key);

    if (requests === 1) {
      await this._redisService.expire(key, ttl);
    }

    if (requests > limit) {
      throw new HttpException('Chill out!', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}