import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { BookDto } from './book.dto';


@ObjectType()
export class BookPaginatedDto extends PaginationResponseDto<BookDto> {
  @Field(() => [BookDto])
  items: BookDto[];
}