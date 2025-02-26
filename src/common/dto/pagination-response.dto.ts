import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationResponseDto<T> {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  itemsTotal: number;

  @Field(() => Int)
  pagesTotal: number;
}