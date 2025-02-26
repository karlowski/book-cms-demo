import { Module } from '@nestjs/common';

import { CacheRedisService } from './cache-redis.service';
import { RedisSharedService } from './redis-shared.service';
import { UserActivityLoggerService } from './user-activity-logger.service';
import { DynamoDBModule } from '../../dynamodb/dynamodb.module';


@Module({
  imports: [DynamoDBModule],
  providers: [
    CacheRedisService, 
    RedisSharedService,
    UserActivityLoggerService
  ],
  exports: [
    CacheRedisService, 
    RedisSharedService,
    UserActivityLoggerService
  ]
})
export class CommonServiceModule {}