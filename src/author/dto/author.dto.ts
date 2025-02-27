import { Field, ID, ObjectType } from '@nestjs/graphql';

import { BookDto } from '../../book/dto/book.dto';


@ObjectType()
export class AuthorDto {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [BookDto])
  books: BookDto[];

  @Field()
  createdAt: string;
}