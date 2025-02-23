import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { AuthorService } from './author.service';
import { Author } from '../entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthorFiltersDto } from './dto/author-filters.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';
import { RolesPermissionAccess } from '../common/decorators/roles-permission-access.decorator';
import { RolesEnum } from '../common/enums/roles.enum';
import { Roles } from '../common/decorators/roles.decorator';


@RolesPermissionAccess()
@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Roles(RolesEnum.ADMIN)
  @Mutation(() => Author)
  public async createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput): Promise<Author> {
    return this.authorService.create(createAuthorInput);
  }

  @Roles(RolesEnum.USER)
  @Query(() => [Author])
  public async findAllAuthors(@Args('filters') filters: AuthorFiltersDto): Promise<PaginationResponseDto<Author>> {
    return this.authorService.findAll(filters);
  }

  @Roles(RolesEnum.USER)
  @Query(() => Author)
  public async findOneAuthor(@Args('id', { type: () => Int }) id: number): Promise<Author | null> {
    return this.authorService.findOne(id);
  }

  @Roles(RolesEnum.ADMIN)
  @Mutation(() => Author)
  public async updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput): Promise<void> {
    return this.authorService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Roles(RolesEnum.ADMIN)
  @Mutation(() => Author)
  public async removeAuthor(@Args('id', { type: () => Int }) id: number): Promise<void> {
    return this.authorService.remove(id);
  }
}
