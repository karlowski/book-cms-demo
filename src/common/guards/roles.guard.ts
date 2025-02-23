import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

import { RolesEnum } from '../enums/roles.enum';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<RolesEnum>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRole) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [prefix, token] = authHeader.split(' ');

    if (!token) {
      throw new ForbiddenException('No token provided');
    }

    try {
      const user: IJwtPayload = this.jwtService.verify(token);

      return requiredRole === user.role;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      }
      
      return false;
    }
  }
}
