import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users_roles')
export class UserRole {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;
}