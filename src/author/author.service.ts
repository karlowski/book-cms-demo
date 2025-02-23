import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from '../entities/author.entity';
import { AuthorFiltersDto } from './dto/author-filters.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';
import { CacheRedisService } from '../common/services/cache-redis.service';
import { CacheKeysEnum } from '../common/enums/cache-keys.enum';


@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author) private readonly _authorRepository: Repository<Author>,
    private readonly _cacheService: CacheRedisService
  ) {}
  
  public async create(createAuthorInput: CreateAuthorInput): Promise<Author> {
    const author = await this._authorRepository.findOneBy({ name: createAuthorInput.name });
  
    if (author) {
      throw new BadRequestException('Author already exists');
    }
  
    const authorEntity = this._authorRepository.create({ ...createAuthorInput });
    const authorCreated = await this._authorRepository.save(authorEntity);

    await this._cacheService.deleteByPattern(`${CacheKeysEnum.AUTHOR}:*`);

    return authorCreated;
  }
  
  public async findAll(filters: AuthorFiltersDto): Promise<PaginationResponseDto<Author>> {
    const { page, take, name, orderBy = 'id', order = 'DESC' } = filters;
    const cacheKey = `${CacheKeysEnum.AUTHOR}:${JSON.stringify(filters)}`;

    const cachedData = await this._cacheService.get<PaginationResponseDto<Author>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryBuilder = this._authorRepository.createQueryBuilder('author');
  
    queryBuilder.leftJoinAndSelect('author.books', 'book');
  
    if (name) {
      queryBuilder.andWhere('author.name ILIKE :name', { name: `%${name}%` }); // Note: yep, not the best one
    }
  
    queryBuilder.addOrderBy(`author.${orderBy.toString()}`, order);
  
    const [items, itemsTotal] = await queryBuilder
      .skip((page - 1) * take)
      .take(take)
      .getManyAndCount();
    const data = {
      page,
      take,
      itemsTotal,
      pagesTotal: Math.ceil(itemsTotal / take),
      items,
    };

    await this._cacheService.set(cacheKey, data);

    return data;
  }
  
  public async findOne(id: number): Promise<Author | null> {
    const cacheKey = `${CacheKeysEnum.AUTHOR}:${id}`;
    const cackedAuthor = await this._cacheService.get<Author>(cacheKey);

    if (cackedAuthor) {
      return cackedAuthor;
    }

    const author = await this._authorRepository.findOne({
      where: { id },
      relations: {
        books: true
      }
    });
    if (author) {
      await this._cacheService.set(cacheKey, author);
    }

    return author;
  }
  
  public async update(id: number, updateAuthorInput: UpdateAuthorInput) {
    const author = await this._authorRepository.findOneBy({ id });
  
    if (!author) {
      throw new BadRequestException('No author found');
    }
  
    await this._authorRepository.save({ ...author, ...updateAuthorInput });
    await this._cacheService.deleteByPattern(`${CacheKeysEnum.AUTHOR}:*`);
  }
  
  public async remove(id: number): Promise<void> {
    await this._authorRepository.delete(id);
    await this._cacheService.deleteByPattern(`${CacheKeysEnum.AUTHOR}:*`);
  }
}
