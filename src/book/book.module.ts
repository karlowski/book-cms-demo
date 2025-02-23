import { Module } from '@nestjs/common';

import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { CommonServiceModule } from '../common/services/common-service.module';
import { EntitiesModule } from '../entities/entities.module';


@Module({
  imports: [EntitiesModule, CommonServiceModule],
  providers: [BookResolver, BookService],
})
export class BookModule {}
