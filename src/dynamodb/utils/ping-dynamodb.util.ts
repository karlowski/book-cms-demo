import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '../', '../', '../', 'config', '.env'),
});

async function pingDynamoDB(): Promise<void> {
  const client = new DynamoDBClient(
    {
      region: process.env.AWS_REGION || '',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    }
  );

  const result = await client.send(new ListTablesCommand({}));
  console.log('DynamoDB Tables:', result.TableNames);
}

pingDynamoDB().catch(console.error);