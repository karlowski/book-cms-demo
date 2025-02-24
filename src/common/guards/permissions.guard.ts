import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

import { PermissionsEnum } from '../enums/permissions.enum';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';


@Injectable()
export class PermissionsGuard implements CanActivate {
constructor(private reflector: Reflector, private jwtService: JwtService) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionsEnum[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredPermissions) {
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

      return requiredPermissions.some((permission) => user.permissions.includes(permission));
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      }
      
      return false;
    }
  }
}