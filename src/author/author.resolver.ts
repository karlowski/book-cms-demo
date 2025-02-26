import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { AuthorService } from './author.service';
import { Author } from '../entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { AuthorFiltersDto } from './dto/author-filters.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';
import { PermissionAccess } from '../common/decorators/permission-access.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { PermissionsEnum } from '../common/enums/permissions.enum';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import { UserActivityInterceptor } from '../common/interceptors/user-activity.interceptor';


@PermissionAccess()
@Resolver(() => Author)
export class AuthorResolver {
  constructor(private readonly authorService: AuthorService) {}

  @Permissions(PermissionsEnum.EDIT)
  @Mutation(() => Author)
  public async createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput): Promise<Author> {
    return this.authorService.create(createAuthorInput);
  }

  @UseGuards(RateLimitGuard)
  @Permissions(PermissionsEnum.READ)
  @Query(() => [Author])
  @UseInterceptors(UserActivityInterceptor)
  public async findAllAuthors(@Args('filters') filters: AuthorFiltersDto): Promise<PaginationResponseDto<Author>> {
    return this.authorService.findAll(filters);
  }

  @UseGuards(RateLimitGuard)
  @Permissions(PermissionsEnum.READ)
  @Query(() => Author)
  @UseInterceptors(UserActivityInterceptor)
  public async findOneAuthor(@Args('id', { type: () => Int }) id: number): Promise<Author | null> {
    return this.authorService.findOne(id);
  }

  @Permissions(PermissionsEnum.EDIT)
  @Mutation(() => Author)
  public async updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput): Promise<void> {
    return this.authorService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Permissions(PermissionsEnum.EDIT)
  @Mutation(() => Author)
  public async removeAuthor(@Args('id', { type: () => Int }) id: number): Promise<void> {
    return this.authorService.remove(id);
  }
}
