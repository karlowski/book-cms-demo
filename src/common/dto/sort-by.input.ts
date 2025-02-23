import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SortByInput<T = any> {
  @Field(() => String, { nullable: true })
  orderBy?: keyof T;

  @Field(() => String, { nullable: true })
  order?: 'ASC' | 'DESC';
}
