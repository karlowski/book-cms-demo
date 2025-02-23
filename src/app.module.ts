import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { AuthorModule } from './author/author.module';
import { AuthModule } from './auth/auth.module';
import { dataSource } from 'config/dataSource';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', 'config', '.env'),
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
    dataSource,
    BookModule,
    AuthorModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
