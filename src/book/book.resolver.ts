import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { BookService } from './book.service';
import { Book } from '../entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { BookFiltersDto } from './dto/book-filters.input';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';


@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly _bookService: BookService) {}

  @Mutation(() => Book)
  public async createBook(@Args('createBookInput') createBookInput: CreateBookInput): Promise<Book> {
    return this._bookService.create(createBookInput);
  }

  @Query(() => [Book])
  public async findAllBooks(@Args('filters') filters: BookFiltersDto): Promise<PaginationResponseDto<Book>> {
    return this._bookService.findAll(filters);
  }

  @Query(() => Book)
  public async findOneBook(@Args('id', { type: () => Int }) id: number): Promise<Book | null> {
    return this._bookService.findOne(id);
  }

  @Mutation(() => Book)
  public async updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput): Promise<void> {
    return this._bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  public async removeBook(@Args('id', { type: () => Int }) id: number): Promise<void> {
    return this._bookService.remove(id);
  }
}
