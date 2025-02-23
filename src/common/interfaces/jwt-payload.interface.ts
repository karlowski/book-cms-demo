import { RolesEnum } from '../enums/roles.enum';

export interface IJwtPayload {
  userId: number;
  role: RolesEnum;
}
