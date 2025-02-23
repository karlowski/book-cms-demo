import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { AuthorService } from './author.service';
import { Author } from '../entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthorFiltersDto } from './dto/author-filters.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';


@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Mutation(() => Author)
  public async createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput): Promise<Author> {
    return this.authorService.create(createAuthorInput);
  }

  @Query(() => [Author])
  public async findAllAuthors(@Args('filters') filters: AuthorFiltersDto): Promise<PaginationResponseDto<Author>> {
    return this.authorService.findAll(filters);
  }

  @Query(() => Author)
  public async findOneAuthor(@Args('id', { type: () => Int }) id: number): Promise<Author | null> {
    return this.authorService.findOne(id);
  }

  @Mutation(() => Author)
  public async updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput): Promise<void> {
    return this.authorService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author)
  public async removeAuthor(@Args('id', { type: () => Int }) id: number): Promise<void> {
    return this.authorService.remove(id);
  }
}
