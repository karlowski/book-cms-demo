import { Field, ID, ObjectType } from '@nestjs/graphql';

import { AuthorDto } from '../../author/dto/author.dto';


@ObjectType()
export class BookDto {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  publishedIn: number;

  @Field()
  authorId: number;

  @Field(() => AuthorDto)
  author: AuthorDto;

  @Field()
  createdAt: Date;
}