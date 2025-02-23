import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Author } from './author.entity';


@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column({ name: 'published_in' })
  publishedIn: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => Author, author => author.books)
  @JoinColumn({ name: 'author_id'  })
  author: Author;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'current_timestamp',
  })
  createdAt: Date;
}
