import { Injectable } from '@nestjs/common';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { DynamoDBRecord } from './interfaces/dynamodb-record.interface';


@Injectable()
export class DynamoDBService {
  constructor(private readonly dynamoDBClient: DynamoDBClient) { }

  public async write(tableName: string, record: DynamoDBRecord): Promise<void> {
    const timestamp = new Date().toISOString();

    const params = {
      TableName: tableName,
      Item: {
        PK: { S: `USER#${record.PK}` },
        SK: { S: `${record.action}#${timestamp}` },
        action: { S: record.action },
        metadata: { S: JSON.stringify(record.metadata) },
        timestamp: { S: timestamp },
      },
    };

    await this.dynamoDBClient.send(new PutItemCommand(params));
  }
}