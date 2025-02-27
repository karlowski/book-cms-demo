import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Author } from './author.entity'; 
import { Book } from './book.entity';
import { User } from './user.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';


export const entities = [
  Author,
  Book,
  Permission,
  Role,
  User
];

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule]
})
export class EntitiesModule {}
