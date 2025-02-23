import { Module } from '@nestjs/common';

import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { CommonServiceModule } from '../common/services/common-service.module';
import { EntitiesModule } from '../entities/entities.module';


@Module({
  imports: [EntitiesModule, CommonServiceModule],
  providers: [AuthorResolver, AuthorService],
})
export class AuthorModule {}
