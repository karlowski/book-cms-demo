import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';


export const PermissionAccess = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(JwtAuthGuard, PermissionsGuard));
};
