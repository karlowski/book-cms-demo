import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DynamoDBService } from '../../dynamodb/dynamodb.service';


@Injectable()
export class UserActivityLoggerService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _dynamoDbService: DynamoDBService
  ) {}

  public async log(userId: string, action: string, metadata: Record<string, any>): Promise<void> {
    const tableName = this._configService.get<string>('DYNAMODB_USER_LOGS_TABLE_NAME') as string;
    
    await this._dynamoDbService.write(tableName, {
      PK: userId,
      action,
      metadata
    });
  }
}