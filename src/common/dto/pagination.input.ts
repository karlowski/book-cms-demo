import { Field, InputType, Int } from '@nestjs/graphql';

import { SortByInput } from './sort-by.input';


@InputType()
export class PaginationInput<T = any> extends SortByInput<T> {
  @Field(() => Int, { defaultValue: 1 })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  take: number = 10;
}