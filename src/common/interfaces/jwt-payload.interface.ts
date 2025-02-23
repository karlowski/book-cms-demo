import { RolesEnum } from '../enums/roles.enum';

export interface IJwtPayload {
  userId: number;
  roles: RolesEnum[];
}
