import { PermissionsEnum } from '../enums/permissions.enum';

export interface IJwtPayload {
  userId: number;
  permissions: PermissionsEnum[];
}
