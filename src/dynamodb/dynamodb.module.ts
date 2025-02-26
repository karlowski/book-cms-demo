import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBService } from './dynamodb.service';


@Module({
  providers: [
    {
      provide: DynamoDBClient,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new DynamoDBClient({
          region: configService.get<string>('AWS_REGION') || '',
          credentials: {
            accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID') || '',
            secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
          },
        });
      },
    },
    DynamoDBService,
  ],
  exports: [DynamoDBService],
})
export class DynamoDBModule { }