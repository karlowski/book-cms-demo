import { Field, InputType, Int } from '@nestjs/graphql';

import { PaginationInput } from '../../common/dto/pagination.input';
import { Book } from '../../entities/book.entity';


@InputType()
export class BookFiltersDto extends PaginationInput<Book> {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  publishedIn?: number;

  @Field(() => Int, { nullable: true })
  authorId?: number;

  @Field(() => String, { nullable: true })
  authorName?: string;
}