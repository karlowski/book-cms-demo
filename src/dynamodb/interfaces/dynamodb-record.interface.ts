export interface DynamoDBRecord {
  PK: string;
  action: string,
  metadata: Record<string, any>,
}