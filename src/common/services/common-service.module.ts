import { Module } from '@nestjs/common';

import { CacheRedisService } from './cache-redis.service';
import { RedisSharedService } from './redis-shared.service';


@Module({
  providers: [CacheRedisService, RedisSharedService],
  exports: [CacheRedisService, RedisSharedService]
})
export class CommonServiceModule {}