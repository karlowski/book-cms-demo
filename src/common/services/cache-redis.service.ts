import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisSharedService } from './redis-shared.service';


@Injectable()
export class CacheRedisService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _redisSharedService: RedisSharedService
  ) { }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    ttl = ttl ? ttl : this._configService.get('CACHE_TTL');

    await this._redisSharedService.set(key, data, ttl);
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this._redisSharedService.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  public async delete(key: string): Promise<void> {
    await this._redisSharedService.del(key);
  }

  public async deleteByPattern(pattern: string): Promise<void> {
    const redis = this._redisSharedService.getClient();
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      await redis.del(keys);
    }
  }
}
