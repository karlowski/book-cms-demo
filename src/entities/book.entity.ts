import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Author } from './author.entity';


@ObjectType()
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description?: string;

  @Column({ name: 'published_in' })
  @Field()
  publishedIn: number;

  @Column({ name: 'author_id' })
  @Field()
  authorId: number;

  @ManyToOne(() => Author, author => author.books)
  @JoinColumn({ name: 'author_id'  })
  author: Author;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  @Field()
  createdAt: string;
}
