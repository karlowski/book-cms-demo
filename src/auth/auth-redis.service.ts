import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisSharedService } from '../common/services/redis-shared.service';


@Injectable()
export class AuthRedisService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _redisSharedService: RedisSharedService
  ) {}

  public async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const ttl = this._configService.get('REFRESH_TOKEN_TTL');

    await this._redisSharedService.set(`refresh:${userId}`, refreshToken, ttl);
  }

  public async getRefreshToken(userId: number): Promise<string | null> {
    return this._redisSharedService.get(`refresh:${userId}`);
  }

  public async revokeRefreshToken(userId: number) {
    await this._redisSharedService.del(`refresh:${userId}`);
  }
}
