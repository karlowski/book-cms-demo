import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';
import { Book } from '../entities/book.entity';
import { BookFiltersDto } from './dto/book-filters.input';
import { CacheRedisService } from '../common/services/cache-redis.service';
import { CacheKeysEnum } from '../common/enums/cache-keys.enum';


@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly _bookRepository: Repository<Book>,
    private readonly _cacheService: CacheRedisService
  ) {}

  public async create(createBookInput: CreateBookInput): Promise<Book> {
    const book = await this._bookRepository.findOneBy({ 
      title: createBookInput.title, 
      publishedIn: createBookInput.publishedIn 
    });

    if (book) {
      throw new BadRequestException('Book already exists');
    }

    const bookEntity = this._bookRepository.create({ ...createBookInput });
    const bookCreated = await this._bookRepository.save(bookEntity);

    await this._cacheService.deleteByPattern(`${CacheKeysEnum.BOOK}:*`);

    return bookCreated;
  }

  public async findAll(filters: BookFiltersDto): Promise<PaginationResponseDto<Book>> {
    const { page, take, title, publishedIn, authorId, authorName, orderBy = 'id', order = 'DESC' } = filters;
    const cacheKey = `${CacheKeysEnum.BOOK}:${JSON.stringify(filters)}`;
    
    const cachedData = await this._cacheService.get<PaginationResponseDto<Book>>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const queryBuilder = this._bookRepository.createQueryBuilder('book');

    queryBuilder.leftJoinAndSelect('book.author', 'author');

    if (title) {
      queryBuilder.andWhere('book.title ILIKE :title', { title: `%${title}%` }); // Note: yep, not the best one
    }
    if (publishedIn) {
      queryBuilder.andWhere('book.publishedIn = :publishedIn', { publishedIn });
    }
    if (authorId) {
      queryBuilder.andWhere('book.authorId = :authorId', { authorId });
    }
    if (authorName) {
      queryBuilder.andWhere('author.name = :authorName', { authorName: `%${authorName}%` }); // Note: same
    }

    queryBuilder.addOrderBy(`book.${orderBy.toString()}`, order);

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
    }

    await this._cacheService.set(cacheKey, data);  

    return data;
  }

  public async findOne(id: number): Promise<Book | null> {
    const cacheKey = `${CacheKeysEnum.BOOK}:${id}`;
    const cachedBook = await this._cacheService.get<Book>(cacheKey);

    if (cachedBook) {
      return cachedBook;
    };

    const book = await this._bookRepository.findOne({
      where: { id },
      relations: {
        author: true
      }
    });
    if (book) {
      await this._cacheService.set(cacheKey, book);
    }
    
    return book;
  }

  public async update(id: number, updateBookInput: UpdateBookInput): Promise<void> {
    const book = await this._bookRepository.findOneBy({ id });

    if (!book) {
      throw new BadRequestException('No book found');
    }

    await this._bookRepository.save({ ...book, ...updateBookInput });
    await this._cacheService.deleteByPattern(`${CacheKeysEnum.BOOK}:*`);
  }

  public async remove(id: number): Promise<void> {
    await this._bookRepository.delete(id);
    await this._cacheService.deleteByPattern(`${CacheKeysEnum.BOOK}:*`);
  }
}
