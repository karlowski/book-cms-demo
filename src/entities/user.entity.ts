import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { RolesEnum } from '../common/enums/roles.enum';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    transformer: {
      to(data: string): string {
        return data;
      },
      from(data: string): string | null {
        return data ? data.toLowerCase() : null;
      }
    }
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    transformer: {
      to(data: string[]): string | null {
        return data ? data.join(',') : null;
      },
      from(data: string): string[] {
        return data ? data.split(',') : [];
      }
    }
  })
  roles: RolesEnum[];

  @Column()
  name?: string;

  @Column({ name: 'last_name'  })
  lastName?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  createdAt: Date;
}
