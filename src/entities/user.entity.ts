import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './role.entity';


@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
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

  @ManyToMany(() => Role)
  @JoinTable({ 
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    }, 
  })
  roles: Role[];

  @Column()
  name?: string;

  @Column({ name: 'last_name'  })
  lastName?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  createdAt: string;
}
