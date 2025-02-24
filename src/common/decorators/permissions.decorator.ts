import { SetMetadata } from '@nestjs/common';
import { PermissionsEnum } from '../enums/permissions.enum';

export const Permissions = (...permissions: PermissionsEnum[]) => SetMetadata('permissions', permissions);