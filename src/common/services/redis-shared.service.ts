import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisSharedService implements OnModuleInit, OnModuleDestroy {
  private _redisClient: Redis;

  constructor(
    private readonly _configService: ConfigService
  ) {}

  public onModuleInit(): void {
    this._redisClient = new Redis({
      host: this._configService.get<string>('REDIS_HOST'),
      port: Number(this._configService.get('REDIS_PORT')),
    });
  }

  public getClient(): Redis {
    return this._redisClient;
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this._redisClient.set(key, value, 'EX', ttl);
    } else {
      await this._redisClient.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return this._redisClient.get(key);
  }

  public async del(key: string): Promise<void> {
    await this._redisClient.del(key);
  }

  public async increment(key: string): Promise<number> {
    return this._redisClient.incr(key);
  }

  public async expire(key: string, ttl: number): Promise<void> {
    await this._redisClient.expire(key, ttl);
  }

  public onModuleDestroy(): void {
    this._redisClient.quit();
  }
}

