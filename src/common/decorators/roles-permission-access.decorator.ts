import { applyDecorators, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';


export const RolesPermissionAccess = (): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
