import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { AuthorDto } from './author.dto';


@ObjectType()
export class AuthorPaginatedDto extends PaginationResponseDto<AuthorDto> {
  @Field(() => [AuthorDto])
  items: AuthorDto[];
}