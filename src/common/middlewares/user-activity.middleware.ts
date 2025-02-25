import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class UserActivityMiddleware implements NestMiddleware {
  constructor(
    
  ) {}

  public async use(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id || request.params.userId || request.body.userId;
    // TODO: add UserActivityLogger.logToDynamoDb()
    next();
  }
}