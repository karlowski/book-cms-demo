import { Field, InputType, Int } from '@nestjs/graphql';

import { PaginationInput } from '../../common/dto/pagination.input';
import { Author } from '../../entities/author.entity';


@InputType()
export class AuthorFiltersDto extends PaginationInput<Author> {
  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  publishedIn?: number;
}